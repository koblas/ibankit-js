import { CountryCode, countryByCode } from "./country";
import { BbanStructure } from "./bbanStructure";
import { PartType } from "./structurePart";
import {
  InvalidCheckDigitException,
  FormatViolation,
  FormatException,
  UnsupportedCountryException,
} from "./exceptions";

const ucRegex = /^[A-Z]+$/;
const numRegex = /^[0-9]+$/;

/**
 * Iban Utility Class
 */
export const DEFAULT_CHECK_DIGIT = "00";
const MOD = 97;
const MAX = 999999999;

const COUNTRY_CODE_INDEX = 0;
const COUNTRY_CODE_LENGTH = 2;
const CHECK_DIGIT_INDEX = COUNTRY_CODE_LENGTH;
const CHECK_DIGIT_LENGTH = 2;
const BBAN_INDEX = CHECK_DIGIT_INDEX + CHECK_DIGIT_LENGTH;

/**
 * Calculates Iban
 * <a href="http://en.wikipedia.org/wiki/ISO_13616#Generating_IBAN_check_digits">Check Digit</a>.
 *
 * @param iban string value
 * @throws IbanFormatException if iban contains invalid character.
 *
 * @return check digit as String
 */
export function calculateCheckDigit(iban: string): string {
  const reformattedIban = replaceCheckDigit(iban, DEFAULT_CHECK_DIGIT);
  const modResult = calculateMod(reformattedIban);
  const checkDigit = String(98 - modResult);

  return checkDigit.padStart(2, "0");
}

/**
 * Validates iban.
 *
 * @param iban to be validated.
 * @throws IbanFormatException if iban is invalid.
 *         UnsupportedCountryException if iban's country is not supported.
 *         InvalidCheckDigitException if iban has invalid check digit.
 */
export function validate(iban: string) {
  validateNotEmpty(iban);
  validateCountryCode(iban, true);
  validateCheckDigitPresence(iban);
  validateBban(getCountryCode(iban), getBban(iban));
  validateCheckDigitChecksum(iban);
}

/**
 * Validates iban checksum only, does not validate country or BBAN
 *
 * @param iban to be validated.
 * @throws IbanFormatException if iban is invalid.
 *         InvalidCheckDigitException if iban has invalid check digit.
 */
export function validateCheckDigit(iban: string) {
  validateNotEmpty(iban);
  validateCheckDigitPresence(iban);
  validateCountryCode(iban, false);
  validateCheckDigitChecksum(iban);
}

/**
 * Validates bban.
 *
 * @param countryCode country for this bban
 * @param bban to be validated.
 * @throws IbanFormatException if iban is invalid.
 *         UnsupportedCountryException if iban's country is not supported.
 *         InvalidCheckDigitException if iban has invalid check digit.
 */
export function validateBban(countryCode: string, bban: string) {
  validateCountryCode(countryCode, true);

  const structure = getBbanStructure(countryCode);

  if (!structure) {
    throw new Error("Internal error, expected structure");
  }

  structure.validate(bban);

  // validateBbanLength(iban, structure);
  // validateBbanEntries(iban, structure);
}

/**
 * Checks whether country is supporting iban.
 * @param countryCode {@link org.iban4j.CountryCode}
 *
 * @return boolean true if country supports iban, false otherwise.
 */
export function isSupportedCountry(countryCode: CountryCode): boolean {
  return BbanStructure.forCountry(countryCode) != null;
}

/**
 * Returns iban length for the specified country.
 *
 * @param countryCode {@link org.iban4j.CountryCode}
 * @return the length of the iban for the specified country.
 */
export function getIbanLength(countryCode: CountryCode): number {
  const structure = getBbanStructure(countryCode);

  if (structure === null) {
    throw new UnsupportedCountryException("Unsuppored country", countryCode);
  }

  return COUNTRY_CODE_LENGTH + CHECK_DIGIT_LENGTH + structure.getBbanLength();
}

/**
 * Returns iban's check digit.
 *
 * @param iban String
 * @return checkDigit String
 */
export function getCheckDigit(iban: string): string {
  return iban.substring(
    CHECK_DIGIT_INDEX,
    CHECK_DIGIT_INDEX + CHECK_DIGIT_LENGTH,
  );
}

/**
 * Returns iban's country code.
 *
 * @param iban String
 * @return countryCode String
 */
export function getCountryCode(iban: string): string {
  return iban.substring(
    COUNTRY_CODE_INDEX,
    COUNTRY_CODE_INDEX + COUNTRY_CODE_LENGTH,
  );
}

