import { randInt } from "./randInt";
import { BbanStructure } from "./bbanStructure";

export enum PartType {
  BANK_CODE,
  BRANCH_CODE,
  ACCOUNT_NUMBER,
  NATIONAL_CHECK_DIGIT,
  CURRENCY_TYPE,
  ACCOUNT_TYPE,
  OWNER_ACCOUNT_NUMBER,
  IDENTIFICATION_NUMBER,
}

/**
 * Bban Structure Entry representation.
 */
export enum CharacterType {
  /**
   * Digits (numeric characters 0 to 9 only)
   */
  n,
  /**
   * Upper case letters (alphabetic characters A-Z only)
   */
  a,
  /**
   * Upper case alphanumeric characters (A-Z, a-z and 0-9)
   */
  c,
  /**
   * Blank space
   */
  e,
}

// Use by random string generation
const charByCharacterType: Record<CharacterType, string> = {
  [CharacterType.n]: "0123456789",
  [CharacterType.a]: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  [CharacterType.c]: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  [CharacterType.e]: " ",
};

// Used by validation
const charByCharacterRE: Record<CharacterType, RegExp> = {
  [CharacterType.n]: /^[0-9]+$/,
  [CharacterType.a]: /^[A-Z]+$/,
  [CharacterType.c]: /^[0-9A-Za-z]+$/,
  [CharacterType.e]: /^ +$/,
};

export class BbanStructurePart {
  private entryType: PartType;
  private characterType: CharacterType;
  private length: number;

  validateValue?(value: string, bban: string, structure: BbanStructure): void;

  private constructor(
    entryType: PartType,
    characterType: CharacterType,
    length: number,
    validate?: (value: string, bban: string, structure: BbanStructure) => void,
  ) {
    this.entryType = entryType;
    this.characterType = characterType;
    this.length = length;
    this.validateValue = validate;
  }

  static bankCode(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(PartType.BANK_CODE, characterType, length);
  }

  static branchCode(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(PartType.BRANCH_CODE, characterType, length);
  }

  static accountNumber(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.ACCOUNT_NUMBER,
      characterType,
      length,
    );
  }

  static nationalCheckDigit(
    length: number,
    characterType: CharacterType,
    validate?: (value: string, bban: string, structure: BbanStructure) => void,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.NATIONAL_CHECK_DIGIT,
      characterType,
      length,
      validate,
    );
  }

  static accountType(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(PartType.ACCOUNT_TYPE, characterType, length);
  }

  static currencyType(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(PartType.CURRENCY_TYPE, characterType, length);
  }

  static ownerAccountNumber(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.OWNER_ACCOUNT_NUMBER,
      characterType,
      length,
    );
  }

  static identificationNumber(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.IDENTIFICATION_NUMBER,
      characterType,
      length,
    );
  }

  getPartType(): PartType {
    return this.entryType;
  }

  getCharacterType(): CharacterType {
    return this.characterType;
  }

  getLength(): number {
    return this.length;
  }

  getRandom(): string {
    const charChoices = charByCharacterType[this.characterType];

    let s: string[] = [];
    for (let i = 0; i < this.getLength(); i += 1) {
      s.push(charChoices[randInt(charChoices.length)]);
    }

    return s.join("");
  }

  /**
   *  Check to see if the string value is valid for the entry
   */
  validate(value: string): boolean {
    return charByCharacterRE[this.characterType].test(value);
  }
}
