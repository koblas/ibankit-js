import { IBAN, CountryCode } from "../src";
import { calculateCheckDigit, replaceCheckDigit } from "../src/ibanUtil";

/** Give an IBAN correct mod-97 check digits, so only its BBAN decides validity. */
function withCheckDigits(iban: string): string {
  return replaceCheckDigit(iban, calculateCheckDigit(iban));
}

/**
 * Provisional countries using the French RIB key (ISO 7064 MOD-97-10
 * variant, 97 - r) as the last two BBAN digits:
 *   CEMAC (CF, CG, CM, TD) and Comoros (KM): 5n bank, 5n branch, 11n account
 *   BCEAO (BF, BJ, CI, ML, NE, SN, TG): 5 character bank, 5n branch, 12n account
 *   Morocco (MA): 3n bank, 3n city, 16n account
 *
 * Besides any existing fixture, every vector is a real published IBAN.
 */
const VECTORS: [string, string, string][] = [
  ["CM", "CM2110001068606534216000156", "Assauvet (BICEC), assauvet.org"],
  ["CM", "CM2110002000311328301300006", "FORECICC (SCB Cameroun), forecicc.com"],
  ["CM", "CM2110003024001624021781604", "La Bonne Case (SG Cameroun), labonnecase.org"],
  ["CM", "CM2110001068005906430000140", "OHADA colloquium (BICEC), ohada.com"],
  ["CF", "CF4220001000010120069700160", "existing fixture"],
  ["CF", "CF4220001000083365000462384", "Association A 9 (Ecobank), a9-association.com"],
  ["CF", "CF4220001000013316003414313", "Lycée Français Charles de Gaulle (Ecobank), lfcdg-bangui.org"],
  ["CG", "CG3930011000101013451300019", "existing fixture"],
  ["CG", "CG3930012001012953070110196", "Miss Excellence Maths, missexcellencemaths.com"],
  ["CG", "CG3930015242011012000302671", "PATN tender account (BCH), lasemaineafricaine.info"],
  ["CG", "CG3930020881002061568000063", "tender fee account (BSCA Bank), pic-roc.com"],
  ["CG", "CG3930011000209000018278622", "DURQuaP project (Crédit du Congo), lasemaineafricaine.info"],
  ["TD", "TD8960002000010271091600153", "existing fixture"],
  ["TD", "TD8960001000023215001137647", "CEP SNE tender account (Ecobank), alwihdainfo.com"],
  ["TD", "TD8960001000023215001149966", "PASET tender account (Ecobank), jobrapide.org"],
  ["KM", "KM4600005000010010904400137", "existing fixture"],
  ["BF", "BF42BF0840101300463574000390", "existing fixture"],
  ["BF", "BF42BF0840200100207364000618", "AED Bobo-Dioulasso (BOA), aed-bf.org"],
  ["BF", "BF42BF0840102200026789000042", "Buùd-Yam (BOA), buud-yam.ch"],
  ["BF", "BF42BF0230105300100010018050", "SONABEL tender account (Vista Bank), dgcmef.gov.bf"],
  ["BJ", "BJ11B00610100400271101192591", "existing fixture (older one letter bank code)"],
  ["BJ", "BJ66BJ0610100100941465000843", "Association Ya Tchegbo (BOA), yatchegbo.com"],
  ["BJ", "BJ66BJ1850110000140002470305", "Port Autonome de Cotonou (BIIC), portdecotonou.bj"],
  ["CI", "CI93CI0920100100517264000212", "COPHCI (BNI), coph-ci.org"],
  ["CI", "CI93CI0590105612164747500134", "Akwaba Mousso (Ecobank), akwabamousso.org"],
  ["CI", "CI93CI1630120500000020043593", "IAODCI (GTBank), iaodci.e-monsite.com"],
  ["CI", "CI93CI0340100101111069413067", "Children of Africa (BACI), childrenofafrica.org"],
  ["ML", "ML03D00890170001002120000447", "existing fixture (older one letter bank code)"],
  ["ML", "ML13ML0160100102600104084670", "AMALDEME (BDM), amaldememali.org"],
  ["ML", "ML13ML1350100907258252000947", "Association Anka Hina (Banque Atlantique), ankahina.org"],
  ["NE", "NE58NE0380100100130305000268", "existing fixture"],
  ["NE", "NE58NE0380101800251100275492", "NIGELEC tender (BOA Niger), haske.ne"],
  ["NE", "NE58NE0380101400963722000738", "Légale Migration Canada (BOA Niger), legalemigration.ca"],
  ["SN", "SN08SN0100152300774120009210", "Association Éducation Solidaire (BICIS), ecolespiesinstitutions.org"],
  ["SN", "SN08SN0100953500778200007235", "La Pouponnière de Mbour (BICIS), lapouponnieredembour.org"],
  ["SN", "SN08SN1000101500421934000766", "Horizon sans frontières (BOA Sénégal), dakaractu.com"],
  ["TG", "TG53TG1380100104017027000272", "ONG RAPAA (Banque Atlantique), assorapaa.com"],
  ["TG", "TG53TG0550670714095536400170", "ONG AFAD (Ecobank), afad-togo.org"],
  ["TG", "TG53TG0050125100013669868080", "OHADA colloquium registration, ohada.com"],
  ["MA", "MA64001810007800020110620318", "earthquake special fund 126 (Bank Al-Maghrib), groupebcp.com"],
  ["MA", "MA64001810007800020110620221", "COVID-19 special fund (Bank Al-Maghrib), ecoactu.ma"],
  ["MA", "MA64350810000000000645558162", "Fondation Althea (Al Barid Bank), fondation-althea.org"],
  ["MA", "MA64230780346273022103150717", "JOOD (CIH Bank), jood.ma"],
];

