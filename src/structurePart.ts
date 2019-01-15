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

type GenerateValue = (bban: string, structure: BbanStructure) => string;

export class BbanStructurePart {
  private entryType: PartType;
  private characterType: CharacterType;
  private length: number;
  trailingSeparator: boolean;
  generate: GenerateValue;
  hasGenerator: boolean;

  private constructor(
    entryType: PartType,
    characterType: CharacterType,
    length: number,
    trailingSeparator: boolean,
    generate?: GenerateValue,
  ) {
    this.entryType = entryType;
    this.characterType = characterType;
    this.length = length;
    this.generate = generate || this.defaultGenerator;
    this.hasGenerator = !!generate;
    this.trailingSeparator = trailingSeparator;
  }

  static bankCode(
    length: number,
    characterType: CharacterType,
    trailingSeparator: boolean = true,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.BANK_CODE,
      characterType,
      length,
      trailingSeparator,
    );
  }

  static branchCode(
    length: number,
    characterType: CharacterType,
    trailingSeparator: boolean = true,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.BRANCH_CODE,
      characterType,
      length,
      trailingSeparator,
    );
  }

  static accountNumber(
    length: number,
    characterType: CharacterType,
    trailingSeparator: boolean = true,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.ACCOUNT_NUMBER,
      characterType,
      length,
      trailingSeparator,
    );
  }

  static nationalCheckDigit(
    length: number,
    characterType: CharacterType,
    generate?: GenerateValue,
    trailingSeparator: boolean = false,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.NATIONAL_CHECK_DIGIT,
      characterType,
      length,
      trailingSeparator,
      generate,
    );
  }

  static accountType(
    length: number,
    characterType: CharacterType,
    trailingSeparator: boolean = false,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.ACCOUNT_TYPE,
      characterType,
      length,
      trailingSeparator,
    );
  }

  static currencyType(
    length: number,
    characterType: CharacterType,
    trailingSeparator: boolean = false,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.CURRENCY_TYPE,
      characterType,
      length,
      trailingSeparator,
    );
  }

  static ownerAccountNumber(
    length: number,
    characterType: CharacterType,
    trailingSeparator: boolean = true,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.OWNER_ACCOUNT_NUMBER,
      characterType,
      length,
      trailingSeparator,
    );
  }

  static identificationNumber(
    length: number,
    characterType: CharacterType,
    trailingSeparator: boolean = true,
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.IDENTIFICATION_NUMBER,
      characterType,
      length,
      trailingSeparator,
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

  /**
   *  Check to see if the string value is valid for the entry
   */
  validate(value: string): boolean {
    return charByCharacterRE[this.characterType].test(value);
  }

  /**
   * Default generator to use -- just generate random sequence
   */
  private defaultGenerator(bban: string, structure: BbanStructure): string {
    const charChoices = charByCharacterType[this.characterType];

    let s: string[] = [];
    for (let i = 0; i < this.getLength(); i += 1) {
      s.push(charChoices[randInt(charChoices.length)]);
    }

    return s.join("");
  }
}
