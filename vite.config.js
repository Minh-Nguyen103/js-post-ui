// vite.config.js
const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        postDetail: resolve(__dirname, "post-detail.html"),
        addEdit: resolve(__dirname, "add-edit-post.html"),
      },
    },
  },
});
