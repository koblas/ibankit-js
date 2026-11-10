import { IBAN, IBANBuilder, CountryCode } from "../src";
import { calculateCheckDigit, replaceCheckDigit } from "../src/ibanUtil";

/** Give an IBAN correct mod-97 check digits, so only its BBAN decides validity. */
function withCheckDigits(iban: string): string {
  return replaceCheckDigit(iban, calculateCheckDigit(iban));
}

/**
 * Countries whose national check digits live inside the account number (or
 * the kennitala), so there is no separate check digit part. Offsets are the
 * IBAN positions of each embedded check digit.
 *
 * Algorithms are from Wikipedia, "International Bank Account Number",
 * National check digits table:
 *   CZ, SK  weights 6,3,7,9,10,5,8,4,2,1 mod 11, separately for the 6 digit
 *           prefix and the 10 digit account number
 *   FI      Luhn over the whole BBAN
 *   HR      ISO 7064 MOD 11,10, separately for the bank code and account number
 *   IS      weights 3,2,7,6,5,4,3,2 mod 11 over the first 8 kennitala digits
 */
const OFFSETS: Record<string, number[]> = {
  CZ: [13, 23],
  SK: [13, 23],
  FI: [17],
  HR: [10, 20],
  IS: [24],
};

const VECTORS: [string, string, string][] = [
  ["CZ", "CZ6508000000192000145399", "SWIFT IBAN Registry example"],
  ["CZ", "CZ1708000000000088444422", "Charita ČR (ČS), charita.cz"],
  ["CZ", "CZ3201000000000111825849", "KB transparent account, kb.cz"],
  ["CZ", "CZ6401000001310241460227", "Nadace Anežka (KB), kb.cz"],
  ["CZ", "CZ4101000001231562180247", "Nadační fond na důvěru (KB), kb.cz"],
  ["SK", "SK3112000000198742637541", "SWIFT IBAN Registry example"],
  ["SK", "SK3111000000002940048994", "Nie rakovine (Tatra banka), nierakovine.sk"],
  ["SK", "SK3056000000008604483003", "RC Klbko (Prima banka), klbko.sk"],
  ["SK", "SK0481805009107000451305", "Finančná správa (Štátna pokladnica), financnasprava.sk"],
  ["SK", "SK0481805010837000443313", "Finančná správa (Štátna pokladnica), financnasprava.sk"],
  ["FI", "FI2112345600000785", "SWIFT IBAN Registry example"],
  ["FI", "FI2950000120415699", "Finnish Red Cross (OP), redcross.fi"],
  ["FI", "FI1840551110001397", "Finnish Red Cross (Aktia), redcross.fi"],
  ["FI", "FI0280001900225005", "Finnish Red Cross (Danske), redcross.fi"],
  ["FI", "FI0622191800068000", "Finnish Red Cross (Nordea), redcross.fi"],
  ["FI", "FI9139390012312930", "Finnish Red Cross (S-Pankki), redcross.fi"],
  ["FI", "FI2466010001002799", "Finnish Red Cross (Ålandsbanken), redcross.fi"],
  ["HR", "HR1210010051863000160", "SWIFT IBAN Registry example"],
  ["HR", "HR0923600001503056530", "Croatian Red Cross (ZABA), amcham.hr"],
  ["HR", "HR6923400091511555516", "Croatian Red Cross (PBZ), total-croatia-news.com"],
  ["HR", "HR2424020061500078406", "Zaklada SOLIDARNA (Erste), total-croatia-news.com"],
  ["HR", "HR9724070001500013097", "Sisak-area earthquake appeal (OTP), total-croatia-news.com"],
  ["HR", "HR8723900011500198462", "HPB, total-croatia-news.com"],
  ["IS", "IS140159260076545510730339", "SWIFT IBAN Registry example"],
  ["IS", "IS910101260850025402696029", "Skatturinn (Landsbankinn), skatturinn.is"],
  ["IS", "IS400001260251115402696459", "Skatturinn (Seðlabanki), skatturinn.is"],
  ["IS", "IS290515267230005402696029", "Skatturinn (Íslandsbanki), skatturinn.is"],
];

describe("check digits embedded in the account number", () => {
  it.each(VECTORS)("%s accepts %s (%s)", (_cc, iban) => {
    expect(IBAN.isValid(iban)).toBe(true);
  });

  // Try every value of each embedded check digit (with the IBAN check digits
  // recomputed each time): only the published one may validate. Without the
  // structure check every value would be accepted.
  it.each(VECTORS)("%s accepts only the published check digits for %s", (cc, iban) => {
    for (const offset of OFFSETS[cc]) {
      const accepted = "0123456789"
        .split("")
        .filter((digit) => IBAN.isValid(withCheckDigits(iban.slice(0, offset) + digit + iban.slice(offset + 1))));

      expect(accepted).toEqual([iban[offset]]);
    }
  });

  it("reports which check failed", () => {
    expect(() => new IBAN(withCheckDigits("CZ0008000000192000145398"))).toThrow(/account number fails/);
    expect(() => new IBAN(withCheckDigits("CZ0008000000182000145399"))).toThrow(/prefix fails/);
    expect(() => new IBAN(withCheckDigits("HR0010010061863000160"))).toThrow(/bank code fails/);
    expect(() => new IBAN(withCheckDigits("IS000159260076545510730329"))).toThrow(/kennitala/);
  });

  it.each(Object.keys(OFFSETS))("%s random IBANs are valid", (cc) => {
    for (let i = 0; i < 50; i++) {
      expect(IBAN.isValid(IBAN.random(cc as CountryCode).toString())).toBe(true);
    }
  });

  it("FI generates a valid account number for a given bank code", () => {
    for (let i = 0; i < 20; i++) {
      const iban = new IBANBuilder().countryCode(CountryCode.FI).bankCode("405").build();

      expect(iban.getBankCode()).toBe("405");
      expect(IBAN.isValid(iban.toString())).toBe(true);
    }
  });
});
