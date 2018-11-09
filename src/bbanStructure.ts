import { CharacterType, BbanStructurePart } from "./structurePart";
import { CountryCode } from "./country";

/**
 * Class which represents bban structure
 *
 * Useful references --
 *    https://www.mobilefish.com/services/bban_iban/bban_iban.php
 */
export class BbanStructure {
  static structures: { [key in CountryCode]?: BbanStructure } = {
    [CountryCode.AD]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.AE]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.AL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.AO]: new BbanStructure(
      BbanStructurePart.accountNumber(21, CharacterType.n),
    ),

    [CountryCode.AT]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
    ),

    [CountryCode.AZ]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(20, CharacterType.c),
    ),

    [CountryCode.BA]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.BE]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(7, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.BF]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.BG]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountType(2, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.c),
    ),

    [CountryCode.BH]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(14, CharacterType.c),
    ),

    [CountryCode.BI]: new BbanStructure(
      BbanStructurePart.accountNumber(12, CharacterType.n),
    ),

    [CountryCode.BJ]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.c),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.BR]: new BbanStructure(
      BbanStructurePart.bankCode(8, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
      BbanStructurePart.accountType(1, CharacterType.a),
      BbanStructurePart.ownerAccountNumber(1, CharacterType.c),
    ),

    [CountryCode.BY]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountType(4, CharacterType.n), // @FIXME Not sure
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.CI]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.c),
      BbanStructurePart.accountNumber(22, CharacterType.n),
    ),

    [CountryCode.CM]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.CR]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(14, CharacterType.n),
    ),

    [CountryCode.CV]: new BbanStructure(
      BbanStructurePart.accountNumber(21, CharacterType.n),
    ),

    [CountryCode.CY]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.CH]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.CZ]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.DE]: new BbanStructure(
      BbanStructurePart.bankCode(8, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.DK]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.DO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountNumber(20, CharacterType.n),
    ),

    [CountryCode.DZ]: new BbanStructure(
      BbanStructurePart.accountNumber(20, CharacterType.n),
    ),

    [CountryCode.EE]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.ES]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.FI]: new BbanStructure(
      BbanStructurePart.bankCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(7, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.FO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(9, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.FR]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.GE]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.a),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.GI]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(15, CharacterType.c),
    ),

    [CountryCode.GB]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
    ),

    [CountryCode.GL]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.GR]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.GT]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountNumber(20, CharacterType.c),
    ),

    [CountryCode.HR]: new BbanStructure(
      BbanStructurePart.bankCode(7, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.HU]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.IE]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
    ),

    [CountryCode.IL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
    ),

    [CountryCode.IQ]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.n),
    ),

    [CountryCode.IR]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(19, CharacterType.n),
    ),

    [CountryCode.IS]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(6, CharacterType.n),
      BbanStructurePart.identificationNumber(10, CharacterType.n),
    ),

    [CountryCode.IT]: new BbanStructure(
      BbanStructurePart.nationalCheckDigit(1, CharacterType.a),
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.JO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    [CountryCode.KW]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(22, CharacterType.c),
    ),

    [CountryCode.KZ]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.c),
    ),

    [CountryCode.LB]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(20, CharacterType.c),
    ),

    [CountryCode.LC]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(24, CharacterType.n),
    ),

    [CountryCode.LI]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.LT]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
    ),

    [CountryCode.LU]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.c),
    ),

    [CountryCode.LV]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(13, CharacterType.c),
    ),

    [CountryCode.MC]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.MD]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.c),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    [CountryCode.ME]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.MG]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.MK]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.ML]: new BbanStructure(
      BbanStructurePart.bankCode(1, CharacterType.a),
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.MT]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    [CountryCode.MR]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.MU]: new BbanStructure(
      BbanStructurePart.bankCode(6, CharacterType.c),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    [CountryCode.MZ]: new BbanStructure(
      BbanStructurePart.accountNumber(21, CharacterType.n),
    ),

    [CountryCode.NL]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.NO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(6, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.PK]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.PL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.PS]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(21, CharacterType.c),
    ),

    [CountryCode.PT]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.QA]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(21, CharacterType.c),
    ),

    [CountryCode.RO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.RS]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.SA]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    [CountryCode.SC]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
      BbanStructurePart.accountNumber(3, CharacterType.a),
    ),

    [CountryCode.SE]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(17, CharacterType.n),
    ),

    [CountryCode.SI]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.SK]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.SM]: new BbanStructure(
      BbanStructurePart.nationalCheckDigit(1, CharacterType.a),
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.SN]: new BbanStructure(
      BbanStructurePart.bankCode(1, CharacterType.a),
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.ST]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
    ),

    [CountryCode.SV]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.TL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(14, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.TN]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(15, CharacterType.c),
    ),

    [CountryCode.TR]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.c),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.UA]: new BbanStructure(
      BbanStructurePart.bankCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(19, CharacterType.n),
    ),

    [CountryCode.VG]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.XK]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),
  };
  private entries: BbanStructurePart[];

  private constructor(...entries: BbanStructurePart[]) {
    this.entries = entries;
  }

  getParts(): BbanStructurePart[] {
    return this.entries;
  }

  /**
   * @param countryCode the country code.
   * @return BbanStructure for specified country or null if country is not supported.
   */
  static forCountry(
    countryCode: CountryCode | string | undefined,
  ): BbanStructure | null {
    if (!countryCode) {
      return null;
    }
    return this.structures[countryCode] || null;
  }

  static getEntries(): BbanStructure[] {
    return Object.values(this.structures) as BbanStructure[];
  }

  static supportedCountries(): CountryCode[] {
    return Object.keys(this.structures) as CountryCode[];
  }

  /**
   * Returns the length of bban.
   *
   * @return int length
   */
  public getBbanLength(): number {
    return this.entries.reduce((acc, e) => acc + e.getLength(), 0);
  }
}
