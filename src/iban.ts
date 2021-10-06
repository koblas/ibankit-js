import * as ibanUtil from "./ibanUtil";
import { countryByCode, CountryCode } from "./country";
import { IBANBuilder } from "./ibanBuilder";

// Some useful RegEx-s
const NON_ALPHANUM = /[^a-zA-Z0-9]/g;

const samples: Record<string, string> = {
  AD: "AD1200012030200359100100",
  AE: "AE070331234567890123456",
  AL: "AL47212110090000000235698741",
  AT: "AT611904300234573201",
  AZ: "AZ21NABZ00000000137010001944",
  BA: "BA391990440001200279",
  BE: "BE68539007547034",
  BG: "BG80BNBG96611020345678",
  BH: "BH67BMAG00001299123456",
  BR: "BR9700360305000010009795493P1",
  BY: "BY13NBRB3600900000002Z00AB00",
  CH: "CH9300762011623852957",
  CR: "CR05015202001026284066",
  CY: "CY17002001280000001200527600",
  CZ: "CZ6508000000192000145399",
  DE: "DE89370400440532013000",
  DK: "DK5000400440116243",
  DO: "DO28BAGR00000001212453611324",
  EE: "EE382200221020145685",
  ES: "ES9121000418450200051332",
  FI: "FI2112345600000785",
  FO: "FO6264600001631634",
  FR: "FR1420041010050500013M02606",
  GB: "GB29NWBK60161331926819",
  GE: "GE29NB0000000101904917",
  GI: "GI75NWBK000000007099453",
  GL: "GL8964710001000206",
  GR: "GR1601101250000000012300695",
  GT: "GT82TRAJ01020000001210029690",
  HR: "HR1210010051863000160",
  HU: "HU42117730161111101800000000",
  IE: "IE29AIBK93115212345678",
  IL: "IL620108000000099999999",
  IQ: "IQ98NBIQ850123456789012",
  IS: "IS140159260076545510730339",
  IT: "IT60X0542811101000000123456",
  JO: "JO94CBJO0010000000000131000302",
  KW: "KW81CBKU0000000000001234560101",
  KZ: "KZ86125KZT5004100100",
  LB: "LB62099900000001001901229114",
  LC: "LC07HEMM000100010012001200013015",
  LI: "LI21088100002324013AA",
  LT: "LT121000011101001000",
  LU: "LU280019400644750000",
  LV: "LV80BANK0000435195001",
  MC: "MC5811222000010123456789030",
  MD: "MD24AG000225100013104168",
  ME: "ME25505000012345678951",
  MK: "MK07250120000058984",
  MR: "MR1300020001010000123456753",
  MT: "MT84MALT011000012345MTLCAST001S",
  MU: "MU17BOMM0101101030300200000MUR",
  NL: "NL91ABNA0417164300",
  NO: "NO9386011117947",
  PK: "PK36SCBL0000001123456702",
  PL: "PL61109010140000071219812874",
  PS: "PS92PALS000000000400123456702",
  PT: "PT50000201231234567890154",
  QA: "QA58DOHB00001234567890ABCDEFG",
  RO: "RO49AAAA1B31007593840000",
  RS: "RS35260005601001611379",
  SA: "SA0380000000608010167519",
  SC: "SC18SSCB11010000000000001497USD",
  SE: "SE4550000000058398257466",
  SI: "SI56263300012039086",
  SK: "SK3112000000198742637541",
  SM: "SM86U0322509800000000270100",
  ST: "ST68000100010051845310112",
  SV: "SV62CENR00000000000000700025",
  TL: "TL380080012345678910157",
  TN: "TN5910006035183598478831",
  TR: "TR330006100519786457841326",
  UA: "UA213223130000026007233566001",
  VA: "VA59001123000012345678",
  VG: "VG96VPVG0000012345678901",
  XK: "XK051212012345678906",
  AO: "AO69123456789012345678901",
  BF: "BF2312345678901234567890123",
  BI: "BI41123456789012",
  BJ: "BJ11B00610100400271101192591",
  CF: "CF4220001000010120069700160",
  CI: "CI93CI0080111301134291200589",
  CM: "CM9012345678901234567890123",
  CV: "CV30123456789012345678901",
  DJ: "DJ2110002010010409943020008",
  DZ: "DZ8612345678901234567890",
  GQ: "GQ7050002001003715228190196",
  HN: "HN54PISA00000000000000123124",
  IR: "IR861234568790123456789012",
  MG: "MG1812345678901234567890123",
  ML: "ML15A12345678901234567890123",
  MZ: "MZ25123456789012345678901",
  SN: "SN52A12345678901234567890123",
  KM: "KM4600005000010010904400137",
  TD: "TD8960002000010271091600153",
  CG: "CG3930011000101013451300019",
  EG: "EG800002000156789012345180002",
  GA: "GA2140021010032001890020126",
  MA: "MA64011519000001205000534921",
  NI: "NI92BAMC000000000000000003123123",
  NE: "NE58NE0380100100130305000268",
  TG: "TG53TG0090604310346500400070",
};

