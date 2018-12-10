import * as ibanUtil from "./ibanUtil";
import { countryByCode, CountryCode } from "./country";
import { IBANBuilder } from "./ibanBuilder";

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
    const value = iban
      .trim()
      .replace(/ /g, "")
      .toUpperCase();

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
  toString() {
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
   * IBAN Validation testing
   *
   * @param {string} iban
   * @returns {boolean} true if the value is a valid IBAN
   */
  static isValid(iban: string): boolean {
    try {
      ibanUtil.validate(iban.replace(/[ \t-]/g, ""));
    } catch {
      return false;
    }
    return true;
  }

  static random(cc?: CountryCode): IBAN {
    if (cc !== undefined) {
      return new IBANBuilder().countryCode(cc).build();
    }
    return new IBANBuilder().build();
  }
}
