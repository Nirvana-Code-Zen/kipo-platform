// vite.config.ts
import { defineConfig } from "file:///Users/edgar/Projects/NirvanaCodeZen/Kipo/kipo-platform/src/apps/kipo-dashboard/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.43_lightningcss@1.32.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/edgar/Projects/NirvanaCodeZen/Kipo/kipo-platform/src/apps/kipo-dashboard/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.43_lightningcss@1.32.0_/node_modules/@vitejs/plugin-react/dist/index.js";
import dts from "file:///Users/edgar/Projects/NirvanaCodeZen/Kipo/kipo-platform/src/apps/kipo-dashboard/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.19.43_rollup@4.62.2_typescript@5.9.3_vite@5.4.21_@_77a51d6c1d04186cb397bfcdf2156d05/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/Users/edgar/Projects/NirvanaCodeZen/Kipo/kipo-platform/src/packages/ui-react";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], insertTypesEntry: true })
  ],
  build: {
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "@headlessui/react"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZWRnYXIvUHJvamVjdHMvTmlydmFuYUNvZGVaZW4vS2lwby9raXBvLXBsYXRmb3JtL3NyYy9wYWNrYWdlcy91aS1yZWFjdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2VkZ2FyL1Byb2plY3RzL05pcnZhbmFDb2RlWmVuL0tpcG8va2lwby1wbGF0Zm9ybS9zcmMvcGFja2FnZXMvdWktcmVhY3Qvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2VkZ2FyL1Byb2plY3RzL05pcnZhbmFDb2RlWmVuL0tpcG8va2lwby1wbGF0Zm9ybS9zcmMvcGFja2FnZXMvdWktcmVhY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgZHRzKHsgaW5jbHVkZTogWydzcmMnXSwgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgZm9ybWF0czogWydlcyddLFxuICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3QvanN4LXJ1bnRpbWUnLCAnQGhlYWRsZXNzdWkvcmVhY3QnXSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVosU0FBUyxvQkFBb0I7QUFDdGIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLEtBQUssQ0FBQztBQUFBLEVBQ2xEO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ3hDLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLFNBQVMsYUFBYSxxQkFBcUIsbUJBQW1CO0FBQUEsSUFDM0U7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