/**
 * Returns iban's country code and check digit.
 *
 * @param iban String
 * @return countryCodeAndCheckDigit String
 */
export function getCountryCodeAndCheckDigit(iban: string): string {
  return iban.substring(
    COUNTRY_CODE_INDEX,
    COUNTRY_CODE_INDEX + COUNTRY_CODE_LENGTH + CHECK_DIGIT_LENGTH,
  );
}

/**
 * Returns iban's bban (Basic Bank Account Number).
 *
 * @param iban String
 * @return bban String
 */
export function getBban(iban: string): string {
  return iban.substring(BBAN_INDEX);
}

/**
 * Returns iban's account number.
 *
 * @param iban String
 * @return accountNumber String
 */
export function getAccountNumber(iban: string): string | null {
  return extractBbanEntry(iban, PartType.ACCOUNT_NUMBER);
}

/**
 * Returns iban's bank code.
 *
 * @param iban String
 * @return bankCode String
 */
export function getBankCode(iban: string): string | null {
  return extractBbanEntry(iban, PartType.BANK_CODE);
}

/**
 * Returns iban's branch code.
 *
 * @param iban String
 * @return branchCode String
 */
export function getBranchCode(iban: string): string | null {
  return extractBbanEntry(iban, PartType.BRANCH_CODE);
}

/**
 * Returns iban's national check digit.
 *
 * @param iban String
 * @return nationalCheckDigit String
 */
export function getNationalCheckDigit(iban: string): string | null {
  return extractBbanEntry(iban, PartType.NATIONAL_CHECK_DIGIT);
}

/**
 * Returns iban's branch check digit.
 *
 * @param iban String
 * @return nationalCheckDigit String
 */
export function getBranchCheckDigit(iban: string): string | null {
  return extractBbanEntry(iban, PartType.BRANCH_CHECK_DIGIT);
}

/**
 * Returns iban's currency type
 *
 * @param iban String
 * @return nationalCheckDigit String
 */
export function getCurrencyType(iban: string): string | null {
  return extractBbanEntry(iban, PartType.CURRENCY_TYPE);
}

/**
 * Returns iban's account type.
 *
 * @param iban String
 * @return accountType String
 */
export function getAccountType(iban: string): string | null {
  return extractBbanEntry(iban, PartType.ACCOUNT_TYPE);
}

/**
 * Returns iban's owner account type.
 *
 * @param iban String
 * @return ownerAccountType String
 */
export function getOwnerAccountType(iban: string): string | null {
  return extractBbanEntry(iban, PartType.OWNER_ACCOUNT_NUMBER);
}

/**
 * Returns iban's identification number.
 *
 * @param iban String
 * @return identificationNumber String
 */
export function getIdentificationNumber(iban: string): string | null {
  return extractBbanEntry(iban, PartType.IDENTIFICATION_NUMBER);
}

/*
function calculateCheckDigitIban(iban: Iban): string {
  return calculateCheckDigit(iban.toString());
}
*/

/**
 * Returns an iban with replaced check digit.
 *
 * @param iban The iban
 * @return The iban without the check digit
 */
export function replaceCheckDigit(iban: string, checkDigit: string): string {
  return getCountryCode(iban) + checkDigit + getBban(iban);
}

/**
 * Returns formatted version of Iban.
 *
 * @return A string representing formatted Iban for printing.
 */
export function toFormattedString(
  iban: string,
  separator: string = " ",
): string {
  return iban.replace(/(.{4})/g, `$1${separator}`).trim();
}

/* Returns formatted version of BBAN from IBAN.
 *
 * @return A string representing formatted BBAN in "national" format
 */
export function toFormattedStringBBAN(
  iban: string,
  separator: string = " ",
): string {
  const structure = getBbanStructure(iban);

  if (structure === null) {
    throw new Error("should't happen - already validated IBAN");
  }

  const bban = getBban(iban);
  const parts = structure.getParts().reduce((acc, part) => {
    const value = structure.extractValue(bban, part.getPartType());

    return acc.concat(value || "", part.trailingSeparator ? separator : "");
  }, [] as string[]);
  parts.pop(); // Don't care about last separator

  return parts.join("");
}

