export enum FormatViolation {
  UNKNOWN,

  NOT_NULL,
  NOT_EMPTY,
  BIC_LENGTH_8_OR_11,
  BIC_ONLY_UPPER_CASE_LETTERS,

  // BIC Validation
  BRANCH_CODE_ONLY_LETTERS_OR_DIGITS,
  LOCATION_CODE_ONLY_LETTERS_OR_DIGITS,
  BANK_CODE_ONLY_LETTERS,

  COUNTRY_CODE_TWO_LETTERS,
  COUNTRY_CODE_ONLY_UPPER_CASE_LETTERS,
  COUNTRY_CODE_EXISTS,

  // IBAN Specific
  CHECK_DIGIT_TWO_DIGITS,
  CHECK_DIGIT_ONLY_DIGITS,
  BBAN_LENGTH,
  BBAN_ONLY_UPPER_CASE_LETTERS,
  BBAN_ONLY_DIGITS_OR_LETTERS,
  BBAN_ONLY_DIGITS,
  IBAN_VALID_CHARACTERS,

  // IbanBuilder
  COUNTRY_CODE_NOT_NULL,
  BANK_CODE_NOT_NULL,
  ACCOUNT_NUMBER_NOT_NULL,
}

export class BicFormatException extends Error {
  formatViolation: FormatViolation;
  actual?: string;
  expected?: string;

  constructor(
    formatViolation: FormatViolation,
    msg: string,
    expected?: string,
    actual?: string,
  ) {
    super(msg);

    this.formatViolation = formatViolation;
    this.expected = expected;
    this.actual = actual;
  }
}

export class IbanFormatException extends Error {
  formatViolation: FormatViolation;
  actual?: string;
  expected?: string;

  constructor(
    formatViolation: FormatViolation,
    msg: string,
    expected?: string,
    actual?: string,
  ) {
    super(msg);

    this.formatViolation = formatViolation;
    this.expected = expected;
    this.actual = actual;
  }
}

export class UnsupportedCountryException extends Error {
  actual?: string;

  constructor(msg: string, actual?: string) {
    super(msg);
    this.actual = actual;
  }
}

export class InvalidCheckDigitException extends Error {
  actual?: string;
  expected?: string;

  constructor(msg: string, expected?: string, actual?: string) {
    super(msg);

    this.expected = expected;
    this.actual = actual;
  }
}
