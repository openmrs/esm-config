import * as R from "ramda";

// The configurations that have been provided
const configs: object[] = [];

// An object with module names for keys and schemas for values.
const schemas = {};

// resolveImportMapConfig -- not working
// Pull default config file from the import map. Module 'config-file'
// TODO: Get this to actually work
let importMapConfigHasBeenAdded = false;
export async function resolveImportMapConfig() {
  if (importMapConfigHasBeenAdded) return;
  let importMapConfigExists;
  try {
    System.resolve("config-file");
    importMapConfigExists = true;
  } catch {
    importMapConfigExists = false;
  }

  if (importMapConfigExists) {
    await System.import("config-file").then(res => {
      configs.unshift(res);
      importMapConfigHasBeenAdded = true;
    });
  }
}

export function defineConfigSchema(moduleName, schema) {
  // console.log( "defineConfigSchema received schema for " + moduleName + ": " + JSON.stringify(schema));
  schemas[moduleName] = schema;
}

export function provide(config) {
  // console.log("provide recieved config " + JSON.stringify(config));
  configs.push(config);
}

export function getConfig(moduleName) {
  if (!schemas.hasOwnProperty(moduleName)) {
    throw Error("No config schema has been defined for " + moduleName);
  }
  const schema = schemas[moduleName];

  // Create a config object composed of all the defaults
  const defaultConfig = R.map(R.prop("default"), schema);

  // Merge all of the configs provided for moduleName
  const allConfigsForModule = R.map(R.prop(moduleName), configs);
  const providedConfig = R.mergeAll(allConfigsForModule);

  for (let [key, value] of Object.entries(providedConfig)) {
    if (!schema.hasOwnProperty(key)) {
      throw Error(
        `Unknown config key ${key} provided for module ${moduleName}. Please see the config schema for ${moduleName}.`
      );
    }
  }
  for (let key of Object.keys(schema)) {
    if (!providedConfig.hasOwnProperty(key)) {
      providedConfig[key] = schema[key]["default"];
    }
  }

  return providedConfig;
}

export function clearAll() {
  configs.length = 0;
  for (var member in schemas) delete schemas[member];
}
