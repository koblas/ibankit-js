import * as exceptions from "../src/exceptions";

describe("exceptions", () => {
  it("smoke", () => {
    const e = new exceptions.UnsupportedCountryException("test");

    expect(e).toBeInstanceOf(exceptions.UnsupportedCountryException);
    expect(e instanceof exceptions.UnsupportedCountryException).toEqual(true);
  });
});
