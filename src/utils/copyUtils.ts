import { toRaw } from 'vue';

/**
 * Deep clones a value to remove reactivity of data
 */
export function deepCopy<T>(value: T): T {
  return structuredClone(toRaw(value));
}
