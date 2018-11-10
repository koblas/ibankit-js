import * as ibanUtil from "./ibanUtil";
import { countryByCode, CountryCode } from "./country";
import {
  FormatViolation,
  IbanFormatException,
  UnsupportedCountryException,
} from "./exceptions";
import { BbanStructure } from "./bbanStructure";
import { PartType } from "./structurePart";

function randInt(maxVal: number, minVal: number = 0) {
  return Math.floor(Math.random() * maxVal) + minVal;
}

/**
 * Iban Builder Class
 */
export class IBANBuilder {
  private countryCodeValue?: CountryCode;
  private bankCodeValue?: string;
  private branchCodeValue?: string;
  private nationalCheckDigitValue?: string;
  private accountTypeValue?: string;
  private accountNumberValue?: string;
  private ownerAccountTypeValue?: string;
  private identificationNumberValue?: string;

  /**
   * Creates an Iban Builder instance.
   */
  public constructor() {}

  /**
   * Sets iban's country code.
   *
   * @param countryCode CountryCode
   * @return builder Builder
   */
  countryCode(countryCode: CountryCode): IBANBuilder {
    this.countryCodeValue = countryCode;
    return this;
  }

  /**
   * Sets iban's bank code.
   *
   * @param bankCode String
   * @return builder Builder
   */
  bankCode(bankCode: string): IBANBuilder {
    this.bankCodeValue = bankCode;
    return this;
  }

  /**
   * Sets iban's branch code.
   *
   * @param branchCode String
   * @return builder Builder
   */
  branchCode(branchCode: string): IBANBuilder {
    this.branchCodeValue = branchCode;
    return this;
  }

  /**
   * Sets iban's account number.
   *
   * @param accountNumber String
   * @return builder Builder
   */
  accountNumber(accountNumber: string): IBANBuilder {
    this.accountNumberValue = accountNumber;
    return this;
  }

  /**
   * Sets iban's national check digit.
   *
   * @param nationalCheckDigit String
   * @return builder Builder
   */
  nationalCheckDigit(nationalCheckDigit: string): IBANBuilder {
    this.nationalCheckDigitValue = nationalCheckDigit;
    return this;
  }

  /**
   * Sets iban's account type.
   *
   * @param accountType String
   * @return builder Builder
   */
  accountType(accountType: string): IBANBuilder {
    this.accountTypeValue = accountType;
    return this;
  }

  /**
   * Sets iban's owner account type.
   *
   * @param ownerAccountType String
   * @return builder Builder
   */
  ownerAccountType(ownerAccountType: string): IBANBuilder {
    this.ownerAccountTypeValue = ownerAccountType;
    return this;
  }

  /**
   * Sets iban's identification number.
   *
   * @param identificationNumber String
   * @return builder Builder
   */
  identificationNumber(identificationNumber: string): IBANBuilder {
    this.identificationNumberValue = identificationNumber;
    return this;
  }

  /**
   * Builds new iban instance.
   *
   * @param validate boolean indicates if the generated IBAN needs to be
   *  validated after generation
   * @return new iban instance.
   * @exception IbanFormatException if values are not parsable by Iban Specification
   *  <a href="http://en.wikipedia.org/wiki/ISO_13616">ISO_13616</a>
   * @exception UnsupportedCountryException if country is not supported
   */
  build(validate: boolean = true): IBAN {
    // null checks
    this.require(
      this.countryCodeValue,
      this.bankCodeValue,
      this.accountNumberValue,
    );

    // iban is formatted with default check digit.
    const formattedIban = this.formatIban();

    const checkDigit = ibanUtil.calculateCheckDigit(formattedIban);

    // replace default check digit with calculated check digit
    const ibanValue = ibanUtil.replaceCheckDigit(formattedIban, checkDigit);

    if (validate) {
      ibanUtil.validate(ibanValue);
    }
    return new IBAN(ibanValue);
  }

  /**
   * Builds random iban instance.
   *
   * @return random iban instance.
   * @exception IbanFormatException if values are not parsable by Iban Specification
   *  <a href="http://en.wikipedia.org/wiki/ISO_13616">ISO_13616</a>
   * @exception UnsupportedCountryException if country is not supported
   *
   */
  public buildRandom(): IBAN {
    if (this.countryCodeValue == null) {
      const countryCodes = BbanStructure.supportedCountries();

      this.countryCodeValue = countryCodes[randInt(countryCodes.length)];
    }

    this.fillMissingFieldsRandomly();

    return this.build();
  }

