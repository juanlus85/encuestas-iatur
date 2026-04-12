-- ============================================================
-- SQL PARA PRODUCCIÓN — Encuestas Sevilla FeelingLAND
-- Fecha: 2026-04-12
-- Ejecutar en la BD de producción (TiDB/MySQL)
-- ============================================================
-- ORDEN DE EJECUCIÓN:
--   1. Migración 0013: DEFAULT NOW() en startedAt/finishedAt
--   2. Corrección de flowOrigin/flowDestination en pedestrian_passes
--   3. Corrección de timestamps existentes (opcional, si hay datos con 2h de desfase)
--   4. Seed de encuestadores y turnos
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- BLOQUE 1: Migración 0013
-- Añade DEFAULT NOW() a startedAt y finishedAt en las tres
-- tablas principales, igual que createdAt.
-- Esto garantiza que TiDB use su hora interna (UTC+2) en lugar
-- de depender del timestamp enviado desde Node.js.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE `survey_responses`
  MODIFY COLUMN `startedAt` timestamp NOT NULL DEFAULT (now()),
  MODIFY COLUMN `finishedAt` timestamp DEFAULT (now());

ALTER TABLE `survey_responses_flat`
  MODIFY COLUMN `startedAt` timestamp NOT NULL DEFAULT (now()),
  MODIFY COLUMN `finishedAt` timestamp DEFAULT (now());

ALTER TABLE `pedestrian_sessions`
  MODIFY COLUMN `startedAt` timestamp NOT NULL DEFAULT (now()),
  MODIFY COLUMN `finishedAt` timestamp DEFAULT (now());


-- ─────────────────────────────────────────────────────────────
-- BLOQUE 2: Enum timeSlot — añadir 'mediodia'
-- Solo si la BD de producción no tiene aún el valor 'mediodia'
-- en el enum de timeSlot.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE `survey_responses`
  MODIFY COLUMN `timeSlot`
    ENUM('manana','mediodia','tarde','noche','fin_semana');

ALTER TABLE `survey_responses_flat`
  MODIFY COLUMN `timeSlot`
    ENUM('manana','mediodia','tarde','noche','fin_semana');

ALTER TABLE `field_metrics`
  MODIFY COLUMN `timeSlot`
    ENUM('manana','mediodia','tarde','noche','fin_semana');

ALTER TABLE `pedestrian_sessions`
  MODIFY COLUMN `timeSlot`
    ENUM('manana','mediodia','tarde','noche','fin_semana');


-- ─────────────────────────────────────────────────────────────
-- BLOQUE 3: Corrección de flowOrigin / flowDestination
-- en pedestrian_passes (extrae el código del nombre completo)
-- Ejemplo: "01 Virgen de los Reyes → 01.01 Puerta Catedral"
--   flowOrigin      = "01"
--   flowDestination = "01.01"
-- ─────────────────────────────────────────────────────────────

-- Extraer código de flowOrigin (todo antes del primer espacio)
UPDATE `pedestrian_passes`
SET `flowOrigin` = SUBSTRING_INDEX(`flowOrigin`, ' ', 1)
WHERE `flowOrigin` REGEXP '^[0-9]+ ';

-- Extraer código de flowDestination (todo antes del primer espacio)
UPDATE `pedestrian_passes`
SET `flowDestination` = SUBSTRING_INDEX(`flowDestination`, ' ', 1)
WHERE `flowDestination` REGEXP '^[0-9]+\\.[0-9]+ ';

-- Extraer código de surveyPointCode (todo antes del primer espacio)
UPDATE `pedestrian_passes`
SET `surveyPointCode` = SUBSTRING_INDEX(`surveyPointCode`, ' ', 1)
WHERE `surveyPointCode` REGEXP '^[0-9]+ ';


-- ─────────────────────────────────────────────────────────────
-- BLOQUE 4 (OPCIONAL): Corrección de timestamps existentes
-- Si hay encuestas guardadas antes de esta corrección con
-- startedAt/finishedAt 2 horas antes de lo correcto,
-- este UPDATE los ajusta. REVISAR antes de ejecutar.
-- ─────────────────────────────────────────────────────────────

