-- ================================================================
-- Corrección de survey_responses_flat
-- Generado comparando CSV original vs CSV corregido
-- Filas con cambios : 32
-- Filas sin cambios : 50
-- ================================================================

START TRANSACTION;

-- id=27  (34 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Paseo de Cristina'  →  '1'
--   r03: 'mas_15'  →  'Paseo de Cristina'
--   r04: 'no'  →  None
--   r05: 'hombre'  →  None
--   r06: '45_64'  →  None
--   r07: '5'  →  'mas_15'
--   r08: '5'  →  'no'
--   r09: '5'  →  '1'
--   r10: '5'  →  '45_64'
--   r11: '3'  →  '5'
--   r13: '4'  →  '5'
--   r14: '3'  →  '5'
--   r15: '5'  →  '3'
--   r16: '3'  →  '5'
--   r17: '5'  →  '4'
--   r20: '5'  →  '3'
--   r21: '3'  →  '5'
--   r22: 'varias_semana'  →  '3'
--   r23: 'nunca'  →  '5'
--   r24: 'menos_1_semana'  →  '5'
--   r25: 'diario'  →  '3'
--   r26: 'nunca'  →  'varias_semana'
--   r27: 'diario'  →  'nunca'
--   r28: 'no'  →  'menos_1_semana'
--   r29: '["ruido","perdida_identidad"]'  →  'diario'
--   r30: '5'  →  'nunca'
--   r31: '2'  →  'diario'
--   r32: '5'  →  'no'
--   r33: '["control_grupos","limitacion_horaria"]'  →  '["ruido","perdida_identidad"]'
--   r34: None  →  '5'
--   r35: None  →  '2'
--   r36: None  →  '5'
--   r37: None  →  '["control_grupos","limitacion_horaria"]'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Paseo de Cristina', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'mas_15', `r08` = 'no', `r09` = '1', `r10` = '45_64', `r11` = '5', `r13` = '5', `r14` = '5', `r15` = '3', `r16` = '5', `r17` = '4', `r20` = '3', `r21` = '5', `r22` = '3', `r23` = '5', `r24` = '5', `r25` = '3', `r26` = 'varias_semana', `r27` = 'nunca', `r28` = 'menos_1_semana', `r29` = 'diario', `r30` = 'nunca', `r31` = 'diario', `r32` = 'no', `r33` = '["ruido","perdida_identidad"]', `r34` = '5', `r35` = '2', `r36` = '5', `r37` = '["control_grupos","limitacion_horaria"]' WHERE `id` = 27;

-- id=28  (31 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Mesón del Moro'  →  '1'
--   r03: 'mas_15'  →  'Mesón del Moro'
--   r04: 'no'  →  None
--   r05: 'hombre'  →  None
--   r06: '45_64'  →  None
--   r07: '5'  →  'mas_15'
--   r08: '5'  →  'no'
--   r09: '5'  →  '1'
--   r10: '5'  →  '45_64'
--   r11: '1'  →  '5'
--   r15: '3'  →  '1'
--   r18: '1'  →  '5'
--   r19: '5'  →  '3'
--   r21: '1'  →  '5'
--   r22: 'diario'  →  '1'
--   r23: 'varias_semana'  →  '5'
--   r24: 'varias_semana'  →  '5'
--   r25: 'diario'  →  '1'
--   r26: '1_semana'  →  'diario'
--   r27: 'diario'  →  'varias_semana'
--   r28: 'evito_calles'  →  'varias_semana'
--   r29: '["dificultad_caminar","dificultad_acceso","cambios_rutas"]'  →  'diario'
--   r30: '5'  →  '1_semana'
--   r31: '5'  →  'diario'
--   r32: '1'  →  'evito_calles'
--   r33: '["agentes_movilidad","limitacion_horaria"]'  →  '["dificultad_caminar","dificultad_acceso","cambios_rutas"]'
--   r34: None  →  '5'
--   r35: None  →  '5'
--   r36: None  →  '1'
--   r37: None  →  '["agentes_movilidad","limitacion_horaria"]'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Mesón del Moro', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'mas_15', `r08` = 'no', `r09` = '1', `r10` = '45_64', `r11` = '5', `r15` = '1', `r18` = '5', `r19` = '3', `r21` = '5', `r22` = '1', `r23` = '5', `r24` = '5', `r25` = '1', `r26` = 'diario', `r27` = 'varias_semana', `r28` = 'varias_semana', `r29` = 'diario', `r30` = '1_semana', `r31` = 'diario', `r32` = 'evito_calles', `r33` = '["dificultad_caminar","dificultad_acceso","cambios_rutas"]', `r34` = '5', `r35` = '5', `r36` = '1', `r37` = '["agentes_movilidad","limitacion_horaria"]' WHERE `id` = 28;

-- id=29  (30 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Mesón del Moro'  →  '1'
--   r03: '6_15'  →  'Mesón del Moro'
--   r04: 'si_yo'  →  None
--   r05: 'mujer'  →  None
--   r06: '30_44'  →  None
--   r07: '5'  →  '6_15'
--   r08: '5'  →  'si_yo'
--   r09: '5'  →  '2'
--   r10: 'ns'  →  '30_44'
--   r11: '4'  →  '5'
--   r13: '2'  →  '5'
--   r14: '5'  →  '99'
--   r15: '5'  →  '4'
--   r17: '5'  →  '2'
--   r22: 'nunca'  →  '5'
--   r23: 'nunca'  →  '5'
--   r24: '1_semana'  →  '5'
--   r25: 'diario'  →  '5'
--   r27: 'diario'  →  'nunca'
--   r28: 'evito_calles'  →  '1_semana'
--   r29: '["dificultad_caminar","cambios_rutas"]'  →  'diario'
--   r30: '3'  →  'nunca'
--   r31: '5'  →  'diario'
--   r32: '4'  →  'evito_calles'
--   r33: '["zonas_peatonales","limitacion_horaria"]'  →  '["dificultad_caminar","cambios_rutas"]'
--   r34: None  →  '3'
--   r35: None  →  '5'
--   r36: None  →  '4'
--   r37: None  →  '["zonas_peatonales","limitacion_horaria"]'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Mesón del Moro', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = '6_15', `r08` = 'si_yo', `r09` = '2', `r10` = '30_44', `r11` = '5', `r13` = '5', `r14` = '99', `r15` = '4', `r17` = '2', `r22` = '5', `r23` = '5', `r24` = '5', `r25` = '5', `r27` = 'nunca', `r28` = '1_semana', `r29` = 'diario', `r30` = 'nunca', `r31` = 'diario', `r32` = 'evito_calles', `r33` = '["dificultad_caminar","cambios_rutas"]', `r34` = '3', `r35` = '5', `r36` = '4', `r37` = '["zonas_peatonales","limitacion_horaria"]' WHERE `id` = 29;

-- id=30  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 30;

-- id=31  (35 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Mesón del Moro'  →  '1'
--   r03: 'mas_15'  →  'Mesón del Moro'
--   r04: 'si_otro'  →  None
--   r05: 'hombre'  →  None
--   r06: '65_75'  →  None
--   r07: '5'  →  'mas_15'
--   r08: '5'  →  'si_otro'
--   r09: '5'  →  '1'
--   r10: '5'  →  '65_75'
--   r13: '4'  →  '5'
--   r14: '4'  →  '5'
--   r15: '4'  →  '5'
--   r16: '3'  →  '5'
--   r18: '5'  →  '4'
--   r19: '2'  →  '4'
--   r20: '5'  →  '3'
--   r21: '1'  →  '4'
--   r22: 'diario'  →  '5'
--   r23: 'nunca'  →  '2'
--   r24: '1_semana'  →  '5'
--   r25: 'nunca'  →  '1'
--   r26: 'nunca'  →  'diario'
--   r27: 'diario'  →  'nunca'
--   r28: 'no'  →  '1_semana'
--   r29: '["dificultad_caminar","cambios_rutas","inseguridad_vial"]'  →  'nunca'
--   r30: '2'  →  'nunca'
--   r31: '4'  →  'diario'
--   r32: '3'  →  'no'
--   r33: '["regulacion_accesos","senalizacion","control_grupos"]'  →  '["dificultad_caminar","cambios_rutas","inseguridad_vial"]'
--   r34: 'Masificación en el centro muchos días, quiere ir a varios lugares pero tiene que ir por otras calles.'  →  '2'
--   r35: None  →  '4'
--   r36: None  →  '3'
--   r37: None  →  '["regulacion_accesos","senalizacion","control_grupos"]'
--   r38: None  →  'Masificación en el centro muchos días, quiere ir a varios lugares pero tiene que ir por otras calles.'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Mesón del Moro', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'mas_15', `r08` = 'si_otro', `r09` = '1', `r10` = '65_75', `r13` = '5', `r14` = '5', `r15` = '5', `r16` = '5', `r18` = '4', `r19` = '4', `r20` = '3', `r21` = '4', `r22` = '5', `r23` = '2', `r24` = '5', `r25` = '1', `r26` = 'diario', `r27` = 'nunca', `r28` = '1_semana', `r29` = 'nunca', `r30` = 'nunca', `r31` = 'diario', `r32` = 'no', `r33` = '["dificultad_caminar","cambios_rutas","inseguridad_vial"]', `r34` = '2', `r35` = '4', `r36` = '3', `r37` = '["regulacion_accesos","senalizacion","control_grupos"]', `r38` = 'Masificación en el centro muchos días, quiere ir a varios lugares pero tiene que ir por otras calles.' WHERE `id` = 31;

-- id=32  (1 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
UPDATE `survey_responses_flat` SET `v06` = '1' WHERE `id` = 32;

-- id=33  (32 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'López de Rueda'  →  '1'
--   r03: '6_15'  →  'López de Rueda'
--   r04: 'no'  →  None
--   r05: 'mujer'  →  None
--   r06: '45_64'  →  None
--   r07: '5'  →  '6_15'
--   r08: '5'  →  'no'
--   r09: '5'  →  '2'
--   r10: '5'  →  '45_64'
--   r11: '1'  →  '5'
--   r13: '4'  →  '5'
--   r15: '2'  →  '1'
--   r17: '5'  →  '4'
--   r18: '4'  →  '5'
--   r19: '5'  →  '2'
--   r21: '2'  →  '5'
--   r22: 'varias_semana'  →  '4'
--   r23: 'varias_semana'  →  '5'
--   r24: '1_semana'  →  '5'
--   r25: 'varias_semana'  →  '2'
--   r27: 'diario'  →  'varias_semana'
--   r28: 'evito_calles'  →  '1_semana'
--   r29: '["dificultad_caminar","ruido","perdida_identidad","inseguridad_vial"]'  →  'varias_semana'
--   r30: '5'  →  'varias_semana'
--   r31: '1'  →  'diario'
--   r32: '1'  →  'evito_calles'
--   r33: '["agentes_movilidad","control_grupos"]'  →  '["dificultad_caminar","ruido","perdida_identidad","inseguridad_vial"]'
--   r34: None  →  '5'
--   r35: None  →  '1'
--   r36: None  →  '1'
--   r37: None  →  '["agentes_movilidad","control_grupos"]'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'López de Rueda', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = '6_15', `r08` = 'no', `r09` = '2', `r10` = '45_64', `r11` = '5', `r13` = '5', `r15` = '1', `r17` = '4', `r18` = '5', `r19` = '2', `r21` = '5', `r22` = '4', `r23` = '5', `r24` = '5', `r25` = '2', `r27` = 'varias_semana', `r28` = '1_semana', `r29` = 'varias_semana', `r30` = 'varias_semana', `r31` = 'diario', `r32` = 'evito_calles', `r33` = '["dificultad_caminar","ruido","perdida_identidad","inseguridad_vial"]', `r34` = '5', `r35` = '1', `r36` = '1', `r37` = '["agentes_movilidad","control_grupos"]' WHERE `id` = 33;

-- id=34  (33 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Mesón del Moro'  →  '1'
--   r03: 'menos_1'  →  'Mesón del Moro'
--   r04: 'no'  →  None
--   r05: 'mujer'  →  None
--   r06: '45_64'  →  None
--   r07: '4'  →  'menos_1'
--   r08: '4'  →  'no'
--   r09: '4'  →  '2'
--   r10: '5'  →  '45_64'
--   r12: '5'  →  '4'
--   r13: '5'  →  '4'
--   r14: '2'  →  '5'
--   r15: '5'  →  '4'
--   r18: '3'  →  '2'
--   r21: '4'  →  '5'
--   r22: 'menos_1_semana'  →  '3'
--   r23: 'nunca'  →  '5'
--   r24: 'nunca'  →  '5'
--   r25: 'diario'  →  '4'
--   r26: 'varias_semana'  →  'menos_1_semana'
--   r27: 'diario'  →  'nunca'
--   r28: 'cambio_horario'  →  'nunca'
--   r29: '["ruido"]'  →  'diario'
--   r30: '3'  →  'varias_semana'
--   r31: '4'  →  'diario'
--   r32: '4'  →  'cambio_horario'
--   r33: '["zonas_peatonales","senalizacion"]'  →  '["ruido"]'
--   r34: 'Ruido muy molesto a altas horas de la noche provocado por los bares'  →  '3'
--   r35: None  →  '4'
--   r36: None  →  '4'
--   r37: None  →  '["zonas_peatonales","senalizacion"]'
--   r38: None  →  'Ruido muy molesto a altas horas de la noche provocado por los bares'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Mesón del Moro', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'menos_1', `r08` = 'no', `r09` = '2', `r10` = '45_64', `r12` = '4', `r13` = '4', `r14` = '5', `r15` = '4', `r18` = '2', `r21` = '5', `r22` = '3', `r23` = '5', `r24` = '5', `r25` = '4', `r26` = 'menos_1_semana', `r27` = 'nunca', `r28` = 'nunca', `r29` = 'diario', `r30` = 'varias_semana', `r31` = 'diario', `r32` = 'cambio_horario', `r33` = '["ruido"]', `r34` = '3', `r35` = '4', `r36` = '4', `r37` = '["zonas_peatonales","senalizacion"]', `r38` = 'Ruido muy molesto a altas horas de la noche provocado por los bares' WHERE `id` = 34;

-- id=35  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 35;

-- id=36  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 36;

-- id=37  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 37;

-- id=38  (35 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Fabiola'  →  '1'
--   r03: 'mas_15'  →  'Fabiola'
--   r04: 'no'  →  None
--   r05: 'hombre'  →  None
--   r06: '65_75'  →  None
--   r07: '5'  →  'mas_15'
--   r08: '5'  →  'no'
--   r09: '5'  →  '1'
--   r10: '5'  →  '65_75'
--   r11: '3'  →  '5'
--   r13: '3'  →  '5'
--   r14: '3'  →  '5'
--   r15: '4'  →  '3'
--   r16: '4'  →  '5'
--   r17: '4'  →  '3'
--   r18: '5'  →  '3'
--   r19: '5'  →  '4'
--   r20: '5'  →  '4'
--   r22: 'varias_semana'  →  '5'
--   r23: 'nunca'  →  '5'
--   r24: 'nunca'  →  '5'
--   r25: 'diario'  →  '4'
--   r26: 'nunca'  →  'varias_semana'
--   r27: 'diario'  →  'nunca'
--   r28: 'no'  →  'nunca'
--   r29: '["ruido","dificultad_caminar"]'  →  'diario'
--   r30: '2'  →  'nunca'
--   r31: '4'  →  'diario'
--   r32: '2'  →  'no'
--   r33: '["regulacion_accesos","control_grupos"]'  →  '["ruido","dificultad_caminar"]'
--   r34: None  →  '2'
--   r35: None  →  '4'
--   r36: None  →  '2'
--   r37: None  →  '["regulacion_accesos","control_grupos"]'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Fabiola', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'mas_15', `r08` = 'no', `r09` = '1', `r10` = '65_75', `r11` = '5', `r13` = '5', `r14` = '5', `r15` = '3', `r16` = '5', `r17` = '3', `r18` = '3', `r19` = '4', `r20` = '4', `r22` = '5', `r23` = '5', `r24` = '5', `r25` = '4', `r26` = 'varias_semana', `r27` = 'nunca', `r28` = 'nunca', `r29` = 'diario', `r30` = 'nunca', `r31` = 'diario', `r32` = 'no', `r33` = '["ruido","dificultad_caminar"]', `r34` = '2', `r35` = '4', `r36` = '2', `r37` = '["regulacion_accesos","control_grupos"]' WHERE `id` = 38;

-- id=39  (31 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Pimienta'  →  '1'
--   r03: 'mas_15'  →  'Pimienta'
--   r04: 'no'  →  None
--   r05: 'mujer'  →  None
--   r06: '18_29'  →  None
--   r07: '5'  →  'mas_15'
--   r08: '5'  →  'no'
--   r09: '4'  →  '2'
--   r10: '5'  →  '18_29'
--   r11: '2'  →  '5'
--   r13: '2'  →  '4'
--   r17: '5'  →  '2'
--   r19: '5'  →  '2'
--   r21: '2'  →  '5'
--   r22: '1_semana'  →  '5'
--   r23: 'nunca'  →  '5'
--   r24: 'nunca'  →  '5'
--   r25: 'varias_semana'  →  '2'
--   r26: 'varias_semana'  →  '1_semana'
--   r27: 'diario'  →  'nunca'
--   r28: 'reducido_uso'  →  'nunca'
--   r29: '["inseguridad_vial","perdida_identidad"]'  →  'varias_semana'
--   r30: '4'  →  'varias_semana'
--   r31: '2'  →  'diario'
--   r32: '2'  →  'reducido_uso'
--   r33: '["agentes_movilidad","control_grupos"]'  →  '["inseguridad_vial","perdida_identidad"]'
--   r34: None  →  '4'
--   r35: None  →  '2'
--   r36: None  →  '2'
--   r37: None  →  '["agentes_movilidad","control_grupos"]'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Pimienta', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'mas_15', `r08` = 'no', `r09` = '2', `r10` = '18_29', `r11` = '5', `r13` = '4', `r17` = '2', `r19` = '2', `r21` = '5', `r22` = '5', `r23` = '5', `r24` = '5', `r25` = '2', `r26` = '1_semana', `r27` = 'nunca', `r28` = 'nunca', `r29` = 'varias_semana', `r30` = 'varias_semana', `r31` = 'diario', `r32` = 'reducido_uso', `r33` = '["inseguridad_vial","perdida_identidad"]', `r34` = '4', `r35` = '2', `r36` = '2', `r37` = '["agentes_movilidad","control_grupos"]' WHERE `id` = 39;

-- id=40  (2 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '1', `v12` = '2' WHERE `id` = 40;

-- id=41  (32 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Agua'  →  '1'
--   r03: 'mas_15'  →  'Agua'
--   r04: 'no'  →  None
--   r05: 'mujer'  →  None
--   r06: '45_64'  →  None
--   r07: '4'  →  'mas_15'
--   r08: '5'  →  'no'
--   r09: '4'  →  '2'
--   r10: '3'  →  '45_64'
--   r11: '2'  →  '4'
--   r14: '2'  →  '3'
--   r15: '4'  →  '2'
--   r17: '2'  →  '4'
--   r18: '5'  →  '2'
--   r19: '3'  →  '4'
--   r22: 'varias_semana'  →  '5'
--   r23: 'menos_1_semana'  →  '3'
--   r24: 'diario'  →  '5'
--   r25: 'menos_1_semana'  →  '2'
--   r27: 'diario'  →  'menos_1_semana'
--   r28: 'no'  →  'diario'
--   r29: '["ninguna"]'  →  'menos_1_semana'
--   r30: '4'  →  'varias_semana'
--   r31: '5'  →  'diario'
--   r32: '3'  →  'no'
--   r33: '["limitacion_horaria","control_grupos"]'  →  '["ninguna"]'
--   r34: 'Evitar calles que hagan el mismo tour a la misma hora'  →  '4'
--   r35: None  →  '5'
--   r36: None  →  '3'
--   r37: None  →  '["limitacion_horaria","control_grupos"]'
--   r38: None  →  'Evitar calles que hagan el mismo tour a la misma hora'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Agua', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'mas_15', `r08` = 'no', `r09` = '2', `r10` = '45_64', `r11` = '4', `r14` = '3', `r15` = '2', `r17` = '4', `r18` = '2', `r19` = '4', `r22` = '5', `r23` = '3', `r24` = '5', `r25` = '2', `r27` = 'menos_1_semana', `r28` = 'diario', `r29` = 'menos_1_semana', `r30` = 'varias_semana', `r31` = 'diario', `r32` = 'no', `r33` = '["ninguna"]', `r34` = '4', `r35` = '5', `r36` = '3', `r37` = '["limitacion_horaria","control_grupos"]', `r38` = 'Evitar calles que hagan el mismo tour a la misma hora' WHERE `id` = 41;

-- id=42  (1 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2' WHERE `id` = 42;

-- id=43  (1 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2' WHERE `id` = 43;

-- id=44  (2 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '1', `v12` = '2' WHERE `id` = 44;

-- id=45  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 45;

-- id=46  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 46;

-- id=47  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 47;

-- id=48  (2 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '1', `v12` = '2' WHERE `id` = 48;

-- id=49  (35 campo(s) cambiado(s))
--   r01: 'si'  →  '1'
--   r02: 'Mesón del Moro'  →  '1'
--   r03: 'mas_15'  →  'Mesón del Moro'
--   r04: 'no'  →  None
--   r05: 'mujer'  →  None
--   r06: '45_64'  →  None
--   r07: '4'  →  'mas_15'
--   r08: '4'  →  'no'
--   r09: '5'  →  '2'
--   r10: '5'  →  '45_64'
--   r11: '3'  →  '4'
--   r12: '2'  →  '4'
--   r14: '2'  →  '5'
--   r15: '5'  →  '3'
--   r16: '4'  →  '2'
--   r18: '5'  →  '2'
--   r19: '3'  →  '5'
--   r21: '4'  →  '5'
--   r22: 'varias_semana'  →  '5'
--   r23: 'nunca'  →  '3'
--   r24: '1_semana'  →  '4'
--   r25: 'diario'  →  '4'
--   r26: 'diario'  →  'varias_semana'
--   r27: 'diario'  →  'nunca'
--   r28: 'reducido_uso'  →  '1_semana'
--   r29: '["inseguridad_vial"]'  →  'diario'
--   r30: '2'  →  'diario'
--   r31: '3'  →  'diario'
--   r32: '4'  →  'reducido_uso'
--   r33: '["zonas_peatonales","sensibilizacion"]'  →  '["inseguridad_vial"]'
--   r34: 'Arreglar las aceras, para la circulación peatonal de las calles de la ciudad'  →  '2'
--   r35: None  →  '3'
--   r36: None  →  '4'
--   r37: None  →  '["zonas_peatonales","sensibilizacion"]'
--   r38: None  →  'Arreglar las aceras, para la circulación peatonal de las calles de la ciudad'
UPDATE `survey_responses_flat` SET `r01` = '1', `r02` = '1', `r03` = 'Mesón del Moro', `r04` = NULL, `r05` = NULL, `r06` = NULL, `r07` = 'mas_15', `r08` = 'no', `r09` = '2', `r10` = '45_64', `r11` = '4', `r12` = '4', `r14` = '5', `r15` = '3', `r16` = '2', `r18` = '2', `r19` = '5', `r21` = '5', `r22` = '5', `r23` = '3', `r24` = '4', `r25` = '4', `r26` = 'varias_semana', `r27` = 'nunca', `r28` = '1_semana', `r29` = 'diario', `r30` = 'diario', `r31` = 'diario', `r32` = 'reducido_uso', `r33` = '["inseguridad_vial"]', `r34` = '2', `r35` = '3', `r36` = '4', `r37` = '["zonas_peatonales","sensibilizacion"]', `r38` = 'Arreglar las aceras, para la circulación peatonal de las calles de la ciudad' WHERE `id` = 49;

-- id=50  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 50;

-- id=51  (2 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '1', `v12` = '2' WHERE `id` = 51;

-- id=52  (2 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '1', `v12` = '2' WHERE `id` = 52;

-- id=53  (1 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
UPDATE `survey_responses_flat` SET `v06` = '1' WHERE `id` = 53;

-- id=54  (2 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '1', `v12` = '2' WHERE `id` = 54;

-- id=55  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 55;

-- id=56  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 56;

-- id=57  (2 campo(s) cambiado(s))
--   v06: 'hombre'  →  '1'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '1', `v12` = '2' WHERE `id` = 57;

-- id=58  (2 campo(s) cambiado(s))
--   v06: 'mujer'  →  '2'
--   v12: 'no'  →  '2'
UPDATE `survey_responses_flat` SET `v06` = '2', `v12` = '2' WHERE `id` = 58;

COMMIT;

-- Total sentencias UPDATE: 32
