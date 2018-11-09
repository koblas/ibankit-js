import { CountryCode, countryByCode } from "./country";
import * as bicUtil from "./bicUtil";

/**
 * Business Identifier Codes (also known as SWIFT-BIC, BIC code, SWIFT ID or SWIFT code).
 *
 * <a href="http://en.wikipedia.org/wiki/ISO_9362">ISO_9362</a>.
 */
export class BIC {
  private value: string;

  /**
   * Returns a Bic object holding the value of the specified String.
   *
   * @param bic the String to be parsed.
   * @return a Bic object holding the value represented by the string argument.
   * @throws BicFormatException if the String doesn't contain parsable Bic.
   *         UnsupportedCountryException if bic's country is not supported.
   */
  constructor(bic: string) {
    bicUtil.validate(bic);

    this.value = bic;
  }

  /**
   * Returns the bank code from the Bic.
   *
   * @return string representation of Bic's institution code.
   */
  getBankCode(): string {
    return bicUtil.getBankCode(this.value);
  }

  /**
   * Returns the country code from the Bic.
   *
   * @return CountryCode representation of Bic's country code.
   */
  getCountryCode(): CountryCode | null {
    return countryByCode(bicUtil.getCountryCode(this.value));
  }

  /**
   * Returns the location code from the Bic.
   *
   * @return string representation of Bic's location code.
   */
  getLocationCode(): string {
    return bicUtil.getLocationCode(this.value);
  }

  /**
   * Returns the branch code from the Bic.
   *
   * @return string representation of Bic's branch code, null if Bic has no branch code.
   */
  getBranchCode(): string | null {
    if (bicUtil.hasBranchCode(this.value)) {
      return bicUtil.getBranchCode(this.value);
    }
    return null;
  }

  /**
   * override for the String() method
   */
  toString(): string {
    return this.value;
  }
}