-- DESCOMENTÁ SOLO SI NECESITAS CORREGIR DATOS HISTÓRICOS:
-- UPDATE `survey_responses`
-- SET
--   startedAt  = DATE_ADD(startedAt,  INTERVAL 2 HOUR),
--   finishedAt = DATE_ADD(finishedAt, INTERVAL 2 HOUR)
-- WHERE startedAt < '2026-04-12 12:00:00';

-- UPDATE `survey_responses_flat`
-- SET
--   startedAt  = DATE_ADD(startedAt,  INTERVAL 2 HOUR),
--   finishedAt = DATE_ADD(finishedAt, INTERVAL 2 HOUR)
-- WHERE startedAt < '2026-04-12 12:00:00';


-- ─────────────────────────────────────────────────────────────
-- BLOQUE 5: Seed de encuestadores y turnos
-- ─────────────────────────────────────────────────────────────

-- ============================================================
-- SEED: Encuestadores y Turnos — Encuestas Sevilla FeelingLAND
-- Generado: 2026-04-11
-- Contraseña por defecto para todos: Iatur2026!
-- ============================================================
-- RESUMEN DE ENCUESTADORES:
--   ENC-01  ElenaT    → Elena de la Torre Monge         → residentes
--   ENC-02  Rocio     → Rocío Blanco Guzmán             → visitantes
--   ENC-03  ElenaG    → Elena González                  → residentes
--   ENC-04  Paula     → María Paula Caballero Pérez     → visitantes
--   ENC-05  Estefany  → Estefany Grenier Agula          → visitantes
--   ENC-06  Fran      → Francisco Javier Pedreño Serrano → ambos (sustituto)
-- ============================================================

-- ─── 1. USUARIOS ─────────────────────────────────────────────────────────────
INSERT INTO users (openId, name, loginMethod, role, username, passwordHash, identifier, surveyTypeAssigned, isActive)
VALUES
  ('local-enc-01', 'Elena de la Torre Monge',           'local', 'encuestador',
   'ElenaT',    '$2b$12$0XQCmghZOlrchB20VD62OOmtCuglTMWMecdfqseihELH7MGUEvVwm',
   'ENC-01', 'residentes', true),
  ('local-enc-02', 'Rocío Blanco Guzmán',               'local', 'encuestador',
   'Rocio',     '$2b$12$2YRYd63wQoqrd/MFmsXzFufk/aHY8Mu3CJtjnetxJNml9aQUNX5gK',
   'ENC-02', 'visitantes', true),
  ('local-enc-03', 'Elena González',                    'local', 'encuestador',
   'ElenaG',    '$2b$12$fT0zI3NeKwywcnErQU27euZ9LaCHuWxkX6ohEE5DIyLt8WW.pJoKu',
   'ENC-03', 'residentes', true),
  ('local-enc-04', 'María Paula Caballero Pérez',       'local', 'encuestador',
   'Paula',     '$2b$12$GzCTTQSdgV1F4.Opu11Nu.KCZlo/tpERzsh/noaMxJPky0tXfW4fu',
   'ENC-04', 'visitantes', true),
  ('local-enc-05', 'Estefany Grenier Agula',            'local', 'encuestador',
   'Estefany',  '$2b$12$LZ8R3UWoF7KfoHDRf9o5mu7Qn3S/XCweOV.aW5AM2kPtZGxOspK1O',
   'ENC-05', 'visitantes', true),
  ('local-enc-06', 'Francisco Javier Pedreño Serrano',  'local', 'encuestador',
   'Fran',      '$2b$12$T.7IphLx5XUxJCQqDxpLneDG.B2p6KZhrHmjCEs78E8KFyFAnAdBm',
   'ENC-06', 'ambos', true)