export function validateCheckDigitChecksum(iban: string) {
  if (calculateMod(iban) != 1) {
    const checkDigit = getCheckDigit(iban);
    const expectedCheckDigit = calculateCheckDigit(iban);

    throw new InvalidCheckDigitException(
      `[${iban}] has invalid check digit: ${checkDigit}, expected check digit is: ${expectedCheckDigit}`,
      checkDigit,
      expectedCheckDigit,
    );
  }
}

function validateNotEmpty(iban: string) {
  if (iban == null) {
    throw new FormatException(
      FormatViolation.NOT_NULL,
      "Null can't be a valid Iban.",
    );
  }

  if (iban.length === 0) {
    throw new FormatException(
      FormatViolation.NOT_EMPTY,
      "Empty string can't be a valid Iban.",
    );
  }
}

function validateCountryCode(iban: string, hasStructure = true) {
  // check if iban contains 2 char country code
  if (iban.length < COUNTRY_CODE_LENGTH) {
    throw new FormatException(
      FormatViolation.COUNTRY_CODE_TWO_LETTERS,
      "Iban must contain 2 char country code.",
      iban,
    );
  }

  const countryCode = getCountryCode(iban);

  // check case sensitivity
  if (countryCode !== countryCode.toUpperCase() || !ucRegex.test(countryCode)) {
    throw new FormatException(
      FormatViolation.COUNTRY_CODE_ONLY_UPPER_CASE_LETTERS,
      "Iban country code must contain upper case letters.",
      countryCode,
    );
  }

  const country = countryByCode(countryCode);
  if (country == null) {
    throw new FormatException(
      FormatViolation.COUNTRY_CODE_EXISTS,
      "Iban contains non existing country code.",
      countryCode,
    );
  }

  if (hasStructure) {
    // check if country is supported
    const structure = BbanStructure.forCountry(country);
    if (structure == null) {
      throw new UnsupportedCountryException(
        "Country code is not supported.",
        countryCode,
      );
    }
  }
}

function validateCheckDigitPresence(iban: string) {
  // check if iban contains 2 digit check digit
  if (iban.length < COUNTRY_CODE_LENGTH + CHECK_DIGIT_LENGTH) {
    throw new FormatException(
      FormatViolation.CHECK_DIGIT_TWO_DIGITS,
      "Iban must contain 2 digit check digit.",
      iban.substring(COUNTRY_CODE_LENGTH),
    );
  }

  const checkDigit = getCheckDigit(iban);

  // check digits
  if (!numRegex.test(checkDigit)) {
    throw new FormatException(
      FormatViolation.CHECK_DIGIT_ONLY_DIGITS,
      "Iban's check digit should contain only digits.",
      checkDigit,
    );
  }
}

/**
 * Calculates
 * <a href="http://en.wikipedia.org/wiki/ISO_13616#Modulo_operation_on_IBAN">Iban Modulo</a>.
 *
 * @param iban String value
 * @return modulo 97
 */
function calculateMod(iban: string): number {
  const reformattedIban = getBban(iban) + getCountryCodeAndCheckDigit(iban);

  const VA = "A".charCodeAt(0);
  const VZ = "Z".charCodeAt(0);
  const V0 = "0".charCodeAt(0);
  const V9 = "9".charCodeAt(0);

  function addSum(total: number, value: number) {
    const newTotal = (value > 9 ? total * 100 : total * 10) + value;

    return newTotal > MAX ? newTotal % MOD : newTotal;
  }

  const total = reformattedIban
    .toUpperCase()
    .split("")
    .reduce((total, ch) => {
      const code = ch.charCodeAt(0);

      if (VA <= code && code <= VZ) {
        return addSum(total, code - VA + 10);
      } else if (V0 <= code && code <= V9) {
        return addSum(total, code - V0);
      } else {
        throw new FormatException(
          FormatViolation.IBAN_VALID_CHARACTERS,
          `Invalid Character[${ch}] = '${code}'`,
          ch,
        );
      }
    }, 0);

  return total % MOD;
}

function getBbanStructure(iban: string): BbanStructure | null {
  const countryCode = countryByCode(getCountryCode(iban));

  if (!countryCode) {
    return null;
  }

  return getBbanStructureByCountry(countryCode);
}

function getBbanStructureByCountry(
  countryCode: CountryCode,
): BbanStructure | null {
  return BbanStructure.forCountry(countryCode);
}

function extractBbanEntry(iban: string, partType: PartType): string | null {
  const bban = getBban(iban);
  const structure = getBbanStructure(iban);

  if (structure === null) {
    return null;
  }

  return structure.extractValue(bban, partType);
}
