import * as ibanUtil from "./ibanUtil";
import { BbanStructure } from "./bbanStructure";
import { PartType } from "./structurePart";
import { CountryCode } from "./country";
import { randInt } from "./randInt";
import {
  UnsupportedCountryException,
  FormatViolation,
  IbanFormatException,
} from "./exceptions";
import { IBAN } from "./iban";

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