ON DUPLICATE KEY UPDATE
  name               = VALUES(name),
  username           = VALUES(username),
  passwordHash       = VALUES(passwordHash),
  identifier         = VALUES(identifier),
  surveyTypeAssigned = VALUES(surveyTypeAssigned),
  isActive           = true;

-- ─── 2. TURNOS ───────────────────────────────────────────────────────────────
-- ── SEMANA 1 ──────────────────────────────────────────────────────────────────
-- 16/04/2026 Jueves 09:30-12:00
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-04-16','09:30','12:00','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-04-16','09:30','12:00','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-04-16','09:30','12:00','04 Plaza Alfaro',        'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-04-16','09:30','12:00','01 Virgen de los Reyes', 'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-04-16','09:30','12:00','05 Patio de Banderas',   'visitantes', NULL);
-- 19/04/2026 Domingo 12:00-14:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-04-19','12:00','14:30','05 Patio de Banderas',   'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-04-19','12:00','14:30','02 Mateos Gago',         'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-04-19','12:00','14:30','01 Virgen de los Reyes', 'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-04-19','12:00','14:30','04 Plaza Alfaro',        'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-04-19','12:00','14:30','03 Agua/Vida',           'visitantes', NULL);
-- ── SEMANA 2 ──────────────────────────────────────────────────────────────────
-- 22/04/2026 Miércoles 16:00-18:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-04-22','16:00','18:30','01 Virgen de los Reyes', 'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-04-22','16:00','18:30','04 Plaza Alfaro',        'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-04-22','16:00','18:30','05 Patio de Banderas',   'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-04-22','16:00','18:30','02 Mateos Gago',         'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-04-22','16:00','18:30','03 Agua/Vida',           'visitantes', NULL);
-- 26/04/2026 Domingo 18:30-21:00
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-04-26','18:30','21:00','03 Agua/Vida',           'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-04-26','18:30','21:00','05 Patio de Banderas',   'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-04-26','18:30','21:00','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-04-26','18:30','21:00','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-04-26','18:30','21:00','04 Plaza Alfaro',        'visitantes', NULL);
-- ── SEMANA 3 ──────────────────────────────────────────────────────────────────
-- 29/04/2026 Miércoles 09:30-12:00
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-04-29','09:30','12:00','04 Plaza Alfaro',        'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-04-29','09:30','12:00','01 Virgen de los Reyes', 'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-04-29','09:30','12:00','03 Agua/Vida',           'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-04-29','09:30','12:00','05 Patio de Banderas',   'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-04-29','09:30','12:00','02 Mateos Gago',         'visitantes', NULL);
-- 03/05/2026 Domingo 12:00-14:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-03','12:00','14:30','03 Agua/Vida',           'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-03','12:00','14:30','04 Plaza Alfaro',        'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-03','12:00','14:30','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-03','12:00','14:30','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-03','12:00','14:30','01 Virgen de los Reyes', 'visitantes', NULL);
-- ── SEMANA 4 ──────────────────────────────────────────────────────────────────
-- 06/05/2026 Miércoles 16:00-18:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-06','16:00','18:30','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-06','16:00','18:30','05 Patio de Banderas',   'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-06','16:00','18:30','04 Plaza Alfaro',        'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-06','16:00','18:30','01 Virgen de los Reyes', 'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-06','16:00','18:30','02 Mateos Gago',         'visitantes', NULL);
-- 10/05/2026 Domingo 18:30-21:00
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-10','18:30','21:00','01 Virgen de los Reyes', 'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-10','18:30','21:00','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-10','18:30','21:00','05 Patio de Banderas',   'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-10','18:30','21:00','02 Mateos Gago',         'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-10','18:30','21:00','04 Plaza Alfaro',        'visitantes', NULL);
-- ── SEMANA 5 ──────────────────────────────────────────────────────────────────
-- 13/05/2026 Miércoles 09:30-12:00
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-13','09:30','12:00','05 Patio de Banderas',   'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-13','09:30','12:00','01 Virgen de los Reyes', 'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-13','09:30','12:00','03 Agua/Vida',           'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-13','09:30','12:00','04 Plaza Alfaro',        'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-13','09:30','12:00','02 Mateos Gago',         'visitantes', NULL);
-- 17/05/2026 Domingo 12:00-14:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-17','12:00','14:30','04 Plaza Alfaro',        'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-17','12:00','14:30','05 Patio de Banderas',   'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-17','12:00','14:30','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-17','12:00','14:30','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-17','12:00','14:30','01 Virgen de los Reyes', 'visitantes', NULL);
-- ── SEMANA 6 ──────────────────────────────────────────────────────────────────
-- 19/05/2026 Martes 12:00-14:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-19','12:00','14:30','01 Virgen de los Reyes', 'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-19','12:00','14:30','02 Mateos Gago',         'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-19','12:00','14:30','01 Virgen de los Reyes', 'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-19','12:00','14:30','04 Plaza Alfaro',        'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-19','12:00','14:30','03 Agua/Vida',           'visitantes', NULL);
-- 24/05/2026 Domingo 09:30-12:00
-- Técnico 3 (ElenaG) sustituida por Francisco Javier Pedreño Serrano en Plaza Alfaro
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-24','09:30','12:00','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-24','09:30','12:00','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Fran'),      '2026-05-24','09:30','12:00','04 Plaza Alfaro',        'residentes', 'Sustitución de ElenaG'),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-24','09:30','12:00','01 Virgen de los Reyes', 'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-24','09:30','12:00','05 Patio de Banderas',   'visitantes', NULL);
-- ── SEMANA 7 ──────────────────────────────────────────────────────────────────
-- 27/05/2026 Miércoles 16:00-18:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-27','16:00','18:30','05 Patio de Banderas',   'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-27','16:00','18:30','02 Mateos Gago',         'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-27','16:00','18:30','01 Virgen de los Reyes', 'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-27','16:00','18:30','04 Plaza Alfaro',        'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-27','16:00','18:30','03 Agua/Vida',           'visitantes', NULL);
-- 29/05/2026 Viernes 12:00-14:30
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-05-29','12:00','14:30','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-05-29','12:00','14:30','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-05-29','12:00','14:30','04 Plaza Alfaro',        'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-05-29','12:00','14:30','01 Virgen de los Reyes', 'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-05-29','12:00','14:30','05 Patio de Banderas',   'visitantes', NULL);
-- ── SEMANA 8 ──────────────────────────────────────────────────────────────────
-- 01/06/2026 Lunes 18:30-21:00
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-06-01','18:30','21:00','05 Patio de Banderas',   'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-06-01','18:30','21:00','02 Mateos Gago',         'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-06-01','18:30','21:00','01 Virgen de los Reyes', 'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-06-01','18:30','21:00','04 Plaza Alfaro',        'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-06-01','18:30','21:00','03 Agua/Vida',           'visitantes', NULL);
-- 06/06/2026 Sábado 09:30-12:00
INSERT INTO shifts (encuestadorId, shiftDate, startTime, endTime, surveyPoint, surveyType, notes) VALUES
  ((SELECT id FROM users WHERE username='ElenaT'),    '2026-06-06','09:30','12:00','02 Mateos Gago',         'residentes', NULL),
  ((SELECT id FROM users WHERE username='Rocio'),     '2026-06-06','09:30','12:00','03 Agua/Vida',           'visitantes', NULL),
  ((SELECT id FROM users WHERE username='ElenaG'),    '2026-06-06','09:30','12:00','04 Plaza Alfaro',        'residentes', NULL),
  ((SELECT id FROM users WHERE username='Paula'),     '2026-06-06','09:30','12:00','01 Virgen de los Reyes', 'visitantes', NULL),
  ((SELECT id FROM users WHERE username='Estefany'),  '2026-06-06','09:30','12:00','05 Patio de Banderas',   'visitantes', NULL);

-- ─── FIN DEL SCRIPT ───────────────────────────────────────────────────────────
-- Contraseña por defecto para todos: Iatur2026!
-- Se recomienda cambiar las contraseñas tras el primer acceso desde el panel de Usuarios.
