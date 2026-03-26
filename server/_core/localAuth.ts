/**
 * Local authentication: username + password login
 * Independent of Manus OAuth. Uses bcryptjs for password hashing.
 * Session cookie is the same JWT cookie used by OAuth auth, so the
 * existing authenticateRequest / protectedProcedure middleware works
 * transparently for both login methods.
 */

import bcrypt from "bcryptjs";
import type { Express } from "express";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as db from "../db";

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function registerLocalAuthRoutes(app: Express) {
  /**
   * POST /api/auth/local/login
   * Body: { username: string, password: string }
   * Response: { success: true, role: string } | { error: string }
   */
  app.post("/api/auth/local/login", async (req, res) => {
    try {
      const { username, password } = req.body ?? {};

      if (!username || !password) {
        return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
      }

      const user = await db.getUserByUsername(String(username).trim().toLowerCase());

      if (!user) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: "Cuenta desactivada. Contacte con el administrador." });
      }

      if (!user.passwordHash) {
        return res.status(401).json({ error: "Este usuario no tiene contraseña configurada. Use el acceso OAuth." });
      }

      const valid = await verifyPassword(String(password), user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      // Create JWT session (same format as OAuth login)
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name ?? username,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Update lastSignedIn
      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

      return res.json({ success: true, role: user.role, name: user.name });
    } catch (err) {
      console.error("[LocalAuth] Login error:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });
}
