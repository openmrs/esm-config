import * as Config from "./module-config";

describe("getConfig", () => {
  afterEach(() => {
    Config.clearAll();
  });

  it("uses config values from the provided config file", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = { "foo-module": { foo: "bar" } };
    Config.provide(testConfig);
    const config = Config.getConfig("foo-module");
    await expect(config).resolves.toHaveProperty("foo", "bar");
  });

  it("returns default values from the schema", async () => {
    Config.defineConfigSchema("testmod", {
      foo: {
        default: "qux"
      }
    });
    const config = Config.getConfig("testmod");
    await expect(config).resolves.toHaveProperty("foo", "qux");
  });

  it("requires config values to have been defined in the schema", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.provide({ "foo-module": { bar: "baz" } });
    await expect(Config.getConfig("foo-module")).rejects.toThrow(/schema/);
  });

  it("requires nested config values to have been defined in the schema", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: { bar: { default: "qux" } }
    });
    Config.provide({ "foo-module": { foo: { doof: "nope" } } });
    await expect(Config.getConfig("foo-module")).rejects.toThrowError(/schema/);
  });

  it("throws if looking up module with no schema", async () => {
    await expect(Config.getConfig("fake-module")).rejects.toThrow(
      /schema.*defined/
    );
  });

  it("returns a nested configuration", async () => {
    Config.defineConfigSchema("foo-module", {
      foo: {
        bar: {
          default: -1
        },
        baz: {
          qux: {
            default: "N/A"
          },
          quy: {
            default: ""
          }
        }
      }
    });
    const testConfig = {
      "foo-module": {
        foo: {
          bar: 0,
          baz: {
            quy: "xyz"
          }
        }
      }
    };
    Config.provide(testConfig);
    const config = Config.getConfig("foo-module");
    await expect(config).resolves.toHaveProperty(["foo", "bar"], 0);
    await expect(config).resolves.toHaveProperty(["foo", "baz", "qux"], "N/A");
    await expect(config).resolves.toHaveProperty(["foo", "baz", "quy"], "xyz");
  });

  it("works for multiple modules", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.defineConfigSchema("bar-module", { bar: { default: "quinn" } });
    const testConfig = { "bar-module": { bar: "baz" } };
    Config.provide(testConfig);
    const fooConfig = Config.getConfig("foo-module");
    await expect(fooConfig).resolves.toHaveProperty("foo", "qux");
    const barConfig = Config.getConfig("bar-module");
    await expect(barConfig).resolves.toHaveProperty("bar", "baz");
  });
});

describe("resolveImportMapConfig", () => {
  afterEach(() => {
    Config.clearAll();
    (<any>window).System.resolve.mockReset();
    (<any>window).System.import.mockReset();
  });

  it("gets config file from import map", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve = jest.fn();
    (<any>window).System.import = jest.fn().mockResolvedValue(testConfig);
    const config = Config.getConfig("foo-module");
    await expect(config).resolves.toHaveProperty("foo", "bar");
  });

  it("always puts config file from import map at lowest priority", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const importedConfig = importableConfig({ "foo-module": { foo: "bar" } });
    (<any>window).System.resolve = jest.fn();
    (<any>window).System.import = jest.fn().mockResolvedValue(importedConfig);
    const providedConfig = { "foo-module": { foo: "baz" } };
    Config.provide(providedConfig);
    const config = Config.getConfig("foo-module");
    await expect(config).resolves.toHaveProperty("foo", "baz");
  });

  it("does not 404 when no config file is in the import map", async () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    // this line below is actually all that the test requires, the rest is sanity checking
    await expect(() => Config.getConfig("foo-module")).not.toThrow();
  });
});

const importableConfig = configObject => ({ default: configObject });
