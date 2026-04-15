/**
 * Catálogo de calles para la pregunta P1.1 de la encuesta de residentes.
 * 
 * - "barrio_turistico": calles del barrio turístico → seccion037 = true
 * - "otras_calles": otras calles del barrio → seccion037 = false
 */

export interface CalleItem {
  nombre: string;
  grupo: "barrio_turistico" | "otras_calles";
  seccion037: boolean;
}

/** Calles del barrio turístico (seccion037 = true) */
const CALLES_BARRIO_TURISTICO: string[] = [
  "Plaza Virgen de los Reyes",
  "Plata de Santa Marta",
  "Rodrigo Caro",
  "Pasaje de Vila",
  "Pasaje de Andreu",
  "Mesón del Moro",
  "Fabiola",
  "Plazuela Marqués de Vega Inclán",
  "Ximenez de Enciso",
  "Cruces",
  "Doncellas",
  "Mariscal",
  "Plaza de Refinadores",
  "Mezquita",
  "Plaza de Santa Cruz",
  "Plaza Alfaro",
  "Agua",
  "López de Rueda",
  "Reinoso",
  "Jamerdana",
  "Plaza de los Venerables",
  "Gloria",
  "Justino de Neve",
  "Pimienta",
  "Susona",
  "Vida",
  "Juderia",
  "Patio de Banderas",
  "Plaza Dña Elvira",
  "Plaza de la Alianza",
  "Cano y Cueto",
  "Paseo de Catalina de Ribera",
  "Calle Romero Murube",
  "Plaza del Triunfo",
];

/** Otras calles del barrio (seccion037 = false) */
const CALLES_OTRAS: string[] = [
  "Avda Constitución",
  "Cabo Noval",
  "Florentin",
  "Hernando Colón",
  "Alvarez Quintero",
  "Argote de Molina",
  "Placentines",
  "Alemanes",
  "Don Remondo",
  "Santo Tomás",
  "Fray Ceferino",
  "Dean Miranda",
  "San Gregorio",
  "Mariana de Pineda",
  "San Fernando",
  "Joaquin Hazañas",
  "Habana",
  "San Nicolas",
  "Matienzo",
  "Almirante Lobo",
  "Santander Paseo de las Delicias",
  "Paseo de Cristina",
];

/** Catálogo completo con metadatos */
export const CALLES: CalleItem[] = [
  ...CALLES_BARRIO_TURISTICO.map((nombre) => ({
    nombre,
    grupo: "barrio_turistico" as const,
    seccion037: true,
  })),
  ...CALLES_OTRAS.map((nombre) => ({
    nombre,
    grupo: "otras_calles" as const,
    seccion037: false,
  })),
];

/** Devuelve el flag seccion037 para una calle dada (false si no se encuentra) */
export function getSeccion037(nombreCalle: string): boolean {
  const calle = CALLES.find(
    (c) => c.nombre.toLowerCase().trim() === nombreCalle.toLowerCase().trim()
  );
  return calle?.seccion037 ?? false;
}

/** Lista de nombres de calles del barrio turístico (para el desplegable) */
export const NOMBRES_BARRIO_TURISTICO = CALLES_BARRIO_TURISTICO;

/** Lista de nombres de otras calles (para el desplegable) */
export const NOMBRES_OTRAS_CALLES = CALLES_OTRAS;
