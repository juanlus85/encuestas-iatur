-- ================================================================
-- Inserción de conteos peatonales - Pl. Venerables (09) ↔ 09.03 Gloria
-- Fecha: 2026-05-01 · Encuestador: Concepción Foronda (conchaenc · ID 90420)
-- GPS: 37.38501370731532, -5.98985875816767
-- Verificación: 09→09.03 = 579 | 09.03→09 = 500
-- Franjas (hora central usada como recordedAt):
--   10:35-10:50 → 10:42
--   12:15-12:30 → 12:22
--   12:30-12:45 → 12:37
--   12:45-13:00 → 12:52  (etiquetada "12:15-12:30" en el original, corregida)
-- ================================================================

START TRANSACTION;

-- Franja 10:35-10:50 (hora central 10:42)
INSERT INTO `pedestrian_passes`
  (`encuestadorId`, `encuestadorName`, `encuestadorIdentifier`,
   `surveyPoint`, `surveyPointCode`,
   `directionLabel`, `flowOrigin`, `flowDestination`,
   `count`, `latitude`, `longitude`, `gpsAccuracy`,
   `recordedAt`, `createdAt`)
VALUES
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09 Pl. Venerables → 09.03 Gloria', '09', '09.03',
   132, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 10:42:00', '2026-05-01 10:42:00'),
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09.03 Gloria → 09 Pl. Venerables', '09.03', '09',
   43, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 10:42:00', '2026-05-01 10:42:00');

-- Franja 12:15-12:30 (hora central 12:22)
INSERT INTO `pedestrian_passes`
  (`encuestadorId`, `encuestadorName`, `encuestadorIdentifier`,
   `surveyPoint`, `surveyPointCode`,
   `directionLabel`, `flowOrigin`, `flowDestination`,
   `count`, `latitude`, `longitude`, `gpsAccuracy`,
   `recordedAt`, `createdAt`)
VALUES
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09 Pl. Venerables → 09.03 Gloria', '09', '09.03',
   191, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 12:22:00', '2026-05-01 12:22:00'),
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09.03 Gloria → 09 Pl. Venerables', '09.03', '09',
   134, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 12:22:00', '2026-05-01 12:22:00');

-- Franja 12:30-12:45 (hora central 12:37)
INSERT INTO `pedestrian_passes`
  (`encuestadorId`, `encuestadorName`, `encuestadorIdentifier`,
   `surveyPoint`, `surveyPointCode`,
   `directionLabel`, `flowOrigin`, `flowDestination`,
   `count`, `latitude`, `longitude`, `gpsAccuracy`,
   `recordedAt`, `createdAt`)
VALUES
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09 Pl. Venerables → 09.03 Gloria', '09', '09.03',
   125, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 12:37:00', '2026-05-01 12:37:00'),
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09.03 Gloria → 09 Pl. Venerables', '09.03', '09',
   164, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 12:37:00', '2026-05-01 12:37:00');

-- Franja 12:45-13:00 (hora central 12:52) — etiquetada "12:15-12:30" en original
INSERT INTO `pedestrian_passes`
  (`encuestadorId`, `encuestadorName`, `encuestadorIdentifier`,
   `surveyPoint`, `surveyPointCode`,
   `directionLabel`, `flowOrigin`, `flowDestination`,
   `count`, `latitude`, `longitude`, `gpsAccuracy`,
   `recordedAt`, `createdAt`)
VALUES
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09 Pl. Venerables → 09.03 Gloria', '09', '09.03',
   131, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 12:52:00', '2026-05-01 12:52:00'),
  (90420, 'Concepción Foronda', 'conchaenc',
   '09 Pl. Venerables', '09',
   '09.03 Gloria → 09 Pl. Venerables', '09.03', '09',
   159, 37.3850137, -5.9898588, 5.00,
   '2026-05-01 12:52:00', '2026-05-01 12:52:00');

COMMIT;
-- Total registros: 8
-- Verificación: 09→09.03 = 132+191+125+131 = 579 ✓
--               09.03→09 =  43+134+164+159 = 500 ✓
