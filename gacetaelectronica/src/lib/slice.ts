// src/lib/slice.ts

/**
 * Limita un arreglo de datos a una cantidad máxima.
 * @param data - Arreglo original.
 * @param cantidad 
 * @returns Arreglo con los primeros N elementos.
 */
export function limitarResultados<T>(data: T[], cantidad: number = 1000): T[] {
  return data.slice(0, cantidad);
}
