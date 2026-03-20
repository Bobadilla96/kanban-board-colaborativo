import type { StateStorage } from 'zustand/middleware';

const createMemoryStorage = (): StateStorage => {
  const memory = new Map<string, string>();

  return {
    getItem: (name) => memory.get(name) ?? null,
    setItem: (name, value) => {
      memory.set(name, value);
    },
    removeItem: (name) => {
      memory.delete(name);
    }
  };
};

const hasUsableLocalStorage = () => {
  if (typeof globalThis === 'undefined' || typeof globalThis.localStorage === 'undefined') {
    return false;
  }

  return typeof globalThis.localStorage.getItem === 'function' &&
    typeof globalThis.localStorage.setItem === 'function' &&
    typeof globalThis.localStorage.removeItem === 'function';
};

export const getSafeStorage = (): StateStorage => {
  if (hasUsableLocalStorage()) {
    return globalThis.localStorage;
  }

  return createMemoryStorage();
};
