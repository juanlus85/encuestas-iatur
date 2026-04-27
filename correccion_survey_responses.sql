-- ================================================================
-- Corrección de survey_responses (columnas v_p01-v_p20, r_p01-r_p37)
-- Generado a partir del CSV corregido de survey_responses_flat
-- Filas con cambios : 82
-- Filas sin cambios : 0
-- ================================================================

START TRANSACTION;

-- id=30036  (36 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Paseo de Cristina'  →  '1'
--   r_p03: 'mas_15'  →  'Paseo de Cristina'
--   r_p04: 'no'  →  None
--   r_p05: 'hombre'  →  None
--   r_p06: '45_64'  →  None
--   r_p07: '5'  →  'mas_15'
--   r_p08: '5'  →  'no'
--   r_p09: '5'  →  '1'
--   r_p10: '5'  →  '45_64'
--   r_p11: '3'  →  '5'
--   r_p13: '4'  →  '5'
--   r_p14: '3'  →  '5'
--   r_p15: '5'  →  '3'
--   r_p16: '3'  →  '5'
--   r_p17: '5'  →  '4'
--   r_p20: '5'  →  '3'
--   r_p21: '3'  →  '5'
--   r_p22: 'varias_s'  →  '3'
--   r_p23: 'nunca'  →  '5'
--   r_p24: 'menos_1_semana'  →  '5'
--   r_p25: 'diario'  →  '3'
--   r_p26: 'nunca'  →  'varias_semana'
--   r_p27: 'diario'  →  'nunca'
--   r_p28: 'no'  →  'menos_1_semana'
--   r_p29: '["ruido","perdida_identidad"]'  →  'diario'
--   r_p30: '5'  →  'nunca'
--   r_p31: '2'  →  'diario'
--   r_p32: '5'  →  'no'
--   r_p33: None  →  '["ruido","perdida_identidad"]'
--   r_p34: None  →  '5'
--   r_p35: None  →  '2'
--   r_p35a: 'control_grupos'  →  '5'
--   r_p35b: 'limitacion_horaria'  →  None
--   r_p36: None  →  '["control_grupos","limitacion_horaria"]'
--   seccion037: '0'  →  '1'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Paseo de Cristina', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'mas_15', `r_p08` = 'no', `r_p09` = '1', `r_p10` = '45_64', `r_p11` = '5', `r_p13` = '5', `r_p14` = '5', `r_p15` = '3', `r_p16` = '5', `r_p17` = '4', `r_p20` = '3', `r_p21` = '5', `r_p22` = '3', `r_p23` = '5', `r_p24` = '5', `r_p25` = '3', `r_p26` = 'varias_semana', `r_p27` = 'nunca', `r_p28` = 'menos_1_semana', `r_p29` = 'diario', `r_p30` = 'nunca', `r_p31` = 'diario', `r_p32` = 'no', `r_p33` = '["ruido","perdida_identidad"]', `r_p34` = '5', `r_p35` = '2', `r_p35a` = '5', `r_p35b` = NULL, `r_p36` = '["control_grupos","limitacion_horaria"]', `seccion037` = '1' WHERE `id` = 30036;  -- surveyId=30036

-- id=30037  (32 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Mesón del Moro'  →  '1'
--   r_p03: 'mas_15'  →  'Mesón del Moro'
--   r_p04: 'no'  →  None
--   r_p05: 'hombre'  →  None
--   r_p06: '45_64'  →  None
--   r_p07: '5'  →  'mas_15'
--   r_p08: '5'  →  'no'
--   r_p09: '5'  →  '1'
--   r_p10: '5'  →  '45_64'
--   r_p11: '1'  →  '5'
--   r_p15: '3'  →  '1'
--   r_p18: '1'  →  '5'
--   r_p19: '5'  →  '3'
--   r_p21: '1'  →  '5'
--   r_p22: 'diario'  →  '1'
--   r_p23: 'varias_semana'  →  '5'
--   r_p24: 'varias_semana'  →  '5'
--   r_p25: 'diario'  →  '1'
--   r_p26: '1_semana'  →  'diario'
--   r_p27: 'diario'  →  'varias_semana'
--   r_p28: 'evito_calles'  →  'varias_semana'
--   r_p29: '["dificultad_caminar","dificultad_acceso","cambios_rutas"]'  →  'diario'
--   r_p30: '5'  →  '1_semana'
--   r_p31: '5'  →  'diario'
--   r_p32: '1'  →  'evito_calles'
--   r_p33: None  →  '["dificultad_caminar","dificultad_acceso","cambios_rutas"]'
--   r_p34: None  →  '5'
--   r_p35: None  →  '5'
--   r_p35a: 'agentes_movilidad'  →  '1'
--   r_p35b: 'limitacion_horaria'  →  None
--   r_p36: None  →  '["agentes_movilidad","limitacion_horaria"]'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Mesón del Moro', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'mas_15', `r_p08` = 'no', `r_p09` = '1', `r_p10` = '45_64', `r_p11` = '5', `r_p15` = '1', `r_p18` = '5', `r_p19` = '3', `r_p21` = '5', `r_p22` = '1', `r_p23` = '5', `r_p24` = '5', `r_p25` = '1', `r_p26` = 'diario', `r_p27` = 'varias_semana', `r_p28` = 'varias_semana', `r_p29` = 'diario', `r_p30` = '1_semana', `r_p31` = 'diario', `r_p32` = 'evito_calles', `r_p33` = '["dificultad_caminar","dificultad_acceso","cambios_rutas"]', `r_p34` = '5', `r_p35` = '5', `r_p35a` = '1', `r_p35b` = NULL, `r_p36` = '["agentes_movilidad","limitacion_horaria"]' WHERE `id` = 30037;  -- surveyId=30037

-- id=30038  (31 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Mesón del Moro'  →  '1'
--   r_p03: '6_15'  →  'Mesón del Moro'
--   r_p04: 'si_yo'  →  None
--   r_p05: 'mujer'  →  None
--   r_p06: '30_44'  →  None
--   r_p07: '5'  →  '6_15'
--   r_p08: '5'  →  'si_yo'
--   r_p09: '5'  →  '2'
--   r_p10: 'ns'  →  '30_44'
--   r_p11: '4'  →  '5'
--   r_p13: '2'  →  '5'
--   r_p14: '5'  →  '99'
--   r_p15: '5'  →  '4'
--   r_p17: '5'  →  '2'
--   r_p22: 'nunca'  →  '5'
--   r_p23: 'nunca'  →  '5'
--   r_p24: '1_semana'  →  '5'
--   r_p25: 'diario'  →  '5'
--   r_p27: 'diario'  →  'nunca'
--   r_p28: 'evito_calles'  →  '1_semana'
--   r_p29: '["dificultad_caminar","cambios_rutas"]'  →  'diario'
--   r_p30: '3'  →  'nunca'
--   r_p31: '5'  →  'diario'
--   r_p32: '4'  →  'evito_calles'
--   r_p33: None  →  '["dificultad_caminar","cambios_rutas"]'
--   r_p34: None  →  '3'
--   r_p35: None  →  '5'
--   r_p35a: 'zonas_peatonales'  →  '4'
--   r_p35b: 'limitacion_horaria'  →  None
--   r_p36: None  →  '["zonas_peatonales","limitacion_horaria"]'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Mesón del Moro', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = '6_15', `r_p08` = 'si_yo', `r_p09` = '2', `r_p10` = '30_44', `r_p11` = '5', `r_p13` = '5', `r_p14` = '99', `r_p15` = '4', `r_p17` = '2', `r_p22` = '5', `r_p23` = '5', `r_p24` = '5', `r_p25` = '5', `r_p27` = 'nunca', `r_p28` = '1_semana', `r_p29` = 'diario', `r_p30` = 'nunca', `r_p31` = 'diario', `r_p32` = 'evito_calles', `r_p33` = '["dificultad_caminar","cambios_rutas"]', `r_p34` = '3', `r_p35` = '5', `r_p35a` = '4', `r_p35b` = NULL, `r_p36` = '["zonas_peatonales","limitacion_horaria"]' WHERE `id` = 30038;  -- surveyId=30038

-- id=30039  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'agradabl'  →  'agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'agradable', `seccion037` = NULL WHERE `id` = 30039;  -- surveyId=30039

-- id=30042  (37 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Mesón del Moro'  →  '1'
--   r_p03: 'mas_15'  →  'Mesón del Moro'
--   r_p04: 'si_otro'  →  None
--   r_p05: 'hombre'  →  None
--   r_p06: '65_75'  →  None
--   r_p07: '5'  →  'mas_15'
--   r_p08: '5'  →  'si_otro'
--   r_p09: '5'  →  '1'
--   r_p10: '5'  →  '65_75'
--   r_p13: '4'  →  '5'
--   r_p14: '4'  →  '5'
--   r_p15: '4'  →  '5'
--   r_p16: '3'  →  '5'
--   r_p18: '5'  →  '4'
--   r_p19: '2'  →  '4'
--   r_p20: '5'  →  '3'
--   r_p21: '1'  →  '4'
--   r_p22: 'diario'  →  '5'
--   r_p23: 'nunca'  →  '2'
--   r_p24: '1_semana'  →  '5'
--   r_p25: 'nunca'  →  '1'
--   r_p26: 'nunca'  →  'diario'
--   r_p27: 'diario'  →  'nunca'
--   r_p28: 'no'  →  '1_semana'
--   r_p29: '["dificultad_caminar","cambios_rutas","inseguridad_vial"]'  →  'nunca'
--   r_p30: '2'  →  'nunca'
--   r_p31: '4'  →  'diario'
--   r_p32: '3'  →  'no'
--   r_p33: None  →  '["dificultad_caminar","cambios_rutas","inseguridad_vial"]'
--   r_p34: 'Masifica'  →  '2'
--   r_p35: None  →  '4'
--   r_p35a: 'regulacion_accesos'  →  '3'
--   r_p35b: 'senalizacion'  →  None
--   r_p35c: 'control_grupos'  →  None
--   r_p36: None  →  '["regulacion_accesos","senalizacion","control_grupos"]'
--   r_p37: None  →  'Masificación en el centro muchos días, quiere ir a varios lugares pero tiene que ir por otras calles.'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Mesón del Moro', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'mas_15', `r_p08` = 'si_otro', `r_p09` = '1', `r_p10` = '65_75', `r_p13` = '5', `r_p14` = '5', `r_p15` = '5', `r_p16` = '5', `r_p18` = '4', `r_p19` = '4', `r_p20` = '3', `r_p21` = '4', `r_p22` = '5', `r_p23` = '2', `r_p24` = '5', `r_p25` = '1', `r_p26` = 'diario', `r_p27` = 'nunca', `r_p28` = '1_semana', `r_p29` = 'nunca', `r_p30` = 'nunca', `r_p31` = 'diario', `r_p32` = 'no', `r_p33` = '["dificultad_caminar","cambios_rutas","inseguridad_vial"]', `r_p34` = '2', `r_p35` = '4', `r_p35a` = '3', `r_p35b` = NULL, `r_p35c` = NULL, `r_p36` = '["regulacion_accesos","senalizacion","control_grupos"]', `r_p37` = 'Masificación en el centro muchos días, quiere ir a varios lugares pero tiene que ir por otras calles.' WHERE `id` = 30042;  -- surveyId=30042

-- id=30043  (3 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p15: 'agradabl'  →  'agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p15` = 'agradable', `seccion037` = NULL WHERE `id` = 30043;  -- surveyId=30043

-- id=30044  (33 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'López de Rueda'  →  '1'
--   r_p03: '6_15'  →  'López de Rueda'
--   r_p04: 'no'  →  None
--   r_p05: 'mujer'  →  None
--   r_p06: '45_64'  →  None
--   r_p07: '5'  →  '6_15'
--   r_p08: '5'  →  'no'
--   r_p09: '5'  →  '2'
--   r_p10: '5'  →  '45_64'
--   r_p11: '1'  →  '5'
--   r_p13: '4'  →  '5'
--   r_p15: '2'  →  '1'
--   r_p17: '5'  →  '4'
--   r_p18: '4'  →  '5'
--   r_p19: '5'  →  '2'
--   r_p21: '2'  →  '5'
--   r_p22: 'varias_s'  →  '4'
--   r_p23: 'varias_semana'  →  '5'
--   r_p24: '1_semana'  →  '5'
--   r_p25: 'varias_semana'  →  '2'
--   r_p27: 'diario'  →  'varias_semana'
--   r_p28: 'evito_calles'  →  '1_semana'
--   r_p29: '["dificultad_caminar","ruido","perdida_identidad","inseguridad_vial"]'  →  'varias_semana'
--   r_p30: '5'  →  'varias_semana'
--   r_p31: '1'  →  'diario'
--   r_p32: '1'  →  'evito_calles'
--   r_p33: None  →  '["dificultad_caminar","ruido","perdida_identidad","inseguridad_vial"]'
--   r_p34: None  →  '5'
--   r_p35: None  →  '1'
--   r_p35a: 'agentes_movilidad'  →  '1'
--   r_p35b: 'control_grupos'  →  None
--   r_p36: None  →  '["agentes_movilidad","control_grupos"]'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'López de Rueda', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = '6_15', `r_p08` = 'no', `r_p09` = '2', `r_p10` = '45_64', `r_p11` = '5', `r_p13` = '5', `r_p15` = '1', `r_p17` = '4', `r_p18` = '5', `r_p19` = '2', `r_p21` = '5', `r_p22` = '4', `r_p23` = '5', `r_p24` = '5', `r_p25` = '2', `r_p27` = 'varias_semana', `r_p28` = '1_semana', `r_p29` = 'varias_semana', `r_p30` = 'varias_semana', `r_p31` = 'diario', `r_p32` = 'evito_calles', `r_p33` = '["dificultad_caminar","ruido","perdida_identidad","inseguridad_vial"]', `r_p34` = '5', `r_p35` = '1', `r_p35a` = '1', `r_p35b` = NULL, `r_p36` = '["agentes_movilidad","control_grupos"]' WHERE `id` = 30044;  -- surveyId=30044

-- id=30045  (34 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Mesón del Moro'  →  '1'
--   r_p03: 'menos_1'  →  'Mesón del Moro'
--   r_p04: 'no'  →  None
--   r_p05: 'mujer'  →  None
--   r_p06: '45_64'  →  None
--   r_p07: '4'  →  'menos_1'
--   r_p08: '4'  →  'no'
--   r_p09: '4'  →  '2'
--   r_p10: '5'  →  '45_64'
--   r_p12: '5'  →  '4'
--   r_p13: '5'  →  '4'
--   r_p14: '2'  →  '5'
--   r_p15: '5'  →  '4'
--   r_p18: '3'  →  '2'
--   r_p21: '4'  →  '5'
--   r_p22: 'menos_1_'  →  '3'
--   r_p23: 'nunca'  →  '5'
--   r_p24: 'nunca'  →  '5'
--   r_p25: 'diario'  →  '4'
--   r_p26: 'varias_semana'  →  'menos_1_semana'
--   r_p27: 'diario'  →  'nunca'
--   r_p28: 'cambio_horario'  →  'nunca'
--   r_p29: '["ruido"]'  →  'diario'
--   r_p30: '3'  →  'varias_semana'
--   r_p31: '4'  →  'diario'
--   r_p32: '4'  →  'cambio_horario'
--   r_p33: None  →  '["ruido"]'
--   r_p34: 'Ruido mu'  →  '3'
--   r_p35: None  →  '4'
--   r_p35a: 'zonas_peatonales'  →  '4'
--   r_p35b: 'senalizacion'  →  None
--   r_p36: None  →  '["zonas_peatonales","senalizacion"]'
--   r_p37: None  →  'Ruido muy molesto a altas horas de la noche provocado por los bares'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Mesón del Moro', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'menos_1', `r_p08` = 'no', `r_p09` = '2', `r_p10` = '45_64', `r_p12` = '4', `r_p13` = '4', `r_p14` = '5', `r_p15` = '4', `r_p18` = '2', `r_p21` = '5', `r_p22` = '3', `r_p23` = '5', `r_p24` = '5', `r_p25` = '4', `r_p26` = 'menos_1_semana', `r_p27` = 'nunca', `r_p28` = 'nunca', `r_p29` = 'diario', `r_p30` = 'varias_semana', `r_p31` = 'diario', `r_p32` = 'cambio_horario', `r_p33` = '["ruido"]', `r_p34` = '3', `r_p35` = '4', `r_p35a` = '4', `r_p35b` = NULL, `r_p36` = '["zonas_peatonales","senalizacion"]', `r_p37` = 'Ruido muy molesto a altas horas de la noche provocado por los bares' WHERE `id` = 30045;  -- surveyId=30045

-- id=30046  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'agradabl'  →  'agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'agradable', `seccion037` = NULL WHERE `id` = 30046;  -- surveyId=30046

-- id=30047  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30047;  -- surveyId=30047

-- id=30049  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'muy_agra'  →  'muy_agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'muy_agradable', `seccion037` = NULL WHERE `id` = 30049;  -- surveyId=30049

-- id=30050  (36 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Fabiola'  →  '1'
--   r_p03: 'mas_15'  →  'Fabiola'
--   r_p04: 'no'  →  None
--   r_p05: 'hombre'  →  None
--   r_p06: '65_75'  →  None
--   r_p07: '5'  →  'mas_15'
--   r_p08: '5'  →  'no'
--   r_p09: '5'  →  '1'
--   r_p10: '5'  →  '65_75'
--   r_p11: '3'  →  '5'
--   r_p13: '3'  →  '5'
--   r_p14: '3'  →  '5'
--   r_p15: '4'  →  '3'
--   r_p16: '4'  →  '5'
--   r_p17: '4'  →  '3'
--   r_p18: '5'  →  '3'
--   r_p19: '5'  →  '4'
--   r_p20: '5'  →  '4'
--   r_p22: 'varias_s'  →  '5'
--   r_p23: 'nunca'  →  '5'
--   r_p24: 'nunca'  →  '5'
--   r_p25: 'diario'  →  '4'
--   r_p26: 'nunca'  →  'varias_semana'
--   r_p27: 'diario'  →  'nunca'
--   r_p28: 'no'  →  'nunca'
--   r_p29: '["ruido","dificultad_caminar"]'  →  'diario'
--   r_p30: '2'  →  'nunca'
--   r_p31: '4'  →  'diario'
--   r_p32: '2'  →  'no'
--   r_p33: None  →  '["ruido","dificultad_caminar"]'
--   r_p34: None  →  '2'
--   r_p35: None  →  '4'
--   r_p35a: 'regulacion_accesos'  →  '2'
--   r_p35b: 'control_grupos'  →  None
--   r_p36: None  →  '["regulacion_accesos","control_grupos"]'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Fabiola', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'mas_15', `r_p08` = 'no', `r_p09` = '1', `r_p10` = '65_75', `r_p11` = '5', `r_p13` = '5', `r_p14` = '5', `r_p15` = '3', `r_p16` = '5', `r_p17` = '3', `r_p18` = '3', `r_p19` = '4', `r_p20` = '4', `r_p22` = '5', `r_p23` = '5', `r_p24` = '5', `r_p25` = '4', `r_p26` = 'varias_semana', `r_p27` = 'nunca', `r_p28` = 'nunca', `r_p29` = 'diario', `r_p30` = 'nunca', `r_p31` = 'diario', `r_p32` = 'no', `r_p33` = '["ruido","dificultad_caminar"]', `r_p34` = '2', `r_p35` = '4', `r_p35a` = '2', `r_p35b` = NULL, `r_p36` = '["regulacion_accesos","control_grupos"]' WHERE `id` = 30050;  -- surveyId=30050

-- id=30051  (32 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Pimienta'  →  '1'
--   r_p03: 'mas_15'  →  'Pimienta'
--   r_p04: 'no'  →  None
--   r_p05: 'mujer'  →  None
--   r_p06: '18_29'  →  None
--   r_p07: '5'  →  'mas_15'
--   r_p08: '5'  →  'no'
--   r_p09: '4'  →  '2'
--   r_p10: '5'  →  '18_29'
--   r_p11: '2'  →  '5'
--   r_p13: '2'  →  '4'
--   r_p17: '5'  →  '2'
--   r_p19: '5'  →  '2'
--   r_p21: '2'  →  '5'
--   r_p22: '1_semana'  →  '5'
--   r_p23: 'nunca'  →  '5'
--   r_p24: 'nunca'  →  '5'
--   r_p25: 'varias_semana'  →  '2'
--   r_p26: 'varias_semana'  →  '1_semana'
--   r_p27: 'diario'  →  'nunca'
--   r_p28: 'reducido_uso'  →  'nunca'
--   r_p29: '["inseguridad_vial","perdida_identidad"]'  →  'varias_semana'
--   r_p30: '4'  →  'varias_semana'
--   r_p31: '2'  →  'diario'
--   r_p32: '2'  →  'reducido_uso'
--   r_p33: None  →  '["inseguridad_vial","perdida_identidad"]'
--   r_p34: None  →  '4'
--   r_p35: None  →  '2'
--   r_p35a: 'agentes_movilidad'  →  '2'
--   r_p35b: 'control_grupos'  →  None
--   r_p36: None  →  '["agentes_movilidad","control_grupos"]'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Pimienta', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'mas_15', `r_p08` = 'no', `r_p09` = '2', `r_p10` = '18_29', `r_p11` = '5', `r_p13` = '4', `r_p17` = '2', `r_p19` = '2', `r_p21` = '5', `r_p22` = '5', `r_p23` = '5', `r_p24` = '5', `r_p25` = '2', `r_p26` = '1_semana', `r_p27` = 'nunca', `r_p28` = 'nunca', `r_p29` = 'varias_semana', `r_p30` = 'varias_semana', `r_p31` = 'diario', `r_p32` = 'reducido_uso', `r_p33` = '["inseguridad_vial","perdida_identidad"]', `r_p34` = '4', `r_p35` = '2', `r_p35a` = '2', `r_p35b` = NULL, `r_p36` = '["agentes_movilidad","control_grupos"]' WHERE `id` = 30051;  -- surveyId=30051

-- id=30053  (4 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p12: 'no'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p12` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30053;  -- surveyId=30053

-- id=30055  (33 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Agua'  →  '1'
--   r_p03: 'mas_15'  →  'Agua'
--   r_p04: 'no'  →  None
--   r_p05: 'mujer'  →  None
--   r_p06: '45_64'  →  None
--   r_p07: '4'  →  'mas_15'
--   r_p08: '5'  →  'no'
--   r_p09: '4'  →  '2'
--   r_p10: '3'  →  '45_64'
--   r_p11: '2'  →  '4'
--   r_p14: '2'  →  '3'
--   r_p15: '4'  →  '2'
--   r_p17: '2'  →  '4'
--   r_p18: '5'  →  '2'
--   r_p19: '3'  →  '4'
--   r_p22: 'varias_s'  →  '5'
--   r_p23: 'menos_1_semana'  →  '3'
--   r_p24: 'diario'  →  '5'
--   r_p25: 'menos_1_semana'  →  '2'
--   r_p27: 'diario'  →  'menos_1_semana'
--   r_p28: 'no'  →  'diario'
--   r_p29: '["ninguna"]'  →  'menos_1_semana'
--   r_p30: '4'  →  'varias_semana'
--   r_p31: '5'  →  'diario'
--   r_p32: '3'  →  'no'
--   r_p33: None  →  '["ninguna"]'
--   r_p34: 'Evitar c'  →  '4'
--   r_p35: None  →  '5'
--   r_p35a: 'limitacion_horaria'  →  '3'
--   r_p35b: 'control_grupos'  →  None
--   r_p36: None  →  '["limitacion_horaria","control_grupos"]'
--   r_p37: None  →  'Evitar calles que hagan el mismo tour a la misma hora'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Agua', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'mas_15', `r_p08` = 'no', `r_p09` = '2', `r_p10` = '45_64', `r_p11` = '4', `r_p14` = '3', `r_p15` = '2', `r_p17` = '4', `r_p18` = '2', `r_p19` = '4', `r_p22` = '5', `r_p23` = '3', `r_p24` = '5', `r_p25` = '2', `r_p27` = 'menos_1_semana', `r_p28` = 'diario', `r_p29` = 'menos_1_semana', `r_p30` = 'varias_semana', `r_p31` = 'diario', `r_p32` = 'no', `r_p33` = '["ninguna"]', `r_p34` = '4', `r_p35` = '5', `r_p35a` = '3', `r_p35b` = NULL, `r_p36` = '["limitacion_horaria","control_grupos"]', `r_p37` = 'Evitar calles que hagan el mismo tour a la misma hora' WHERE `id` = 30055;  -- surveyId=30055

-- id=30057  (3 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30057;  -- surveyId=30057

-- id=30058  (2 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `seccion037` = NULL WHERE `id` = 30058;  -- surveyId=30058

-- id=30059  (4 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p12: 'no'  →  '2'
--   v_p15: 'muy_agra'  →  'muy_agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p12` = '2', `v_p15` = 'muy_agradable', `seccion037` = NULL WHERE `id` = 30059;  -- surveyId=30059

-- id=30060  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30060;  -- surveyId=30060

-- id=30061  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'agradabl'  →  'agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'agradable', `seccion037` = NULL WHERE `id` = 30061;  -- surveyId=30061

-- id=30062  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'muy_agra'  →  'muy_agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'muy_agradable', `seccion037` = NULL WHERE `id` = 30062;  -- surveyId=30062

-- id=30063  (4 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p12: 'no'  →  '2'
--   v_p15: 'muy_agra'  →  'muy_agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p12` = '2', `v_p15` = 'muy_agradable', `seccion037` = NULL WHERE `id` = 30063;  -- surveyId=30063

-- id=30064  (36 campo(s) cambiado(s))
--   r_p01: 'si'  →  '1'
--   r_p02: 'Mesón del Moro'  →  '1'
--   r_p03: 'mas_15'  →  'Mesón del Moro'
--   r_p04: 'no'  →  None
--   r_p05: 'mujer'  →  None
--   r_p06: '45_64'  →  None
--   r_p07: '4'  →  'mas_15'
--   r_p08: '4'  →  'no'
--   r_p09: '5'  →  '2'
--   r_p10: '5'  →  '45_64'
--   r_p11: '3'  →  '4'
--   r_p12: '2'  →  '4'
--   r_p14: '2'  →  '5'
--   r_p15: '5'  →  '3'
--   r_p16: '4'  →  '2'
--   r_p18: '5'  →  '2'
--   r_p19: '3'  →  '5'
--   r_p21: '4'  →  '5'
--   r_p22: 'varias_s'  →  '5'
--   r_p23: 'nunca'  →  '3'
--   r_p24: '1_semana'  →  '4'
--   r_p25: 'diario'  →  '4'
--   r_p26: 'diario'  →  'varias_semana'
--   r_p27: 'diario'  →  'nunca'
--   r_p28: 'reducido_uso'  →  '1_semana'
--   r_p29: '["inseguridad_vial"]'  →  'diario'
--   r_p30: '2'  →  'diario'
--   r_p31: '3'  →  'diario'
--   r_p32: '4'  →  'reducido_uso'
--   r_p33: None  →  '["inseguridad_vial"]'
--   r_p34: 'Arreglar'  →  '2'
--   r_p35: None  →  '3'
--   r_p35a: 'zonas_peatonales'  →  '4'
--   r_p35b: 'sensibilizacion'  →  None
--   r_p36: None  →  '["zonas_peatonales","sensibilizacion"]'
--   r_p37: None  →  'Arreglar las aceras, para la circulación peatonal de las calles de la ciudad'
UPDATE `survey_responses` SET `r_p01` = '1', `r_p02` = '1', `r_p03` = 'Mesón del Moro', `r_p04` = NULL, `r_p05` = NULL, `r_p06` = NULL, `r_p07` = 'mas_15', `r_p08` = 'no', `r_p09` = '2', `r_p10` = '45_64', `r_p11` = '4', `r_p12` = '4', `r_p14` = '5', `r_p15` = '3', `r_p16` = '2', `r_p18` = '2', `r_p19` = '5', `r_p21` = '5', `r_p22` = '5', `r_p23` = '3', `r_p24` = '4', `r_p25` = '4', `r_p26` = 'varias_semana', `r_p27` = 'nunca', `r_p28` = '1_semana', `r_p29` = 'diario', `r_p30` = 'diario', `r_p31` = 'diario', `r_p32` = 'reducido_uso', `r_p33` = '["inseguridad_vial"]', `r_p34` = '2', `r_p35` = '3', `r_p35a` = '4', `r_p35b` = NULL, `r_p36` = '["zonas_peatonales","sensibilizacion"]', `r_p37` = 'Arreglar las aceras, para la circulación peatonal de las calles de la ciudad' WHERE `id` = 30064;  -- surveyId=30064

-- id=30065  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30065;  -- surveyId=30065

-- id=30066  (3 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p12: 'no'  →  '2'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p12` = '2', `seccion037` = NULL WHERE `id` = 30066;  -- surveyId=30066

-- id=30067  (3 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p12: 'no'  →  '2'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p12` = '2', `seccion037` = NULL WHERE `id` = 30067;  -- surveyId=30067

-- id=30068  (3 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30068;  -- surveyId=30068

-- id=30069  (4 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p12: 'no'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p12` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30069;  -- surveyId=30069

-- id=30070  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'agradabl'  →  'agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'agradable', `seccion037` = NULL WHERE `id` = 30070;  -- surveyId=30070

-- id=30071  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'agradabl'  →  'agradable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'agradable', `seccion037` = NULL WHERE `id` = 30071;  -- surveyId=30071

-- id=30072  (4 campo(s) cambiado(s))
--   v_p06: 'hombre'  →  '1'
--   v_p12: 'no'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '1', `v_p12` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30072;  -- surveyId=30072

-- id=30073  (4 campo(s) cambiado(s))
--   v_p06: 'mujer'  →  '2'
--   v_p12: 'no'  →  '2'
--   v_p15: 'aceptabl'  →  'aceptable'
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `v_p06` = '2', `v_p12` = '2', `v_p15` = 'aceptable', `seccion037` = NULL WHERE `id` = 30073;  -- surveyId=30073

-- id=30084  (4 campo(s) cambiado(s))
--   r_p33: '["cambio'  →  '["cambios_rutas","dificultad_caminar","ruido"]'
--   r_p35a: None  →  '4'
--   r_p36: None  →  '["control_grupos","regulacion_accesos"]'
--   r_p37: '["control_grupos","regulacion_accesos"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["cambios_rutas","dificultad_caminar","ruido"]', `r_p35a` = '4', `r_p36` = '["control_grupos","regulacion_accesos"]', `r_p37` = NULL WHERE `id` = 30084;  -- surveyId=30084

-- id=30085  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30085;  -- surveyId=30085

-- id=30086  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30086;  -- surveyId=30086

-- id=30087  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30087;  -- surveyId=30087

-- id=30088  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","ruido"]'
--   r_p35a: None  →  '5'
--   r_p36: None  →  '["senalizacion","limitacion_horaria","control_grupos"]'
--   r_p37: '["senalizacion","limitacion_horaria","control_grupos"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","ruido"]', `r_p35a` = '5', `r_p36` = '["senalizacion","limitacion_horaria","control_grupos"]', `r_p37` = NULL WHERE `id` = 30088;  -- surveyId=30088

-- id=30089  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30089;  -- surveyId=30089

-- id=30090  (4 campo(s) cambiado(s))
--   r_p33: '["insegu'  →  '["inseguridad_vial","dificultad_caminar","perdida_identidad"]'
--   r_p35a: None  →  '3'
--   r_p36: None  →  '["control_grupos","agentes_movilidad"]'
--   r_p37: '["control_grupos","agentes_movilidad"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["inseguridad_vial","dificultad_caminar","perdida_identidad"]', `r_p35a` = '3', `r_p36` = '["control_grupos","agentes_movilidad"]', `r_p37` = NULL WHERE `id` = 30090;  -- surveyId=30090

-- id=30091  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30091;  -- surveyId=30091

-- id=30092  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30092;  -- surveyId=30092

-- id=30093  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30093;  -- surveyId=30093

-- id=30094  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_acceso","dificultad_caminar"]'
--   r_p35a: None  →  '4'
--   r_p36: None  →  '["limitacion_horaria","zonas_peatonales","regulacion_accesos"]'
--   r_p37: '["limitacion_horaria","zonas_peatonales","regulacion_accesos"]'  →  'Limpieza en la ciudad de Sevilla y jardines de Murillo.'
UPDATE `survey_responses` SET `r_p33` = '["dificultad_acceso","dificultad_caminar"]', `r_p35a` = '4', `r_p36` = '["limitacion_horaria","zonas_peatonales","regulacion_accesos"]', `r_p37` = 'Limpieza en la ciudad de Sevilla y jardines de Murillo.' WHERE `id` = 30094;  -- surveyId=30094

-- id=30095  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30095;  -- surveyId=30095

-- id=30096  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","inseguridad_vial","ruido"]'
--   r_p35a: None  →  '1'
--   r_p36: None  →  '["control_grupos","agentes_movilidad"]'
--   r_p37: '["control_grupos","agentes_movilidad"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","inseguridad_vial","ruido"]', `r_p35a` = '1', `r_p36` = '["control_grupos","agentes_movilidad"]', `r_p37` = NULL WHERE `id` = 30096;  -- surveyId=30096

-- id=30097  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30097;  -- surveyId=30097

-- id=30098  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30098;  -- surveyId=30098

-- id=30099  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30099;  -- surveyId=30099

-- id=30100  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","ruido"]'
--   r_p35a: None  →  '3'
--   r_p36: None  →  '["regulacion_accesos","senalizacion","limitacion_horaria"]'
--   r_p37: '["regulacion_accesos","senalizacion","limitacion_horaria"]'  →  'Intentar regular el turismo para que estemos todos contentos, sin haber tanta aglomeración de agobio. Darle importancia a ambas partes.'
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","ruido"]', `r_p35a` = '3', `r_p36` = '["regulacion_accesos","senalizacion","limitacion_horaria"]', `r_p37` = 'Intentar regular el turismo para que estemos todos contentos, sin haber tanta aglomeración de agobio. Darle importancia a ambas partes.' WHERE `id` = 30100;  -- surveyId=30100

-- id=30101  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30101;  -- surveyId=30101

-- id=30102  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30102;  -- surveyId=30102

-- id=30103  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","ruido"]'
--   r_p35a: None  →  '1'
--   r_p36: None  →  '["control_grupos","zonas_peatonales"]'
--   r_p37: '["control_grupos","zonas_peatonales"]'  →  'Regulación pisos turísticos están invadiendo las calles.'
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","ruido"]', `r_p35a` = '1', `r_p36` = '["control_grupos","zonas_peatonales"]', `r_p37` = 'Regulación pisos turísticos están invadiendo las calles.' WHERE `id` = 30103;  -- surveyId=30103

-- id=30104  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar"]'
--   r_p35a: None  →  '5'
--   r_p36: None  →  '["zonas_peatonales","agentes_movilidad"]'
--   r_p37: '["zonas_peatonales","agentes_movilidad"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar"]', `r_p35a` = '5', `r_p36` = '["zonas_peatonales","agentes_movilidad"]', `r_p37` = NULL WHERE `id` = 30104;  -- surveyId=30104

-- id=30105  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30105;  -- surveyId=30105

-- id=30106  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30106;  -- surveyId=30106

-- id=30107  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar"]'
--   r_p35a: None  →  '2'
--   r_p36: None  →  '["agentes_movilidad"]'
--   r_p37: '["agentes_movilidad"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar"]', `r_p35a` = '2', `r_p36` = '["agentes_movilidad"]', `r_p37` = NULL WHERE `id` = 30107;  -- surveyId=30107

-- id=30108  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30108;  -- surveyId=30108

-- id=30109  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30109;  -- surveyId=30109

-- id=30110  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30110;  -- surveyId=30110

-- id=30111  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","ruido","dificultad_acceso"]'
--   r_p35a: None  →  '5'
--   r_p36: None  →  '["regulacion_accesos","control_grupos","sensibilizacion"]'
--   r_p37: '["regulacion_accesos","control_grupos","sensibilizacion"]'  →  'Lipassam más presente en cuanto a limpieza y guías atentos.'
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","ruido","dificultad_acceso"]', `r_p35a` = '5', `r_p36` = '["regulacion_accesos","control_grupos","sensibilizacion"]', `r_p37` = 'Lipassam más presente en cuanto a limpieza y guías atentos.' WHERE `id` = 30111;  -- surveyId=30111

-- id=30112  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30112;  -- surveyId=30112

-- id=30113  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30113;  -- surveyId=30113

-- id=30114  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30114;  -- surveyId=30114

-- id=30115  (4 campo(s) cambiado(s))
--   r_p33: '["perdid'  →  '["perdida_identidad","dificultad_acceso"]'
--   r_p35a: None  →  '4'
--   r_p36: None  →  '["regulacion_accesos","control_grupos","limitacion_horaria"]'
--   r_p37: '["regulacion_accesos","control_grupos","limitacion_horaria"]'  →  'Más papeleras en el centro histórico y baños públicos para los turistas para no perjudicar al negocio.'
UPDATE `survey_responses` SET `r_p33` = '["perdida_identidad","dificultad_acceso"]', `r_p35a` = '4', `r_p36` = '["regulacion_accesos","control_grupos","limitacion_horaria"]', `r_p37` = 'Más papeleras en el centro histórico y baños públicos para los turistas para no perjudicar al negocio.' WHERE `id` = 30115;  -- surveyId=30115

-- id=30116  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar"]'
--   r_p35a: None  →  '5'
--   r_p36: None  →  '["control_grupos"]'
--   r_p37: '["control_grupos"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar"]', `r_p35a` = '5', `r_p36` = '["control_grupos"]', `r_p37` = NULL WHERE `id` = 30116;  -- surveyId=30116

-- id=30117  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30117;  -- surveyId=30117

-- id=30118  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30118;  -- surveyId=30118

-- id=30119  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","inseguridad_vial","dificultad_acceso"]'
--   r_p35a: None  →  '2'
--   r_p36: None  →  '["control_grupos","agentes_movilidad","senalizacion"]'
--   r_p37: '["control_grupos","agentes_movilidad","senalizacion"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","inseguridad_vial","dificultad_acceso"]', `r_p35a` = '2', `r_p36` = '["control_grupos","agentes_movilidad","senalizacion"]', `r_p37` = NULL WHERE `id` = 30119;  -- surveyId=30119

-- id=30120  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30120;  -- surveyId=30120

-- id=30121  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","ruido"]'
--   r_p35a: None  →  '4'
--   r_p36: None  →  '["agentes_movilidad","control_grupos"]'
--   r_p37: '["agentes_movilidad","control_grupos"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","ruido"]', `r_p35a` = '4', `r_p36` = '["agentes_movilidad","control_grupos"]', `r_p37` = NULL WHERE `id` = 30121;  -- surveyId=30121

-- id=30122  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30122;  -- surveyId=30122

-- id=30123  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30123;  -- surveyId=30123

-- id=30124  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30124;  -- surveyId=30124

-- id=30125  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar"]'
--   r_p35a: None  →  '4'
--   r_p36: None  →  '["agentes_movilidad","control_grupos"]'
--   r_p37: '["agentes_movilidad","control_grupos"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar"]', `r_p35a` = '4', `r_p36` = '["agentes_movilidad","control_grupos"]', `r_p37` = NULL WHERE `id` = 30125;  -- surveyId=30125

-- id=30126  (4 campo(s) cambiado(s))
--   r_p33: '["ruido'  →  '["ruido","perdida_identidad","dificultad_caminar"]'
--   r_p35a: None  →  '4'
--   r_p36: None  →  '["zonas_peatonales","limitacion_horaria","senalizacion"]'
--   r_p37: '["zonas_peatonales","limitacion_horaria","senalizacion"]'  →  'Turismo muy agotador, y agobiante'
UPDATE `survey_responses` SET `r_p33` = '["ruido","perdida_identidad","dificultad_caminar"]', `r_p35a` = '4', `r_p36` = '["zonas_peatonales","limitacion_horaria","senalizacion"]', `r_p37` = 'Turismo muy agotador, y agobiante' WHERE `id` = 30126;  -- surveyId=30126

-- id=30127  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30127;  -- surveyId=30127

-- id=30128  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30128;  -- surveyId=30128

-- id=30129  (4 campo(s) cambiado(s))
--   r_p33: '["dificu'  →  '["dificultad_caminar","cambios_rutas"]'
--   r_p35a: None  →  '2'
--   r_p36: None  →  '["zonas_peatonales","control_grupos"]'
--   r_p37: '["zonas_peatonales","control_grupos"]'  →  None
UPDATE `survey_responses` SET `r_p33` = '["dificultad_caminar","cambios_rutas"]', `r_p35a` = '2', `r_p36` = '["zonas_peatonales","control_grupos"]', `r_p37` = NULL WHERE `id` = 30129;  -- surveyId=30129

-- id=30130  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30130;  -- surveyId=30130

-- id=30131  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30131;  -- surveyId=30131

-- id=30132  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30132;  -- surveyId=30132

-- id=30133  (1 campo(s) cambiado(s))
--   seccion037: '0'  →  None
UPDATE `survey_responses` SET `seccion037` = NULL WHERE `id` = 30133;  -- surveyId=30133

COMMIT;

-- Total sentencias UPDATE: 82
