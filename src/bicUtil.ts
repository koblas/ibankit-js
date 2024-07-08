import { UnsupportedCountryException, FormatException, FormatViolation } from "./exceptions";
import { countryByCode } from "./country";

const BIC8_LENGTH = 8;
const BIC11_LENGTH = 11;

const BANK_CODE_INDEX = 0;
const BANK_CODE_LENGTH = 4;
const COUNTRY_CODE_INDEX = BANK_CODE_INDEX + BANK_CODE_LENGTH;
const COUNTRY_CODE_LENGTH = 2;
const LOCATION_CODE_INDEX = COUNTRY_CODE_INDEX + COUNTRY_CODE_LENGTH;
const LOCATION_CODE_LENGTH = 2;
const BRANCH_CODE_INDEX = LOCATION_CODE_INDEX + LOCATION_CODE_LENGTH;
const BRANCH_CODE_LENGTH = 3;

const ucRegex = /^[A-Z]+$/;
const ucnumRegex = /^[A-Z0-9]+$/;

export function getBankCode(bic: string): string {
  return bic.substring(BANK_CODE_INDEX, BANK_CODE_INDEX + BANK_CODE_LENGTH);
}

export function getCountryCode(bic: string): string {
  return bic.substring(COUNTRY_CODE_INDEX, COUNTRY_CODE_INDEX + COUNTRY_CODE_LENGTH);
}

export function getLocationCode(bic: string): string {
  return bic.substring(LOCATION_CODE_INDEX, LOCATION_CODE_INDEX + LOCATION_CODE_LENGTH);
}

export function getBranchCode(bic: string): string {
  return bic.substring(BRANCH_CODE_INDEX, BRANCH_CODE_INDEX + BRANCH_CODE_LENGTH);
}

export function hasBranchCode(bic: string): boolean {
  return bic.length === BIC11_LENGTH;
}

function validateEmpty(bic: string) {
  if (bic == null) {
    throw new FormatException(FormatViolation.NOT_NULL, "Null can't be a valid Bic.");
  }

  if (bic.length === 0) {
    throw new FormatException(FormatViolation.NOT_EMPTY, "Empty string can't be a valid Bic.");
  }
}

function validateLength(bic: string) {
  if (bic.length !== BIC8_LENGTH && bic.length !== BIC11_LENGTH) {
    throw new FormatException(
      FormatViolation.BIC_LENGTH_8_OR_11,
      `Bic length must be ${BIC8_LENGTH} or ${BIC11_LENGTH}`,
    );
  }
}

function validateCase(bic: string) {
  if (bic !== bic.toUpperCase()) {
    throw new FormatException(FormatViolation.BIC_ONLY_UPPER_CASE_LETTERS, "Bic must contain only upper case letters.");
  }
}

function validateBankCode(bic: string) {
  const bankCode = getBankCode(bic);

  if (!ucnumRegex.test(bankCode)) {
    throw new FormatException(FormatViolation.BANK_CODE_ONLY_LETTERS, "Bank code must contain only letters or digits.", bankCode);
  }
}

function validateCountryCode(bic: string) {
  const countryCode = getCountryCode(bic).trim();

  if (
    countryCode.length < COUNTRY_CODE_LENGTH ||
    countryCode !== countryCode.toUpperCase() ||
    !ucRegex.test(countryCode)
  ) {
    throw new FormatException(
      FormatViolation.COUNTRY_CODE_ONLY_UPPER_CASE_LETTERS,
      "Bic country code must contain upper case letters",
      countryCode,
    );
  }

  if (countryByCode(countryCode) == null) {
    throw new UnsupportedCountryException("Country code is not supported.", countryCode);
  }
}

function validateLocationCode(bic: string) {
  const locationCode = getLocationCode(bic);

  if (!ucnumRegex.test(locationCode)) {
    throw new FormatException(
      FormatViolation.LOCATION_CODE_ONLY_LETTERS_OR_DIGITS,
      "Location code must contain only letters or digits.",
      locationCode,
    );
  }
}

function validateBranchCode(bic: string) {
  const branchCode = getBranchCode(bic);

  if (!ucnumRegex.test(branchCode)) {
    throw new FormatException(
      FormatViolation.BRANCH_CODE_ONLY_LETTERS_OR_DIGITS,
      "Branch code must contain only letters or digits.",
      branchCode,
    );
  }
}

/**
 * Validates bic.
 *
 * @param bic to be validated.
 * @throws FormatException if bic is invalid.
 *         UnsupportedCountryException if bic's country is not supported.
 */
export function validate(bic: string): void {
  validateEmpty(bic);
  validateLength(bic);
  validateCase(bic);
  validateBankCode(bic);
  validateCountryCode(bic);
  validateLocationCode(bic);

  if (hasBranchCode(bic)) {
    validateBranchCode(bic);
  }
}