const COUNTRIES = [...new Set(VECTORS.map(([cc]) => cc))];

describe("RIB key: CEMAC, BCEAO, Comoros and Morocco", () => {
  it.each(VECTORS)("%s accepts %s (%s)", (_cc, iban) => {
    expect(IBAN.isValid(iban)).toBe(true);
  });

  // Try every two-digit key (with the IBAN check digits recomputed each
  // time): only the published one may validate.
  it.each(VECTORS)("%s accepts only the published RIB key for %s", (_cc, iban) => {
    const prefix = iban.slice(0, -2);
    const accepted = Array.from({ length: 100 }, (_, n) => String(n).padStart(2, "0")).filter((key) =>
      IBAN.isValid(withCheckDigits(prefix + key)),
    );

    expect(accepted).toEqual([iban.slice(-2)]);
  });

  it("splits a CEMAC BBAN", () => {
    const iban = new IBAN("CM2110001068606534216000156");
    expect(iban.getBankCode()).toBe("10001");
    expect(iban.getBranchCode()).toBe("06860");
    expect(iban.getAccountNumber()).toBe("65342160001");
    expect(iban.getNationalCheckDigit()).toBe("56");
  });

  it("splits a BCEAO BBAN", () => {
    const iban = new IBAN("SN08SN0100152300774120009210");
    expect(iban.getBankCode()).toBe("SN010");
    expect(iban.getBranchCode()).toBe("01523");
    expect(iban.getAccountNumber()).toBe("007741200092");
    expect(iban.getNationalCheckDigit()).toBe("10");
  });

  it("splits a Moroccan BBAN", () => {
    const iban = new IBAN("MA64230780346273022103150717");
    expect(iban.getBankCode()).toBe("230");
    expect(iban.getBranchCode()).toBe("780");
    expect(iban.getAccountNumber()).toBe("3462730221031507");
    expect(iban.getNationalCheckDigit()).toBe("17");
  });

  it.each(COUNTRIES)("%s random IBANs are valid", (cc) => {
    for (let i = 0; i < 20; i++) {
      expect(IBAN.isValid(IBAN.random(cc as CountryCode).toString())).toBe(true);
    }
  });
});
