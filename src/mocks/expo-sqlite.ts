export function openDatabaseSync() {
  return {
    execAsync: async () => {},
    runAsync: async () => {},
    getFirstAsync: async () => null,
    getAllAsync: async () => [],
  }
}

export default {
  openDatabaseSync,
}
