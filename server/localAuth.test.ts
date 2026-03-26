import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./_core/localAuth";

describe("localAuth - password hashing", () => {
  it("hashes a password and verifies it correctly", async () => {
    const plain = "Sevilla2025!";
    const hash = await hashPassword(plain);
    expect(hash).not.toBe(plain);
    expect(hash.length).toBeGreaterThan(20);
    const valid = await verifyPassword(plain, hash);
    expect(valid).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("correctPassword");
    const valid = await verifyPassword("wrongPassword", hash);
    expect(valid).toBe(false);
  });

  it("produces different hashes for the same password (salting)", async () => {
    const hash1 = await hashPassword("samePassword");
    const hash2 = await hashPassword("samePassword");
    expect(hash1).not.toBe(hash2);
  });
});
