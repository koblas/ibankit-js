import { IBAN, CountryCode } from "../src";
import { calculateCheckDigit, replaceCheckDigit } from "../src/ibanUtil";

/** Give an IBAN correct mod-97 check digits, so only its BBAN decides validity. */
function withCheckDigits(iban: string): string {
  return replaceCheckDigit(iban, calculateCheckDigit(iban));
}

/** Every value of a `length` digit field */
function allValues(length: number): string[] {
  return Array.from({ length: 10 ** length }, (_, n) => String(n).padStart(length, "0"));
}

/**
 * Check digit fields per country, as [offset in the IBAN, length].
 *
 * Algorithms are from Wikipedia, "International Bank Account Number",
 * National check digits table:
 *   AL  weights 9,7,3,1 mod 10 over bank + branch
 *   EE  weights 7,1,3 mod 10 over branch + account
 *   HU  weights 9,7,3,1 mod 10, once over bank + branch and once over the account
 *   PL  weights 3,9,7,1 mod 10 over bank + branch
 *   MR, TN  ISO 7064 MOD-97-10 variant, 97 - r (the French RIB key)
 * DJ and MG (French RIB key) and XK (ISO 7064 MOD-97-10, 98 - r) have no
 * Wikipedia row; their registry examples and every published IBAN below agree.
 */
const FIELDS: Record<string, [number, number][]> = {
  AL: [[11, 1]],
  EE: [[19, 1]],
  HU: [
    [11, 1],
    [27, 1],
  ],
  PL: [[11, 1]],
  MR: [[25, 2]],
  TN: [[22, 2]],
  DJ: [[25, 2]],
  MG: [[25, 2]],
  XK: [[18, 2]],
};

const VECTORS: [string, string, string][] = [
  ["AL", "AL47212110090000000235698741", "SWIFT IBAN Registry example"],
  ["AL", "AL60202110130000000030880359", "World Vision Albania, tirana-airport.com"],
  ["AL", "AL36208110080000001009031802", "World Vision Albania, tirana-airport.com"],
  ["AL", "AL43202110130000008004004409", "PPNEA, ppnea.org"],
  ["AL", "AL22212110090000000001208481", "Albanian Radio Amateur Federation, fshra.org"],
  ["AL", "AL2920521123003136CLTJCFEURB", "Fondacioni ICF Fier, icf.church"],
  ["EE", "EE382200221020145685", "SWIFT IBAN Registry example"],
  ["EE", "EE577700771005547635", "PÖFF, poff.ee"],
  ["EE", "EE351010052031000004", "Maksu- ja Tolliamet (SEB), emta.ee"],
  ["EE", "EE522200221013264447", "Maksu- ja Tolliamet (Swedbank), emta.ee"],
  ["EE", "EE401700017002872300", "Maksu- ja Tolliamet (Luminor), emta.ee"],
  ["EE", "EE774204278607566704", "Maksu- ja Tolliamet (Coop), emta.ee"],
  ["HU", "HU42117730161111101800000000", "SWIFT IBAN Registry example"],
  ["HU", "HU91117630791755088200000000", "BNTK Alapítvány (OTP), fernuni-hagen.de"],
  ["HU", "HU36109180010000006169770099", "Baptist Charity Service (UniCredit), baptistasegely.hu"],
  ["HU", "HU67107020198500889851100005", "Reformed Church Aid (CIB), reformatus.hu"],
  ["HU", "HU02100320000605923909060056", "NAV (MÁK), nav.gov.hu"],
  ["PL", "PL61109010140000071219812874", "SWIFT IBAN Registry example"],
  ["PL", "PL82124062471111000049791237", "Greenpeace Polska (Pekao), greenpeace.org"],
  ["PL", "PL14102010550000910201463298", "Otwarta Rzeczpospolita (PKO BP), otwarta.org"],
  ["PL", "PL12109010980000000143877810", "Lech Wałęsa Institute (Santander), walesa.org"],
  ["MR", "MR1300020001010000123456753", "SWIFT IBAN Registry example"],
  ["MR", "MR1300003000010100782970133", "NIC-Mauritanie (BAMIS), nic.mr"],
  ["MR", "MR1300001000010000321900119", "Covid-19 solidarity fund (BCM), ecorim.info"],
  ["TN", "TN5910006035183598478831", "SWIFT IBAN Registry example"],
  ["TN", "TN5910113108000707078855", "UTSS, leconomistemaghrebin.com"],
  ["TN", "TN5917000000000049300095", "La Poste Tunisienne, africanmanager.com"],
  ["TN", "TN5908601000191000748054", "Association DARNA (BIAT), darna.tn"],
  ["DJ", "DJ2100010000000154000100186", "SWIFT IBAN Registry example"],
  ["DJ", "DJ2100011010010114256000378", "IN'COM SARL (BOA Mer Rouge), cabinetincom.com"],
  ["DJ", "DJ2100011010010114256001639", "IN'COM SARL (BOA Mer Rouge), cabinetincom.com"],
  ["MG", "MG4600005030010101914016056", "SWIFT IBAN Registry example"],
  ["MG", "MG4600005000414382396020068", "ONG Bel Avenir (BNI), ongbelavenir.org"],
  ["MG", "MG4600005000017042282000139", "Fédération Malagasy de Taekwondo (BNI), fmtkd.mg"],
  ["MG", "MG4600008000050500401057425", "AFST (BFV-SG), afst.mg"],
  ["XK", "XK051212012345678906", "SWIFT IBAN Registry example"],
  ["XK", "XK051110164078000160", "RIT Kosovo, rit.edu"],
  ["XK", "XK051501001003342712", "RIT Kosovo, rit.edu"],
  ["XK", "XK052011000132579640", "RIT Kosovo, rit.edu"],
  ["XK", "XK051501090002825780", "Action for Mothers and Children, amchealth.org"],
];

describe("national check digits: weighted and RIB", () => {
  it.each(VECTORS)("%s accepts %s (%s)", (_cc, iban) => {
    expect(IBAN.isValid(iban)).toBe(true);
  });

  // Try every value of each check field (with the IBAN check digits
  // recomputed each time): only the published one may validate. Without a
  // generator every value would be accepted.
  it.each(VECTORS)("%s accepts only the published check digits for %s", (cc, iban) => {
    for (const [offset, length] of FIELDS[cc]) {
      const accepted = allValues(length).filter((digits) =>
        IBAN.isValid(withCheckDigits(iban.slice(0, offset) + digits + iban.slice(offset + length))),
      );

      expect(accepted).toEqual([iban.slice(offset, offset + length)]);
    }
  });

  it("reports a wrong HU branch check digit", () => {
    const iban = withCheckDigits("HU00117730171111101800000000");

    expect(() => new IBAN(iban)).toThrow(/branch check digit/);
  });

  it.each(Object.keys(FIELDS))("%s random IBANs are valid", (cc) => {
    for (let i = 0; i < 20; i++) {
      expect(IBAN.isValid(IBAN.random(cc as CountryCode).toString())).toBe(true);
    }
  });
});
