import { CharacterType, BbanStructurePart, PartType } from "./structurePart";
import { CountryCode } from "./country";
import {
  FormatException,
  FormatViolation,
  RequiredPartTypeMissing,
} from "./exceptions";
import { objectEntries, objectValues } from "./poly";

/**
 * MOD11 check digit computation
 */
function mod11(value: string, weights: number[]) {
  return (
    (11 -
      (value
        .split("")
        .reduce(
          (acc, s, idx) =>
            acc + parseInt(s, 10) * weights[idx % weights.length],
          0,
        ) %
        11)) %
    11
  );
}

function nationalES(bban: string, structure: BbanStructure) {
  const weights = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];
  const combined = [PartType.BANK_CODE, PartType.BRANCH_CODE]
    .map((p) => structure.extractValueMust(bban, p))
    .join("");

  function to11(v: number) {
    if (v === 10) {
      return 1;
    } else if (v === 11) {
      return 0;
    }
    return v;
  }

  const d1 = to11(mod11(`00${combined}`, weights));
  const d2 = to11(
    mod11(structure.extractValueMust(bban, PartType.ACCOUNT_NUMBER), weights),
  );

  return `${d1}${d2}`;
}

/**
 * France Checksum (shared)
 */
function nationalFR(bban: string, structure: BbanStructure) {
  const replaceChars = {
    ["[AJ]"]: "1",
    ["[BKS]"]: "2",
    ["[CLT]"]: "3",
    ["[DMU]"]: "4",
    ["[ENV]"]: "5",
    ["[FOW]"]: "6",
    ["[GPX]"]: "7",
    ["[HQY]"]: "8",
    ["[IRZ]"]: "9",
  };
  let combined =
    [PartType.BANK_CODE, PartType.BRANCH_CODE, PartType.ACCOUNT_NUMBER]
      .map((p) => String(structure.extractValue(bban, p)))
      .join("") + "00";
  objectEntries(replaceChars).map(
    ([k, v]) => (combined = combined.replace(new RegExp(k, "g"), v)),
  );

  // Number is bigger than max integer, take the mod%97 by hand
  const expected =
    97 -
    combined.split("").reduce((acc, v) => (acc * 10 + parseInt(v)) % 97, 0);

  return String(expected).padStart(2, "0");
}

function nationalIT(bban: string, structure: BbanStructure) {
  const even = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
  ];
  const odd = [
    1,
    0,
    5,
    7,
    9,
    13,
    15,
    17,
    19,
    21,
    2,
    4,
    18,
    20,
    11,
    3,
    6,
    8,
    12,
    14,
    16,
    10,
    22,
    25,
    24,
    23,
  ];
  const V0 = "0".charCodeAt(0);
  const V9 = "9".charCodeAt(0);
  const VA = "A".charCodeAt(0);
  const value =
    [PartType.BANK_CODE, PartType.BRANCH_CODE, PartType.ACCOUNT_NUMBER]
      .map((p) => structure.extractValueMust(bban, p))
      .join("")
      .split("")
      .map((v) => v.toUpperCase().charCodeAt(0))
      .map((v) => v - (V0 <= v && v <= V9 ? V0 : VA))
      .reduce((acc, v, idx) => acc + (idx % 2 === 0 ? odd[v] : even[v]), 0) %
    26;

  return String.fromCharCode(VA + value);
}