/**
 * International Bank Account Number
 *
 * <a href="http://en.wikipedia.org/wiki/ISO_13616">ISO_13616</a>.
 */
export class IBAN {
  private value: string;

  /**
   * Creates iban instance.
   *
   * @param iban the String to be parsed, any spaces are removed.
   * @throws FormatException if the String doesn't contain parsable Iban
   *         InvalidCheckDigitException if Iban has invalid check digit
   *         UnsupportedCountryException if Iban's Country is not supported.
   */
  constructor(iban: string) {
    const value = IBAN.electronicFormat(iban);

    ibanUtil.validate(value);

    this.value = value;
  }

  /**
   * Returns iban's country code.
   *
   * @return countryCode CountryCode
   */
  getCountryCode(): CountryCode {
    return countryByCode(ibanUtil.getCountryCode(this.value)) as CountryCode;
  }

  /**
   * Returns iban's check digit.
   *
   * @return checkDigit String
   */
  getCheckDigit(): string {
    return ibanUtil.getCheckDigit(this.value);
  }

  /**
   * Returns iban's account number.
   *
   * @return accountNumber String
   */
  public getAccountNumber(): string | null {
    return ibanUtil.getAccountNumber(this.value);
  }

  /**
   * Returns iban's bank code.
   *
   * @return bankCode String
   */
  public getBankCode(): string | null {
    return ibanUtil.getBankCode(this.value);
  }

  /**
   * Returns iban's branch code.
   *
   * @return branchCode String
   */
  public getBranchCode(): string | null {
    return ibanUtil.getBranchCode(this.value);
  }

  /**
   * Returns iban's national check digit.
   *
   * @return nationalCheckDigit String
   */
  public getNationalCheckDigit(): string | null {
    return ibanUtil.getNationalCheckDigit(this.value);
  }

  /**
   * Returns iban's national check digit.
   *
   * @return nationalCheckDigit String
   */
  public getBranchCheckDigit(): string | null {
    return ibanUtil.getBranchCheckDigit(this.value);
  }

  /**
   * Returns iban's currency type if encoded separate from account number
   *
   * @return nationalCheckDigit String
   */
  public getCurrencyType(): string | null {
    return ibanUtil.getCurrencyType(this.value);
  }

  /**
   * Returns iban's account type.
   *
   * @return accountType String
   */
  public getAccountType(): string | null {
    return ibanUtil.getAccountType(this.value);
  }

  /**
   * Returns iban's owner account type.
   *
   * @return ownerAccountType String
   */
  public getOwnerAccountType(): string | null {
    return ibanUtil.getOwnerAccountType(this.value);
  }

  /**
   * Returns iban's identification number.
   *
   * @return identificationNumber String
   */
  public getIdentificationNumber(): string | null {
    return ibanUtil.getIdentificationNumber(this.value);
  }

