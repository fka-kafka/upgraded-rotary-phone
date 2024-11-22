export default {
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ["sqlite3"],
  },
  server: {
    fs: {
      strict: false,
    },
  },
};