function nationalNO(bban: string, structure: BbanStructure) {
  const value = [PartType.BANK_CODE, PartType.ACCOUNT_NUMBER]
    .map((p) => structure.extractValueMust(bban, p))
    .join("");

  return String(mod11(value, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 10);
}

// ISO 7064 MOD 10
function nationalPT(bban: string, structure: BbanStructure) {
  const V0 = "0".charCodeAt(0);
  const weights = [
    73,
    17,
    89,
    38,
    62,
    45,
    53,
    15,
    50,
    5,
    49,
    34,
    81,
    76,
    27,
    90,
    9,
    30,
    3,
  ];
  const remainder = [
    PartType.BANK_CODE,
    PartType.BRANCH_CODE,
    PartType.ACCOUNT_NUMBER,
  ]
    .map((p) => structure.extractValueMust(bban, p))
    .join("")
    .split("")
    .map((v) => v.charCodeAt(0))
    .reduce((acc, v, idx) => (acc + (v - V0) * weights[idx]) % 97, 0);

  return String(98 - remainder).padStart(2, "0");
}

/**
 * Class which represents bban structure
 *
 * Useful references --
 *    https://www.mobilefish.com/services/bban_iban/bban_iban.php
 */
export class BbanStructure {
  private static bbanFR = new BbanStructure(
    BbanStructurePart.bankCode(5, CharacterType.n),
    BbanStructurePart.branchCode(5, CharacterType.n),
    BbanStructurePart.accountNumber(11, CharacterType.c),
    BbanStructurePart.nationalCheckDigit(2, CharacterType.n, nationalFR),
  );

  static structures: { [key in CountryCode]?: BbanStructure } = {
    [CountryCode.AD]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.AE]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.AL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    // Provisional
    [CountryCode.AO]: new BbanStructure(
      BbanStructurePart.accountNumber(21, CharacterType.n),
    ),

    [CountryCode.AT]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
    ),

    [CountryCode.AZ]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(20, CharacterType.c),
    ),

    [CountryCode.BA]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.BE]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(7, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(
        2,
        CharacterType.n,
        (bban: string, structure: BbanStructure) => {
          const accountNumber = structure.extractValue(
            bban,
            PartType.ACCOUNT_NUMBER,
          );
          const bankCode = structure.extractValue(bban, PartType.BANK_CODE);

          if (accountNumber === null || bankCode === null) {
            throw new FormatException(
              FormatViolation.NOT_EMPTY,
              "account number or bank code missing",
            );
          }

          const value = parseInt(`${bankCode}${accountNumber}`, 10);

          const remainder = Math.floor(value / 97);

          let expected = value - remainder * 97;
          if (expected === 0) {
            expected = 97;
          }

          return String(expected).padStart(2, "0");
        },
      ),
    ),

    // Provisional
    [CountryCode.BF]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.BG]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountType(2, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.c),
    ),

    [CountryCode.BH]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(14, CharacterType.c),
    ),

    // Provisional
    [CountryCode.BI]: new BbanStructure(
      BbanStructurePart.accountNumber(12, CharacterType.n),
    ),

    // Provisional
    [CountryCode.BJ]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.c),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n, nationalFR),
    ),

    [CountryCode.BR]: new BbanStructure(
      BbanStructurePart.bankCode(8, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
      BbanStructurePart.accountType(1, CharacterType.a),
      BbanStructurePart.ownerAccountNumber(1, CharacterType.c),
    ),

    // https://www.nbrb.by/payment/ibanbic/ais-pbi_v2-7.pdf
    // 4c - symbolic code of the bank from the BIC directory (SI029);
    // 4n - balance sheet account according to the Chart of accounts of
    //      accounting in banks and non-bank financial institutions of the
    //      Republic of Belarus and according to the Chart of accounts of
    //      accounting in the National Bank. Corresponds to the directory of
    //      balance sheet accounts of RB banks (SI002) and the directory of
    //      balance sheet accounts of the National Bank (SI001)
    [CountryCode.BY]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountType(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    // Provisional
    [CountryCode.CF]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
      // @TODO is this france?
    ),

    // Provisional
    [CountryCode.CG]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
      // @TODO is this france?
    ),

    [CountryCode.CH]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    // Provisional
    [CountryCode.CI]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.c),
      BbanStructurePart.accountNumber(22, CharacterType.n),
    ),

    // Provisional
    [CountryCode.CM]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.CR]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(14, CharacterType.n),
    ),

    // Provisional
    [CountryCode.CV]: new BbanStructure(
      BbanStructurePart.accountNumber(21, CharacterType.n),
    ),

    [CountryCode.CY]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    // Registry defines this as 4!n6!n10!n -- but does not discuss branch information
    // This is improved with info from
    //    https://www.cnb.cz/en/payments/iban/iban-international-bank-account-number-basic-information/
    [CountryCode.CZ]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.DE]: new BbanStructure(
      BbanStructurePart.bankCode(8, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    // Provisional
    [CountryCode.DJ]: BbanStructure.bbanFR,

    // Registry defines 4!n9!n1!n -- however no information on
    // nationalCheckDigit exist and all documentation discusses
    // that the account number is "10 digits"
    //
    //  This mentions checksum
    //    https://www.finanssiala.fi/maksujenvalitys/dokumentit/IBAN_in_payments.pdf
    [CountryCode.DK]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.DO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountNumber(20, CharacterType.n),
    ),

    // Provisional
    [CountryCode.DZ]: new BbanStructure(
      BbanStructurePart.accountNumber(20, CharacterType.n),
    ),

    [CountryCode.EE]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.EG]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(17, CharacterType.n),
    ),

    // Spain is 4!n4!n1!n1!n10!n -- but the check digit is 2 digits?
    [CountryCode.ES]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n, nationalES),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    // Additional details:
    //  https://www.finanssiala.fi/maksujenvalitys/dokumentit/IBAN_in_payments.pdf
    [CountryCode.FI]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
    ),

    [CountryCode.FO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(9, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    // FR IBAN covers:
    //  GF, GP, MQ, RE, PF, TF, YT, NC, BL, MF, PM, WF
    [CountryCode.FR]: BbanStructure.bbanFR,

    // Provisional
    [CountryCode.GA]: BbanStructure.bbanFR,

    // GB IBAN covers:
    //   IM, JE, GG
    [CountryCode.GB]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
    ),

    [CountryCode.GE]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.a),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.GI]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(15, CharacterType.c),
    ),

    // Same as DK (same issues)
    [CountryCode.GL]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    // Provisional
    [CountryCode.GQ]: BbanStructure.bbanFR,

    [CountryCode.GR]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.GT]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.currencyType(2, CharacterType.n),
      BbanStructurePart.accountType(2, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.HR]: new BbanStructure(
      BbanStructurePart.bankCode(7, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    // Provisional
    [CountryCode.HN]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(20, CharacterType.n),
    ),

    // Spec says account number is 1!n15!n
    // no information on 1!n exists -- most likely a bank/branch check digit
    //  https://stackoverflow.com/questions/40282199/hungarian-bban-validation
    [CountryCode.HU]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.branchCheckDigit(1, CharacterType.n),
      BbanStructurePart.accountNumber(15, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.IE]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
    ),

    [CountryCode.IL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
    ),

    [CountryCode.IQ]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.n),
    ),

    // Provisional
    [CountryCode.IR]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(19, CharacterType.n),
    ),

    [CountryCode.IS]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(6, CharacterType.n),
      BbanStructurePart.identificationNumber(10, CharacterType.n),
    ),

    [CountryCode.IT]: new BbanStructure(
      BbanStructurePart.nationalCheckDigit(1, CharacterType.a, nationalIT),
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.JO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    // Provisional
    [CountryCode.KM]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.KW]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(22, CharacterType.c),
    ),

    [CountryCode.KZ]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.c),
    ),

    [CountryCode.LB]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(20, CharacterType.c),
    ),

    [CountryCode.LC]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(24, CharacterType.n),
    ),

    [CountryCode.LI]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    [CountryCode.LT]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
    ),

    [CountryCode.LU]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.c),
    ),

    [CountryCode.LV]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(13, CharacterType.c),
    ),

    [CountryCode.LY]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(15, CharacterType.n),
    ),

    // Provisional
    [CountryCode.MA]: new BbanStructure(
      BbanStructurePart.accountNumber(24, CharacterType.n),
    ),

    [CountryCode.MC]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n, nationalFR),
    ),

    [CountryCode.MD]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.c),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    [CountryCode.ME]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n), // @TODO checkdigit
    ),

    // Provisional
    [CountryCode.MG]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.MK]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
      // @TODO checkdigit
    ),

    // Provisional
    [CountryCode.ML]: new BbanStructure(
      BbanStructurePart.bankCode(1, CharacterType.a),
      BbanStructurePart.accountNumber(23, CharacterType.n),
    ),

    [CountryCode.MR]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.MT]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    // Spec: 4!a2!n2!n12!n3!n3!a
    //  No docs on the last 3!n -- assuming account type
    //  all found IBANs have '000'
    [CountryCode.MU]: new BbanStructure(
      BbanStructurePart.bankCode(6, CharacterType.c), // 4!a2!n
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
      BbanStructurePart.accountType(3, CharacterType.n),
      BbanStructurePart.currencyType(3, CharacterType.a),
    ),

    // Provisional
    [CountryCode.MZ]: new BbanStructure(
      BbanStructurePart.accountNumber(21, CharacterType.n),
    ),

    // Provisional
    [CountryCode.NE]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.a),
      BbanStructurePart.accountNumber(22, CharacterType.n),
    ),

    // Provisional
    [CountryCode.NI]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(24, CharacterType.n),
    ),

    [CountryCode.NL]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(10, CharacterType.n),
    ),

    [CountryCode.NO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(6, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n, nationalNO),
    ),

    [CountryCode.PK]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.c),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    // 8!n16!n
    [CountryCode.PL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.PS]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(21, CharacterType.c),
    ),

    [CountryCode.PT]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(11, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n, nationalPT),
    ),

    [CountryCode.QA]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(21, CharacterType.c),
    ),

    [CountryCode.RO]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.RS]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.SA]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(18, CharacterType.c),
    ),

    [CountryCode.SC]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.branchCheckDigit(2, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
      BbanStructurePart.currencyType(3, CharacterType.a),
    ),

    [CountryCode.SE]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.n),
    ),

    [CountryCode.SI]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(8, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.SK]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.SM]: new BbanStructure(
      BbanStructurePart.nationalCheckDigit(1, CharacterType.a, nationalIT),
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(12, CharacterType.c),
    ),

    // Provisional
    [CountryCode.SN]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.c),
      BbanStructurePart.branchCode(5, CharacterType.n),
      BbanStructurePart.accountNumber(14, CharacterType.n),
    ),

    [CountryCode.ST]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.n),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.n),
    ),

    [CountryCode.SV]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.branchCode(4, CharacterType.n),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    // Provisional
    [CountryCode.TG]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.a),
      BbanStructurePart.accountNumber(22, CharacterType.n),
    ),

    // Provisional
    [CountryCode.TD]: new BbanStructure(
      BbanStructurePart.accountNumber(23, CharacterType.n),
      // @TODO is this france?
    ),

    [CountryCode.TL]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(14, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),

    [CountryCode.TN]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(3, CharacterType.n),
      BbanStructurePart.accountNumber(13, CharacterType.c),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.c),
    ),

    [CountryCode.TR]: new BbanStructure(
      BbanStructurePart.bankCode(5, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(1, CharacterType.c),
      BbanStructurePart.accountNumber(16, CharacterType.c),
    ),

    [CountryCode.UA]: new BbanStructure(
      BbanStructurePart.bankCode(6, CharacterType.n),
      BbanStructurePart.accountNumber(19, CharacterType.n),
    ),

    [CountryCode.VA]: new BbanStructure(
      BbanStructurePart.bankCode(3, CharacterType.c),
      BbanStructurePart.accountNumber(15, CharacterType.n),
    ),

    [CountryCode.VG]: new BbanStructure(
      BbanStructurePart.bankCode(4, CharacterType.a),
      BbanStructurePart.accountNumber(16, CharacterType.n),
    ),

    [CountryCode.XK]: new BbanStructure(
      BbanStructurePart.bankCode(2, CharacterType.n),
      BbanStructurePart.branchCode(2, CharacterType.n),
      BbanStructurePart.accountNumber(10, CharacterType.n),
      BbanStructurePart.nationalCheckDigit(2, CharacterType.n),
    ),
  };
  private entries: BbanStructurePart[];

  private constructor(...entries: BbanStructurePart[]) {
    this.entries = entries;
  }

  getParts(): BbanStructurePart[] {
    return this.entries;
  }

  validate(bban: string) {
    this.validateBbanLength(bban);
    this.validateBbanEntries(bban);
  }

  extractValue(bban: string, partType: PartType): string | null {
    let bbanPartOffset = 0;
    let result = null;

    for (let part of this.getParts()) {
      const partLength = part.getLength();
      const partValue = bban.substring(
        bbanPartOffset,
        bbanPartOffset + partLength,
      );

      bbanPartOffset = bbanPartOffset + partLength;
      if (part.getPartType() == partType) {
        result = (result || "") + partValue;
      }
    }

    return result;
  }

  /**
   * Return part type or fail
   */
  extractValueMust(bban: string, partType: PartType): string {
    const value = this.extractValue(bban, partType);

    if (value === null) {
      throw new RequiredPartTypeMissing(
        `Required part type [${partType}] missing`,
      );
    }

    return value;
  }

  /**
   * @param countryCode the country code.
   * @return BbanStructure for specified country or null if country is not supported.
   */
  static forCountry(
    countryCode: CountryCode | string | undefined,
  ): BbanStructure | null {
    if (!countryCode) {
      return null;
    }
    return this.structures[countryCode] || null;
  }

  static getEntries(): BbanStructure[] {
    return objectValues(this.structures) as BbanStructure[];
  }

  static supportedCountries(): CountryCode[] {
    return Object.keys(this.structures) as CountryCode[];
  }

  /**
   * Returns the length of bban.
   *
   * @return int length
   */
  public getBbanLength(): number {
    return this.entries.reduce((acc, e) => acc + e.getLength(), 0);
  }

  private validateBbanLength(bban: string) {
    const expectedBbanLength = this.getBbanLength();
    const bbanLength = bban.length;

    if (expectedBbanLength != bbanLength) {
      throw new FormatException(
        FormatViolation.BBAN_LENGTH,
        `[${bban}] length is ${bbanLength}, expected BBAN length is: ${expectedBbanLength}`,
        String(bbanLength),
        String(expectedBbanLength),
      );
    }
  }

  private validateBbanEntries(bban: string) {
    let offset = 0;

    for (let part of this.getParts()) {
      const partLength = part.getLength();
      const entryValue = bban.substring(offset, offset + partLength);

      offset = offset + partLength;

      // validate character type
      this.validateBbanEntryCharacterType(bban, part, entryValue);
    }
  }

  private validateBbanEntryCharacterType(
    bban: string,
    part: BbanStructurePart,
    entryValue: string,
  ) {
    if (!part.validate(entryValue)) {
      switch (part.getCharacterType()) {
        case CharacterType.a:
          throw new FormatException(
            FormatViolation.BBAN_ONLY_UPPER_CASE_LETTERS,
            `[${entryValue}] must contain only upper case letters.`,
            entryValue,
          );
        case CharacterType.c:
          throw new FormatException(
            FormatViolation.BBAN_ONLY_DIGITS_OR_LETTERS,
            `[${entryValue}] must contain only digits or letters.`,
            entryValue,
          );
        case CharacterType.n:
          throw new FormatException(
            FormatViolation.BBAN_ONLY_DIGITS,
            `[${entryValue}] must contain only digits.`,
            entryValue,
          );
      }
    }

    if (
      part.getPartType() === PartType.NATIONAL_CHECK_DIGIT &&
      part.hasGenerator
    ) {
      const expected = part.generate(bban, this);

      if (entryValue !== expected) {
        throw new FormatException(
          FormatViolation.NATIONAL_CHECK_DIGIT,
          `national check digit(s) don't match expect=[${expected}] actual=[${entryValue}]`,
          expected,
          entryValue,
        );
      }
    }
  }
}