  /**
   * Returns iban's bban (Basic Bank Account Number).
   *
   * @return bban String
   */
  public getBban(): string {
    return ibanUtil.getBban(this.value);
  }

  /**
   * Returns an Iban object holding the value of the specified String.
   *
   * @param iban the String to be parsed.
   * @param format the format of the Iban.
   * @return an Iban object holding the value represented by the string argument.
   * @throws FormatException if the String doesn't contain parsable Iban
   *         InvalidCheckDigitException if Iban has invalid check digit
   *         UnsupportedCountryException if Iban's Country is not supported.
   *
   */
  toString(): string {
    return this.value;
  }

  /**
   * Returns formatted version of Iban.
   *
   * @return A string representing formatted Iban for printing.
   */
  toFormattedString(): string {
    return ibanUtil.toFormattedString(this.value);
  }

  /**
   * IBAN Validation testing [iban-js API compatibility]
   *
   * @param {string} iban
   * @returns {boolean} true if the value is a valid IBAN
   */
  static isValid(iban: string): boolean {
    try {
      ibanUtil.validate(IBAN.electronicFormat(iban)); // will throw if not valid
    } catch {
      return false;
    }
    return true;
  }

  /**
   * Convert an IBAN to a formatted BBAN - with validation[iban-js API compatibility]
   *
   * @param {string} iban
   * @param {String} [separator] the separator to use between the blocks of the BBAN, defaults to ' '
   * @returns {string|*}
   */
  static toBBAN(iban: string, separator: string = " "): string {
    const clean = IBAN.electronicFormat(iban);
    ibanUtil.validate(clean);
    return ibanUtil.toFormattedStringBBAN(clean, separator);
  }

  /**
   * Convert the passed BBAN to an IBAN for this country specification.
   * Please note that <i>"generation of the IBAN shall be the exclusive responsibility
   * of the bank/branch servicing the account"</i>. * This method implements the
   * preferred algorithm described in
   * http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
   *
   * @param countryCode the country of the BBAN
   * @param bban the BBAN to convert to IBAN
   * @returns {string} the IBAN
   */
  static fromBBAN(countryCode: string, bban: string): string {
    ibanUtil.validateBban(countryCode, IBAN.electronicFormat(bban));

    const iban = `${countryCode}00${bban}`;
    const checkDigit = ibanUtil.calculateCheckDigit(iban);

    return ibanUtil.replaceCheckDigit(iban, checkDigit);
  }

  /**
   * Check the validity of the passed BBAN. [iban-js API compatibility]
   *
   * @param countryCode the country of the BBAN
   * @param bban the BBAN to check the validity of
   */
  static isValidBBAN(countryCode: string, bban: string): boolean {
    try {
      ibanUtil.validateBban(countryCode, IBAN.electronicFormat(bban));
    } catch {
      return false;
    }
    return true;
  }

  /**
   * Standard print format of an IBAN, no validation is performed [iban-js API compatibility]
   *
   * @param iban
   * @param separator optional (default ' ')
   * @returns {string}
   */
  static printFormat(iban: string, separator: string = " "): string {
    return ibanUtil.toFormattedString(iban, separator);
  }

  /**
   * Electronic format of the IBAN, no validation is performed. [iban-js API compatibility]
   *
   * @param iban
   * @param separator
   * @returns {string}
   */
  static electronicFormat(iban: string): string {
    return iban.replace(NON_ALPHANUM, "").toUpperCase();
  }

  static random(cc?: CountryCode): IBAN {
    if (cc !== undefined) {
      return new IBANBuilder().countryCode(cc).build();
    }
    return new IBANBuilder().build();
  }

  /**
   * Return the well known version of the IBAN for this country.  This is
   * the sample provided by the ISO documentation
   */
  static sample(cc: CountryCode | string): string {
    const s = samples[cc];

    return s !== undefined ? s : samples[CountryCode.DE];
  }
}
