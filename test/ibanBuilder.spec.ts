import { IBANBuilder, IBAN, CountryCode, BbanStructure } from "../src";

describe("IBANBuilder", () => {
  it("NO random test", () => {
    const iban = new IBANBuilder().countryCode(CountryCode.NO).bankCode("8601").build().toString();

    expect(IBAN.isValid(iban)).toBe(true);
  });

  it("NO random test", () => {
    const iban = new IBANBuilder()
      .countryCode(CountryCode.NO)
      .bankCode("8601")
      .accountNumber("111794")
      .build()
      .toString();

    expect(IBAN.isValid(iban)).toBe(true);
  });

  it("BJ test", () => {
    const iban = new IBANBuilder()
      .countryCode(CountryCode.BJ)
      .bankCode("BJ104")
      .branchCode("01003")
      .accountNumber("035033423001")
      .build()
      .toString();

    expect(IBAN.isValid(iban)).toBe(true);
  });

  it.each(BbanStructure.supportedCountries())("builds a random valid IBAN for %s", (cc) => {
    const iban = new IBANBuilder().countryCode(cc).build().toString();

    expect(IBAN.isValid(iban)).toBe(true);
  });

  it("SC: splits a 4!a2!n bank code and sets the currency", () => {
    const iban = new IBANBuilder()
      .countryCode(CountryCode.SC)
      .bankCode("SSCB11")
      .branchCode("01")
      .accountNumber("0000000000001497")
      .currencyType("USD")
      .build();

    expect(iban.toString()).toBe("SC18SSCB11010000000000001497USD");
    expect(iban.getBankCode()).toBe("SSCB11");
    expect(IBAN.toBBAN(iban.toString())).toBe("SSCB11 01 0000000000001497 USD");
  });

  it("MU: rejects a bank code that does not match 4!a2!n", () => {
    const build = () =>
      new IBANBuilder()
        .countryCode(CountryCode.MU)
        .bankCode("BOMMA1")
        .branchCode("01")
        .accountNumber("101030300200")
        .accountType("000")
        .currencyType("MUR")
        .build();

    expect(build).toThrow();
  });

  it("build(false) uses the given values and requires every field", () => {
    const builder = () =>
      new IBANBuilder()
        .countryCode(CountryCode.SC)
        .bankCode("SSCB11")
        .branchCode("01")
        .accountNumber("0000000000001497");

    expect(builder().currencyType("USD").build(false).toString()).toBe("SC18SSCB11010000000000001497USD");
    expect(() => builder().build(false)).toThrow("currencyType is required");
  });
});
