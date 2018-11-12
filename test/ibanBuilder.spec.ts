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
});
