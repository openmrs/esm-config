import * as Config from "./module-config";

describe("getConfig", () => {
  afterEach(() => {
    Config.clearAll();
  });

  it("uses config values from the provided config file", () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    const testConfig = { "foo-module": { foo: "bar" } };
    Config.provide(testConfig);
    const config = Config.getConfig("foo-module");
    expect(config.foo).toBe("bar");
  });

  it("returns default values from the schema", () => {
    Config.defineConfigSchema("testmod", {
      foo: {
        default: "qux"
      }
    });
    const config = Config.getConfig("testmod");
    expect(config.foo).toBe("qux");
  });

  it("requires config values to have been defined in the schema", () => {
    Config.defineConfigSchema("foo-module", { foo: { default: "qux" } });
    Config.provide({ "foo-module": { bar: "baz" } });
    expect(() => Config.getConfig("foo-module")).toThrowError(/schema/);
  });

  it("throws if looking up module with no schema", () => {
    expect(() => Config.getConfig("fake-module")).toThrowError(
      /schema.*defined/
    );
  });

  it("receives config file from import map", () => {});

  it("always puts config file from import map first", () => {});

  it("does not 404 when no config file is in the import map", () => {});
});
