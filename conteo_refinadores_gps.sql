-- ================================================================
-- Actualización GPS de conteos peatonales - Plaza Refinadores (06)
-- Fecha: 2026-04-16 · Encuestador: Concepción Foronda (conchaenc · ID 90420)
-- GPS 06→06.01 y 06.01→06 : 37.38566092576158, -5.987546587723321
-- GPS 06→06.02 y 06.02→06 : 37.385477407621984, -5.9878195485061045
-- ================================================================

START TRANSACTION;

-- Flujos 06 Plaza Refinadores ↔ 06.01 Mariscal (4 franjas × 2 sentidos = 8 filas)
UPDATE `pedestrian_passes`
SET
  `latitude`    = 37.3856609,
  `longitude`   = -5.9875466,
  `gpsAccuracy` = 5.00
WHERE
  `encuestadorId`   = 90420
  AND `surveyPointCode` = '06'
  AND `flowOrigin`  IN ('06', '06.01')
  AND `flowDestination` IN ('06', '06.01')
  AND DATE(`recordedAt`) = '2026-04-16';

-- Flujos 06 Plaza Refinadores ↔ 06.02 Mezquita (4 franjas × 2 sentidos = 8 filas)
UPDATE `pedestrian_passes`
SET
  `latitude`    = 37.3854774,
  `longitude`   = -5.9878195,
  `gpsAccuracy` = 5.00
WHERE
  `encuestadorId`   = 90420
  AND `surveyPointCode` = '06'
  AND `flowOrigin`  IN ('06', '06.02')
  AND `flowDestination` IN ('06', '06.02')
  AND DATE(`recordedAt`) = '2026-04-16';

COMMIT;
-- Filas afectadas esperadas: 16 (8 + 8)
