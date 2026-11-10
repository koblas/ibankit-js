import { IBAN } from "../src";
import { calculateCheckDigit, replaceCheckDigit } from "../src/ibanUtil";

/** Give an IBAN correct mod-97 check digits, so only its BBAN decides validity. */
function withCheckDigits(iban: string): string {
  return replaceCheckDigit(iban, calculateCheckDigit(iban));
}

/**
 * Countries whose national check digits are ISO 7064 MOD 97-10 over the whole
 * BBAN, 98 - r (Wikipedia, "International Bank Account Number", National
 * check digits table). The national digits are the last two BBAN characters.
 */
const VECTORS: [string, string, string][] = [
  ["BA", "BA391290079401028494", "SWIFT IBAN Registry example"],
  ["BA", "BA391990440001200279", "existing iban.spec.ts example"],
  ["BA", "BA393385804800211234", "published BA example"],
  ["ME", "ME25505000012345678951", "SWIFT IBAN Registry example"],
  ["ME", "ME25540000007300775761", "CCE donation account, cgo-cce.org"],
  ["ME", "ME25520004200000314242", "fundraiser account published on gradski.me"],
  ["MK", "MK07250120000058984", "SWIFT IBAN Registry example"],
  ["MK", "MK07300000000042425", "published MK example"],
  ["RS", "RS35260005601001611379", "SWIFT IBAN Registry example"],
  ["RS", "RS35105008123123123173", "published RS example"],
  ["SI", "SI56263300012039086", "SWIFT IBAN Registry example"],
  ["SI", "SI56191000000123438", "published SI example"],
  ["TL", "TL380080012345678910157", "SWIFT IBAN Registry example"],
  ["TL", "TL380010012345678910106", "published TL example"],
];

describe("national check digits: ISO 7064 MOD 97-10", () => {
  it.each(VECTORS)("%s accepts %s (%s)", (_cc, iban) => {
    expect(IBAN.isValid(iban)).toBe(true);
  });

  // Try every two-digit national check value (with the IBAN check digits
  // recomputed each time): only the documented one may validate. Without a
  // generator all 100 would be accepted.
  it.each(VECTORS)("%s accepts only the correct national digits for %s", (_cc, iban) => {
    const prefix = iban.slice(0, -2);
    const accepted = Array.from({ length: 100 }, (_, n) => String(n).padStart(2, "0")).filter((digits) =>
      IBAN.isValid(withCheckDigits(prefix + digits)),
    );

    expect(accepted).toEqual([iban.slice(-2)]);
  });

  it.each([
    ["BA", "BA391290079401028495"],
    ["ME", "ME25505000012345678952"],
    ["MK", "MK07250120000058985"],
    ["RS", "RS35260005601001611370"],
    ["SI", "SI56263300012039087"],
    ["TL", "TL380080012345678910158"],
  ])("%s rejects %s with valid IBAN check digits but wrong national digits", (_cc, iban) => {
    const fixed = withCheckDigits(iban);

    expect(fixed).not.toBe(iban);
    expect(IBAN.isValid(fixed)).toBe(false);
    expect(() => new IBAN(fixed)).toThrow(/national check digit/);
  });

  it("exposes the national check digits", () => {
    expect(new IBAN("RS35260005601001611379").getNationalCheckDigit()).toBe("79");
  });

  it.each(["BA", "ME", "MK", "RS", "SI", "TL"])("%s random IBANs are valid", (cc) => {
    for (let i = 0; i < 20; i++) {
      expect(IBAN.isValid(IBAN.random(cc as Parameters<typeof IBAN.random>[0]).toString())).toBe(true);
    }
  });
});
