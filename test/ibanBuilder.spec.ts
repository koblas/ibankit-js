import { IBANBuilder, IBAN, CountryCode } from "../src";

describe("IBANBuilder", () => {
  it("NO random test", () => {
    const iban = new IBANBuilder()
      .countryCode(CountryCode.NO)
      .bankCode("8601")
      .build()
      .toString();

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
});
