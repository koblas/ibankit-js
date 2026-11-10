import * as ibanUtil from "./ibanUtil";
import { BbanStructure } from "./bbanStructure";
import { PartType } from "./structurePart";
import { CountryCode } from "./country";
import { randInt } from "./randInt";
import { UnsupportedCountryException, FormatViolation, FormatException } from "./exceptions";
import { IBAN } from "./iban";

/**
 * Iban Builder Class
 */
export class IBANBuilder {
  private countryCodeValue?: CountryCode;

  // Values by part type. A part type may span several consecutive structure
  // parts (e.g. a 4!a2!n bank code); its value then covers all of them.
  private values: Partial<Record<PartType, string>> = {};

  /**
   * Creates an Iban Builder instance.
   */
  // public constructor() {}

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
    this.values[PartType.BANK_CODE] = bankCode;
    return this;
  }

  /**
   * Sets iban's branch code.
   *
   * @param branchCode String
   * @return builder Builder
   */
  branchCode(branchCode: string): IBANBuilder {
    this.values[PartType.BRANCH_CODE] = branchCode;
    return this;
  }

  /**
   * Sets iban's account number.
   *
   * @param accountNumber String
   * @return builder Builder
   */
  accountNumber(accountNumber: string): IBANBuilder {
    this.values[PartType.ACCOUNT_NUMBER] = accountNumber;
    return this;
  }

  /**
   * Sets iban's national check digit.
   *
   * @param nationalCheckDigit String
   * @return builder Builder
   */
  nationalCheckDigit(nationalCheckDigit: string): IBANBuilder {
    this.values[PartType.NATIONAL_CHECK_DIGIT] = nationalCheckDigit;
    return this;
  }

  /**
   * Sets iban's national check digit.
   *
   * @param nationalCheckDigit String
   * @return builder Builder
   */
  branchCheckDigit(branchCheckDigit: string): IBANBuilder {
    this.values[PartType.BRANCH_CHECK_DIGIT] = branchCheckDigit;
    return this;
  }

  /**
   * Sets iban's account type.
   *
   * @param accountType String
   * @return builder Builder
   */
  accountType(accountType: string): IBANBuilder {
    this.values[PartType.ACCOUNT_TYPE] = accountType;
    return this;
  }

  /**
   * Sets iban's currency type.
   *
   * @param currencyType String
   * @return builder Builder
   */
  currencyType(currencyType: string): IBANBuilder {
    this.values[PartType.CURRENCY_TYPE] = currencyType;
    return this;
  }

  /**
   * Sets iban's owner account type.
   *
   * @param ownerAccountType String
   * @return builder Builder
   */
  ownerAccountType(ownerAccountType: string): IBANBuilder {
    this.values[PartType.OWNER_ACCOUNT_NUMBER] = ownerAccountType;
    return this;
  }

  /**
   * Sets iban's identification number.
   *
   * @param identificationNumber String
   * @return builder Builder
   */
  identificationNumber(identificationNumber: string): IBANBuilder {
    this.values[PartType.IDENTIFICATION_NUMBER] = identificationNumber;
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
  build(fillRandom = true, validate = true): IBAN {
    if (fillRandom && this.countryCodeValue == null) {
      const countryCodes = BbanStructure.supportedCountries();

      this.countryCodeValue = countryCodes[randInt(countryCodes.length)];
    }

    const structure = BbanStructure.forCountry(this.countryCodeValue);
    if (structure === null) {
      throw new Error("shouldn't happen");
    }

    this.fillMissingFieldsRandomly(fillRandom);

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

  // Setter names, for error messages
  private static readonly NAMES: Record<PartType, string> = {
    [PartType.BANK_CODE]: "bankCode",
    [PartType.BRANCH_CODE]: "branchCode",
    [PartType.ACCOUNT_NUMBER]: "accountNumber",
    [PartType.BRANCH_CHECK_DIGIT]: "branchCheckDigit",
    [PartType.NATIONAL_CHECK_DIGIT]: "nationalCheckDigit",
    [PartType.CURRENCY_TYPE]: "currencyType",
    [PartType.ACCOUNT_TYPE]: "accountType",
    [PartType.OWNER_ACCOUNT_NUMBER]: "ownerAccountType",
    [PartType.IDENTIFICATION_NUMBER]: "identificationNumber",
  };

  private getStructure(): BbanStructure {
    const structure = BbanStructure.forCountry(this.countryCodeValue);

    if (structure === null) {
      throw new UnsupportedCountryException("Country code is not supported.", this.countryCodeValue);
    }

    return structure;
  }

  /**
   * The distinct part types of the structure, in BBAN order.
   */
  private static partTypes(structure: BbanStructure): PartType[] {
    return [...new Set(structure.getParts().map((p) => p.getPartType()))];
  }

  /**
   * Returns formatted bban string.
   */
  private formatBban(): string {
    const structure = this.getStructure();

    return IBANBuilder.partTypes(structure)
      .map((partType) => this.values[partType] ?? "")
      .join("");
  }

  /**
   * Returns formatted iban string with default check digit.
   */
  private formatIban(): string {
    return `${this.countryCodeValue}${ibanUtil.DEFAULT_CHECK_DIGIT}${this.formatBban()}`;
  }

  private fillMissingFieldsRandomly(fillRandom: boolean) {
    const structure = this.getStructure();
    let needCheckDigit = false;

    for (const partType of IBANBuilder.partTypes(structure)) {
      if (this.values[partType]) {
        continue;
      }

      const parts = structure.getParts().filter((p) => p.getPartType() === partType);

      if (partType === PartType.NATIONAL_CHECK_DIGIT) {
        // Computed below, once the rest of the BBAN is known
        needCheckDigit = true;
        this.values[partType] = "".padStart(
          parts.reduce((acc, p) => acc + p.getLength(), 0),
          "0",
        );
      } else if (fillRandom) {
        this.values[partType] = parts.map((p) => p.generate("", structure)).join("");
      } else {
        throw new FormatException(
          FormatViolation.NOT_NULL,
          `${IBANBuilder.NAMES[partType]} is required; it cannot be null`,
        );
      }
    }

    if (needCheckDigit) {
      for (const entry of structure.getParts()) {
        if (entry.getPartType() === PartType.NATIONAL_CHECK_DIGIT) {
          this.values[PartType.NATIONAL_CHECK_DIGIT] = entry.generate(this.formatBban(), structure);
        }
      }
    }
  }
}
