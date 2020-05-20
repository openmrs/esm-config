import { interpolateString, navigate } from "./navigate";

describe("navigate", () => {
  it("interpolates the expected magic substrings", () => {});

  it("uses location.assign() to navigate to non-SPA urls", () => {});

  it("uses single-spa navigateToUrl to navigate to SPA urls", () => {});
});

describe("interpolateString", () => {
  it("interpolates variables into the string", () => {
    const result = interpolateString("test ${one} ${two} 3", {
      one: 1,
      two: 2
    });
    expect(result).toBe("test 1 2 3");
  });

  it("ignores extra parameters", () => {
    const result = interpolateString("test ${one}", {
      one: 1,
      two: 2
    });
    expect(result).toBe("test 1");
  });

  it("does not execute arbitrary code", () => {
    expect(() =>
      interpolateString(
        '` + (function () { throw Error("evil"); })() + `${a}',
        { a: 0 }
      )
    ).not.toThrowError("evil");
  });
});
