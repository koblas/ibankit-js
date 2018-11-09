export enum PartType {
  BANK_CODE,
  BRANCH_CODE,
  ACCOUNT_NUMBER,
  NATIONAL_CHECK_DIGIT,
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
}

const charByCharacterType: Record<CharacterType, string[]> = {
  [CharacterType.n]: "0123456789".split(""),
  [CharacterType.a]: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  [CharacterType.c]: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
};

export class BbanStructurePart {
  private entryType: PartType;
  private characterType: CharacterType;
  private length: number;

  private constructor(
    entryType: PartType,
    characterType: CharacterType,
    length: number,
  ) {
    this.entryType = entryType;
    this.characterType = characterType;
    this.length = length;
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
  ): BbanStructurePart {
    return new BbanStructurePart(
      PartType.NATIONAL_CHECK_DIGIT,
      characterType,
      length,
    );
  }

  static accountType(
    length: number,
    characterType: CharacterType,
  ): BbanStructurePart {
    return new BbanStructurePart(PartType.ACCOUNT_TYPE, characterType, length);
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
    const charChoices: string[] = charByCharacterType[this.characterType];

    let s: string[] = [];
    const randInt = (maxVal: number, minVal: number = 0) =>
      Math.floor(Math.random() * maxVal) + minVal;

    for (let i = 0; i < this.getLength(); i += 1) {
      s.push(charChoices[randInt(charChoices.length)]);
    }

    return s.join("");
  }

  /**
   *  Check to see if the string value is valid for the entry
   */
  validate(value: string): boolean {
    const validValues = charByCharacterType[this.characterType];

    return value.split("").find(v => !validValues.includes(v)) === undefined;
  }
}
