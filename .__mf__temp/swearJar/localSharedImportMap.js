
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "pinia": async () => {
          throw new Error(`[Module Federation] Shared module '${"pinia"}' must be provided by host`);
        }
      ,
        "vue": async () => {
          throw new Error(`[Module Federation] Shared module '${"vue"}' must be provided by host`);
        }
      ,
        "vue-router": async () => {
          throw new Error(`[Module Federation] Shared module '${"vue-router"}' must be provided by host`);
        }
      
    }
      const usedShared = {
      
          "pinia": {
            name: "pinia",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "swearJar",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"pinia"}' must be provided by host`);
              }
              usedShared["pinia"].loaded = true
              const {"pinia": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "pinia" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "vue": {
            name: "vue",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "swearJar",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"vue"}' must be provided by host`);
              }
              usedShared["vue"].loaded = true
              const {"vue": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "vue" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        ,
          "vue-router": {
            name: "vue-router",
            version: undefined,
            scope: ["default"],
            loaded: false,
            from: "swearJar",
            async get () {
              if (true) {
                throw new Error(`[Module Federation] Shared module '${"vue-router"}' must be provided by host`);
              }
              usedShared["vue-router"].loaded = true
              const {"vue-router": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = false && "vue-router" === "react"
                ? (res?.default ?? res)
                : {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "*",
              import: false,
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      