  /**
   * Returns formatted bban string.
   */
  private formatBban(): string {
    const parts: string[] = [];
    const structure = BbanStructure.forCountry(this.countryCodeValue);

    if (structure === null) {
      throw new UnsupportedCountryException(
        "Country code is not supported.",
        this.countryCodeValue,
      );
    }

    for (const part of structure.getParts()) {
      switch (part.getPartType()) {
        case PartType.BANK_CODE:
          parts.push(this.bankCodeValue!);
          break;
        case PartType.BRANCH_CODE:
          parts.push(this.branchCodeValue!);
          break;
        case PartType.ACCOUNT_NUMBER:
          parts.push(this.accountNumberValue!);
          break;
        case PartType.NATIONAL_CHECK_DIGIT:
          parts.push(this.nationalCheckDigitValue!);
          break;
        case PartType.ACCOUNT_TYPE:
          parts.push(this.accountTypeValue!);
          break;
        case PartType.OWNER_ACCOUNT_NUMBER:
          parts.push(this.ownerAccountTypeValue!);
          break;
        case PartType.IDENTIFICATION_NUMBER:
          parts.push(this.identificationNumberValue!);
          break;
      }
    }

    return parts.join();
  }

  /**
   * Returns formatted iban string with default check digit.
   */
  private formatIban(): string {
    return `${this.countryCodeValue}${
      ibanUtil.DEFAULT_CHECK_DIGIT
    }${this.formatBban()}`;
  }

  private require(
    countryCode: CountryCode | undefined,
    bankCode: string | undefined,
    accountNumber: string | undefined,
  ) {
    if (countryCode == null) {
      throw new IbanFormatException(
        FormatViolation.COUNTRY_CODE_NOT_NULL,
        "countryCode is required; it cannot be null",
      );
    }

    if (bankCode == null) {
      throw new IbanFormatException(
        FormatViolation.BANK_CODE_NOT_NULL,
        "bankCode is required; it cannot be null",
      );
    }

    if (accountNumber == null) {
      throw new IbanFormatException(
        FormatViolation.ACCOUNT_NUMBER_NOT_NULL,
        "accountNumber is required; it cannot be null",
      );
    }
  }

  private fillMissingFieldsRandomly() {
    const structure = BbanStructure.forCountry(this.countryCodeValue);

    if (structure == null) {
      throw new UnsupportedCountryException(
        "Country code is not supported.",
        this.countryCodeValue,
      );
    }

    for (const entry of structure.getParts()) {
      switch (entry.getPartType()) {
        case PartType.BANK_CODE:
          if (!this.bankCodeValue) {
            this.bankCodeValue = entry.getRandom();
          }
          break;
        case PartType.BRANCH_CODE:
          if (!this.branchCodeValue) {
            this.branchCodeValue = entry.getRandom();
          }
          break;
        case PartType.ACCOUNT_NUMBER:
          if (!this.accountNumberValue) {
            this.accountNumberValue = entry.getRandom();
          }
          break;
        case PartType.NATIONAL_CHECK_DIGIT:
          if (!this.nationalCheckDigitValue) {
            this.nationalCheckDigitValue = entry.getRandom();
          }
          break;
        case PartType.ACCOUNT_TYPE:
          if (!this.accountTypeValue) {
            this.accountTypeValue = entry.getRandom();
          }
          break;
        case PartType.OWNER_ACCOUNT_NUMBER:
          if (!this.ownerAccountTypeValue) {
            this.ownerAccountTypeValue = entry.getRandom();
          }
          break;
        case PartType.IDENTIFICATION_NUMBER:
          if (!this.identificationNumberValue) {
            this.identificationNumberValue = entry.getRandom();
          }
          break;
      }
    }
  }
}

/**
 * International Bank Account Number
 *
 * <a href="http://en.wikipedia.org/wiki/ISO_13616">ISO_13616</a>.
 */
export class IBAN {
  // Cache string value of the iban
  private value: string;

  /**
   * Creates iban instance.
   *
   * @param iban the String to be parsed, any spaces are removed.
   * @throws IbanFormatException if the String doesn't contain parsable Iban
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
   * @throws IbanFormatException if the String doesn't contain parsable Iban
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
      ibanUtil.validate(iban);
    } catch {
      return false;
    }
    return true;
  }

  static random(cc?: CountryCode): IBAN {
    if (cc !== undefined) {
      return new IBANBuilder().countryCode(cc).buildRandom();
    }
    return new IBANBuilder().buildRandom();
  }
}
