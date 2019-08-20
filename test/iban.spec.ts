import { IBAN } from "../src";

describe("IBAN", () => {
  describe("test IBAN.isValid", () => {
    it("valid iban", () => {
      expect(IBAN.isValid("BA391990440001200279")).toBe(true);
    });
    it("valid with spaces", () => {
      expect(IBAN.isValid("DE89 3704 0044 0532 0130 00")).toBe(true);
    });
    it("bad iban", () => {
      expect(IBAN.isValid("BA391990440001200278")).toBe(false);
    });
  });

  describe("Test check digit", () => {
    it("valid iban", () => {
      const iban = new IBAN("BA391990440001200279");
      expect(iban.getCountryCode()).toBe("BA");
    });

    it("bad iban", () => {
      expect(() => {
        new IBAN("BA391990440001200278");
      }).toThrow();
    });
  });

  describe("Test toFormat", () => {
    it("AD - 24 characters", () => {
      const iban = new IBAN("AD12 0001 2030 200359100100");
      expect(iban.toFormattedString()).toBe("AD12 0001 2030 2003 5910 0100");
    });

    it("AE - 23 characters", () => {
      const iban = new IBAN("AE07 0331 234567890123456");
      expect(iban.toFormattedString()).toBe("AE07 0331 2345 6789 0123 456");
    });
  });

  describe("Test IBAN Version 80", () => {
    it("AD", () => {
      const iban = new IBAN("AD12 0001 2030 200359100100");
      expect(iban.getCountryCode()).toBe("AD");
      expect(iban.getBankCode()).toBe("0001");
      expect(iban.getBranchCode()).toBe("2030");
      expect(iban.getAccountNumber()).toBe("200359100100");
    });

    it("AE", () => {
      const iban = new IBAN("AE07 0331 234567890123456");
      expect(iban.getCountryCode()).toBe("AE");
      expect(iban.getBankCode()).toBe("033");
      expect(iban.getAccountNumber()).toBe("1234567890123456");
    });

    it("AL", () => {
      const iban = new IBAN("AL47212110090000000235698741");
      expect(iban.getCountryCode()).toBe("AL");
      expect(iban.getBankCode()).toBe("212");
      expect(iban.getBranchCode()).toBe("1100");
      expect(iban.getNationalCheckDigit()).toBe("9");
      expect(iban.getAccountNumber()).toBe("0000000235698741");
    });

    it("AT", () => {
      const iban = new IBAN("AT611904300234573201");
      expect(iban.getCountryCode()).toBe("AT");
      expect(iban.getBankCode()).toBe("19043");
      expect(iban.getAccountNumber()).toBe("00234573201");
    });

    it("AZ", () => {
      const iban = new IBAN("AZ21NABZ00000000137010001944");
      expect(iban.getCountryCode()).toBe("AZ");
      expect(iban.getBankCode()).toBe("NABZ");
      expect(iban.getAccountNumber()).toBe("00000000137010001944");
    });

    it("BA", () => {
      const iban = new IBAN("BA391990440001200279");
      expect(iban.getCountryCode()).toBe("BA");
      expect(iban.getBankCode()).toBe("199");
      expect(iban.getBranchCode()).toBe("044");
      expect(iban.getAccountNumber()).toBe("00012002");
      expect(iban.getNationalCheckDigit()).toBe("79");
    });

    it("BE", () => {
      const iban = new IBAN("BE68539007547034");
      expect(iban.getCountryCode()).toBe("BE");
      expect(iban.getBankCode()).toBe("539");
      expect(iban.getAccountNumber()).toBe("0075470");
      expect(iban.getNationalCheckDigit()).toBe("34");
    });

    it("BG", () => {
      const iban = new IBAN("BG80BNBG96611020345678");
      expect(iban.getCountryCode()).toBe("BG");
      expect(iban.getBankCode()).toBe("BNBG");
      expect(iban.getBranchCode()).toBe("9661");
      expect(iban.getAccountType()).toBe("10");
      expect(iban.getAccountNumber()).toBe("20345678");
      expect(iban.getNationalCheckDigit()).toBe(null);
    });

    it("BH", () => {
      const iban = new IBAN("BH67BMAG00001299123456");
      expect(iban.getCountryCode()).toBe("BH");
      expect(iban.getBankCode()).toBe("BMAG");
      expect(iban.getAccountNumber()).toBe("00001299123456");
    });

    it("BR", () => {
      const iban = new IBAN("BR9700360305000010009795493P1");
      expect(iban.getCountryCode()).toBe("BR");
      expect(iban.getBankCode()).toBe("00360305");
      expect(iban.getBranchCode()).toBe("00001");
      expect(iban.getAccountNumber()).toBe("0009795493");
      expect(iban.getAccountType()).toBe("P");
      expect(iban.getOwnerAccountType()).toBe("1");
    });

    it("BY", () => {
      const iban = new IBAN("BY13NBRB3600900000002Z00AB00");
      expect(iban.getCountryCode()).toBe("BY");
      expect(iban.getBankCode()).toBe("NBRB");
      expect(iban.getAccountType()).toBe("3600");
      expect(iban.getAccountNumber()).toBe("900000002Z00AB00");
    });

    it("CH", () => {
      const iban = new IBAN("CH9300762011623852957");
      expect(iban.getCountryCode()).toBe("CH");
      expect(iban.getBankCode()).toBe("00762");
      expect(iban.getAccountNumber()).toBe("011623852957");
    });

    it("CR", () => {
      const iban = new IBAN("CR05015202001026284066");
      expect(iban.getCountryCode()).toBe("CR");
      expect(iban.getBankCode()).toBe("0152");
      expect(iban.getAccountNumber()).toBe("02001026284066");
    });

    it("CY", () => {
      const iban = new IBAN("CY17002001280000001200527600");
      expect(iban.getCountryCode()).toBe("CY");
      expect(iban.getBankCode()).toBe("002");
      expect(iban.getBranchCode()).toBe("00128");
      expect(iban.getAccountNumber()).toBe("0000001200527600");
    });

    it("CZ", () => {
      const iban = new IBAN("CZ6508000000192000145399");
      expect(iban.getCountryCode()).toBe("CZ");
      expect(iban.getBankCode()).toBe("0800");
      expect(iban.getAccountNumber()).toBe("0000192000145399");
    });

    it("DE", () => {
      const iban = new IBAN("DE89370400440532013000");
      expect(iban.getCountryCode()).toBe("DE");
      expect(iban.getBankCode()).toBe("37040044");
      expect(iban.getAccountNumber()).toBe("0532013000");
    });

    it("DK", () => {
      const iban = new IBAN("DK5000400440116243");
      expect(iban.getCountryCode()).toBe("DK");
      expect(iban.getBankCode()).toBe("0040");
      expect(iban.getAccountNumber()).toBe("0440116243");
    });

    it("DO", () => {
      const iban = new IBAN("DO28BAGR00000001212453611324");
      expect(iban.getCountryCode()).toBe("DO");
      expect(iban.getBankCode()).toBe("BAGR");
      expect(iban.getAccountNumber()).toBe("00000001212453611324");
    });

    it("EE", () => {
      const iban = new IBAN("EE382200221020145685");
      expect(iban.getCountryCode()).toBe("EE");
      expect(iban.getBankCode()).toBe("22");
      expect(iban.getBranchCode()).toBe("00");
      expect(iban.getAccountNumber()).toBe("22102014568");
      expect(iban.getNationalCheckDigit()).toBe("5");
    });

    it("ES", () => {
      const iban = new IBAN("ES9121000418450200051332");
      expect(iban.getCountryCode()).toBe("ES");
      expect(iban.getBankCode()).toBe("2100");
      expect(iban.getBranchCode()).toBe("0418");
      expect(iban.getAccountNumber()).toBe("0200051332");
      expect(iban.getNationalCheckDigit()).toBe("45");
    });

    it("FI", () => {
      const iban = new IBAN("FI2112345600000785");
      expect(iban.getCountryCode()).toBe("FI");
      expect(iban.getBankCode()).toBe("123456");
      expect(iban.getNationalCheckDigit()).toBe("5");
      expect(iban.getAccountNumber()).toBe("0000078");
    });

    it("FO", () => {
      const iban = new IBAN("FO6264600001631634");
      expect(iban.getCountryCode()).toBe("FO");
      expect(iban.getBankCode()).toBe("6460");
      expect(iban.getAccountNumber()).toBe("000163163");
      expect(iban.getNationalCheckDigit()).toBe("4");
    });

    it("FR", () => {
      const iban = new IBAN("FR1420041010050500013M02606");
      expect(iban.getCountryCode()).toBe("FR");
      expect(iban.getBankCode()).toBe("20041");
      expect(iban.getBranchCode()).toBe("01005");
      expect(iban.getAccountNumber()).toBe("0500013M026");
      expect(iban.getNationalCheckDigit()).toBe("06");
    });

    it("GB", () => {
      const iban = new IBAN("GB29NWBK60161331926819");
      expect(iban.getCountryCode()).toBe("GB");
      expect(iban.getBankCode()).toBe("NWBK");
      expect(iban.getBranchCode()).toBe("601613");
      expect(iban.getAccountNumber()).toBe("31926819");
    });

    it("GE", () => {
      const iban = new IBAN("GE29NB0000000101904917");
      expect(iban.getCountryCode()).toBe("GE");
      expect(iban.getBankCode()).toBe("NB");
      expect(iban.getAccountNumber()).toBe("0000000101904917");
    });

    it("GI", () => {
      const iban = new IBAN("GI75NWBK000000007099453");
      expect(iban.getCountryCode()).toBe("GI");
      expect(iban.getBankCode()).toBe("NWBK");
      expect(iban.getAccountNumber()).toBe("000000007099453");
    });

    it("GL", () => {
      const iban = new IBAN("GL8964710001000206");
      expect(iban.getCountryCode()).toBe("GL");
      expect(iban.getBankCode()).toBe("6471");
      expect(iban.getAccountNumber()).toBe("0001000206");
    });

    it("GR", () => {
      const iban = new IBAN("GR1601101250000000012300695");
      expect(iban.getCountryCode()).toBe("GR");
      expect(iban.getBankCode()).toBe("011");
      expect(iban.getBranchCode()).toBe("0125");
      expect(iban.getAccountNumber()).toBe("0000000012300695");
    });

    it("GT", () => {
      const iban = new IBAN("GT82TRAJ01020000001210029690");
      expect(iban.getCountryCode()).toBe("GT");
      expect(iban.getBankCode()).toBe("TRAJ");
      expect(iban.getCurrencyType()).toBe("01");
      expect(iban.getAccountType()).toBe("02");
      expect(iban.getAccountNumber()).toBe("0000001210029690");
    });

    it("HR", () => {
      const iban = new IBAN("HR1210010051863000160");
      expect(iban.getCountryCode()).toBe("HR");
      expect(iban.getBankCode()).toBe("1001005");
      expect(iban.getAccountNumber()).toBe("1863000160");
    });

    it("HU", () => {
      const iban = new IBAN("HU42117730161111101800000000");
      expect(iban.getCountryCode()).toBe("HU");
      expect(iban.getBankCode()).toBe("117");
      expect(iban.getBranchCode()).toBe("7301");
      expect(iban.getAccountNumber()).toBe("6111110180000000");
      expect(iban.getNationalCheckDigit()).toBe("0");
    });

    it("IE", () => {
      const iban = new IBAN("IE29AIBK93115212345678");
      expect(iban.getCountryCode()).toBe("IE");
      expect(iban.getBankCode()).toBe("AIBK");
      expect(iban.getBranchCode()).toBe("931152");
      expect(iban.getAccountNumber()).toBe("12345678");
    });

    it("IL", () => {
      const iban = new IBAN("IL620108000000099999999");
      expect(iban.getCountryCode()).toBe("IL");
      expect(iban.getBankCode()).toBe("010");
      expect(iban.getBranchCode()).toBe("800");
      expect(iban.getAccountNumber()).toBe("0000099999999");
    });

    it("IQ", () => {
      const iban = new IBAN("IQ98NBIQ850123456789012");
      expect(iban.getCountryCode()).toBe("IQ");
      expect(iban.getBankCode()).toBe("NBIQ");
      expect(iban.getBranchCode()).toBe("850");
      expect(iban.getAccountNumber()).toBe("123456789012");
    });

    it("IS", () => {
      const iban = new IBAN("IS140159260076545510730339");
      expect(iban.getCountryCode()).toBe("IS");
      expect(iban.getBankCode()).toBe("0159");
      expect(iban.getBranchCode()).toBe("26");
      expect(iban.getAccountNumber()).toBe("007654");
      expect(iban.getIdentificationNumber()).toBe("5510730339");
    });

    it("IT", () => {
      const iban = new IBAN("IT60X0542811101000000123456");
      expect(iban.getCountryCode()).toBe("IT");
      expect(iban.getBankCode()).toBe("05428");
      expect(iban.getBranchCode()).toBe("11101");
      expect(iban.getAccountNumber()).toBe("000000123456");
    });

    it("JO", () => {
      const iban = new IBAN("JO94CBJO0010000000000131000302");
      expect(iban.getCountryCode()).toBe("JO");
      expect(iban.getBankCode()).toBe("CBJO");
      expect(iban.getBranchCode()).toBe("0010");
      expect(iban.getAccountNumber()).toBe("000000000131000302");
    });

    it("KW", () => {
      const iban = new IBAN("KW81CBKU0000000000001234560101");
      expect(iban.getCountryCode()).toBe("KW");
      expect(iban.getBankCode()).toBe("CBKU");
      expect(iban.getAccountNumber()).toBe("0000000000001234560101");
    });

    it("KZ", () => {
      const iban = new IBAN("KZ86125KZT5004100100");
      expect(iban.getCountryCode()).toBe("KZ");
      expect(iban.getBankCode()).toBe("125");
      expect(iban.getAccountNumber()).toBe("KZT5004100100");
    });

    it("LB", () => {
      const iban = new IBAN("LB62099900000001001901229114");
      expect(iban.getCountryCode()).toBe("LB");
      expect(iban.getBankCode()).toBe("0999");
      expect(iban.getAccountNumber()).toBe("00000001001901229114");
    });

    it("LC", () => {
      const iban = new IBAN("LC07HEMM000100010012001200013015");
      expect(iban.getCountryCode()).toBe("LC");
      expect(iban.getBankCode()).toBe("HEMM");
      expect(iban.getAccountNumber()).toBe("000100010012001200013015");
    });

    it("LI", () => {
      const iban = new IBAN("LI21088100002324013AA");
      expect(iban.getCountryCode()).toBe("LI");
      expect(iban.getBankCode()).toBe("08810");
      expect(iban.getAccountNumber()).toBe("0002324013AA");
    });

    it("LT", () => {
      const iban = new IBAN("LT121000011101001000");
      expect(iban.getCountryCode()).toBe("LT");
      expect(iban.getBankCode()).toBe("10000");
      expect(iban.getAccountNumber()).toBe("11101001000");
    });

    it("LU", () => {
      const iban = new IBAN("LU280019400644750000");
      expect(iban.getCountryCode()).toBe("LU");
      expect(iban.getBankCode()).toBe("001");
      expect(iban.getAccountNumber()).toBe("9400644750000");
    });

    it("LV", () => {
      const iban = new IBAN("LV80BANK0000435195001");
      expect(iban.getCountryCode()).toBe("LV");
      expect(iban.getBankCode()).toBe("BANK");
      expect(iban.getAccountNumber()).toBe("0000435195001");
    });

    it("MC", () => {
      const iban = new IBAN("MC5811222000010123456789030");
      expect(iban.getCountryCode()).toBe("MC");
      expect(iban.getBankCode()).toBe("11222");
      expect(iban.getBranchCode()).toBe("00001");
      expect(iban.getAccountNumber()).toBe("01234567890");
      expect(iban.getNationalCheckDigit()).toBe("30");
    });

    it("MD", () => {
      const iban = new IBAN("MD24AG000225100013104168");
      expect(iban.getCountryCode()).toBe("MD");
      expect(iban.getBankCode()).toBe("AG");
      expect(iban.getAccountNumber()).toBe("000225100013104168");
    });

    it("ME", () => {
      const iban = new IBAN("ME25505000012345678951");
      expect(iban.getCountryCode()).toBe("ME");
      expect(iban.getBankCode()).toBe("505");
      expect(iban.getAccountNumber()).toBe("0000123456789");
      expect(iban.getNationalCheckDigit()).toBe("51");
    });

    it("MK", () => {
      const iban = new IBAN("MK07250120000058984");
      expect(iban.getCountryCode()).toBe("MK");
      expect(iban.getBankCode()).toBe("250");
      expect(iban.getAccountNumber()).toBe("1200000589");
      expect(iban.getNationalCheckDigit()).toBe("84");
    });

    it("MR", () => {
      const iban = new IBAN("MR1300020001010000123456753");
      expect(iban.getCountryCode()).toBe("MR");
      expect(iban.getBankCode()).toBe("00020");
      expect(iban.getBranchCode()).toBe("00101");
      expect(iban.getAccountNumber()).toBe("00001234567");
      expect(iban.getNationalCheckDigit()).toBe("53");
    });

    it("MT", () => {
      const iban = new IBAN("MT84MALT011000012345MTLCAST001S");
      expect(iban.getCountryCode()).toBe("MT");
      expect(iban.getBankCode()).toBe("MALT");
      expect(iban.getBranchCode()).toBe("01100");
      expect(iban.getAccountNumber()).toBe("0012345MTLCAST001S");
    });

    it("MU", () => {
      const iban = new IBAN("MU17BOMM0101101030300200000MUR");
      expect(iban.getCountryCode()).toBe("MU");
      expect(iban.getBankCode()).toBe("BOMM01");
      expect(iban.getBranchCode()).toBe("01");
      expect(iban.getAccountNumber()).toBe("101030300200000MUR");
    });

    it("NL", () => {
      const iban = new IBAN("NL91ABNA0417164300");
      expect(iban.getCountryCode()).toBe("NL");
      expect(iban.getBankCode()).toBe("ABNA");
      expect(iban.getAccountNumber()).toBe("0417164300");
    });

    it("NO", () => {
      const iban = new IBAN("NO9386011117947");
      expect(iban.getCountryCode()).toBe("NO");
      expect(iban.getBankCode()).toBe("8601");
      expect(iban.getAccountNumber()).toBe("111794");
      expect(iban.getNationalCheckDigit()).toBe("7");
    });

    it("PK", () => {
      const iban = new IBAN("PK36SCBL0000001123456702");
      expect(iban.getCountryCode()).toBe("PK");
      expect(iban.getBankCode()).toBe("SCBL");
      expect(iban.getAccountNumber()).toBe("0000001123456702");
    });

    it("PL", () => {
      const iban = new IBAN("PL61109010140000071219812874");
      expect(iban.getCountryCode()).toBe("PL");
      expect(iban.getBankCode()).toBe("109");
      expect(iban.getBranchCode()).toBe("0101");
      expect(iban.getAccountNumber()).toBe("0000071219812874");
      expect(iban.getNationalCheckDigit()).toBe("4");
    });

    it("PS", () => {
      const iban = new IBAN("PS92PALS000000000400123456702");
      expect(iban.getCountryCode()).toBe("PS");
      expect(iban.getBankCode()).toBe("PALS");
      expect(iban.getAccountNumber()).toBe("000000000400123456702");
    });

    it("PT", () => {
      const iban = new IBAN("PT50000201231234567890154");

      expect(iban.getCountryCode()).toBe("PT");
      expect(iban.getBankCode()).toBe("0002");
      expect(iban.getBranchCode()).toBe("0123");
      expect(iban.getAccountNumber()).toBe("12345678901");
      expect(iban.getNationalCheckDigit()).toBe("54");
    });

    it("QA", () => {
      const iban = new IBAN("QA58DOHB00001234567890ABCDEFG");
      expect(iban.getCountryCode()).toBe("QA");
      expect(iban.getBankCode()).toBe("DOHB");
      expect(iban.getAccountNumber()).toBe("00001234567890ABCDEFG");
    });

    it("RO", () => {
      const iban = new IBAN("RO49AAAA1B31007593840000");
      expect(iban.getCountryCode()).toBe("RO");
      expect(iban.getBankCode()).toBe("AAAA");
      expect(iban.getAccountNumber()).toBe("1B31007593840000");
    });

    it("RS", () => {
      const iban = new IBAN("RS35260005601001611379");
      expect(iban.getCountryCode()).toBe("RS");
      expect(iban.getBankCode()).toBe("260");
      expect(iban.getAccountNumber()).toBe("0056010016113");
      expect(iban.getNationalCheckDigit()).toBe("79");
    });

    it("SA", () => {
      const iban = new IBAN("SA0380000000608010167519");
      expect(iban.getCountryCode()).toBe("SA");
      expect(iban.getBankCode()).toBe("80");
      expect(iban.getAccountNumber()).toBe("000000608010167519");
    });

    it("SC", () => {
      const iban = new IBAN("SC18SSCB11010000000000001497USD");
      expect(iban.getCountryCode()).toBe("SC");
      expect(iban.getBankCode()).toBe("SSCB");
      expect(iban.getBranchCode()).toBe("1101");
      expect(iban.getAccountNumber()).toBe("0000000000001497");
    });

    it("SE", () => {
      const iban = new IBAN("SE4550000000058398257466");
      expect(iban.getCountryCode()).toBe("SE");
      expect(iban.getBankCode()).toBe("500");
      expect(iban.getAccountNumber()).toBe("00000058398257466");
    });

    it("SI", () => {
      const iban = new IBAN("SI56263300012039086");
      expect(iban.getCountryCode()).toBe("SI");
      expect(iban.getBankCode()).toBe("26");
      expect(iban.getBranchCode()).toBe("330");
      expect(iban.getAccountNumber()).toBe("00120390");
      expect(iban.getNationalCheckDigit()).toBe("86");
    });

    it("SK", () => {
      const iban = new IBAN("SK3112000000198742637541");
      expect(iban.getCountryCode()).toBe("SK");
      expect(iban.getBankCode()).toBe("1200");
      expect(iban.getAccountNumber()).toBe("0000198742637541");
    });

    it("SM", () => {
      const iban = new IBAN("SM86U0322509800000000270100");
      expect(iban.getCountryCode()).toBe("SM");
      expect(iban.getBankCode()).toBe("03225");
      expect(iban.getBranchCode()).toBe("09800");
      expect(iban.getAccountNumber()).toBe("000000270100");
    });

    it("ST", () => {
      const iban = new IBAN("ST68000100010051845310112");
      expect(iban.getCountryCode()).toBe("ST");
      expect(iban.getBankCode()).toBe("0001");
      expect(iban.getBranchCode()).toBe("0001");
      expect(iban.getAccountNumber()).toBe("0051845310112");
    });

    it("SV", () => {
      const iban = new IBAN("SV62CENR00000000000000700025");
      expect(iban.getCountryCode()).toBe("SV");
      expect(iban.getBankCode()).toBe("CENR");
      expect(iban.getBranchCode()).toBe("0000");
      expect(iban.getAccountNumber()).toBe("0000000000700025");
    });

    it("TL", () => {
      const iban = new IBAN("TL380080012345678910157");
      expect(iban.getCountryCode()).toBe("TL");
      expect(iban.getBankCode()).toBe("008");
      expect(iban.getAccountNumber()).toBe("00123456789101");
      expect(iban.getNationalCheckDigit()).toBe("57");
    });

    it("TN", () => {
      const iban = new IBAN("TN5910006035183598478831");
      expect(iban.getCountryCode()).toBe("TN");
      expect(iban.getBankCode()).toBe("10");
      expect(iban.getBranchCode()).toBe("006");
      expect(iban.getAccountNumber()).toBe("035183598478831");
    });

    it("TR", () => {
      const iban = new IBAN("TR330006100519786457841326");
      expect(iban.getCountryCode()).toBe("TR");
      expect(iban.getBankCode()).toBe("00061");
      expect(iban.getAccountNumber()).toBe("0519786457841326");
      expect(iban.getNationalCheckDigit()).toBe("0");
    });

    it("UA", () => {
      const iban = new IBAN("UA213223130000026007233566001");
      expect(iban.getCountryCode()).toBe("UA");
      expect(iban.getBankCode()).toBe("322313");
      expect(iban.getAccountNumber()).toBe("0000026007233566001");
    });

    it("VA", () => {
      const iban = new IBAN("VA59001123000012345678");
      expect(iban.getCountryCode()).toBe("VA");
      expect(iban.getBankCode()).toBe("001");
      expect(iban.getAccountNumber()).toBe("123000012345678");
    });

    it("VG", () => {
      const iban = new IBAN("VG96VPVG0000012345678901");
      expect(iban.getCountryCode()).toBe("VG");
      expect(iban.getBankCode()).toBe("VPVG");
      expect(iban.getAccountNumber()).toBe("0000012345678901");
    });

    it("XK", () => {
      const iban = new IBAN("XK051212012345678906");
      expect(iban.getCountryCode()).toBe("XK");
      expect(iban.getBankCode()).toBe("12");
      expect(iban.getBranchCode()).toBe("12");
      expect(iban.getAccountNumber()).toBe("0123456789");
      expect(iban.getNationalCheckDigit()).toBe("06");
    });
  });

  describe("provisional countries", () => {
    it("AO", () => {
      const iban = new IBAN("AO69123456789012345678901");
      expect(iban.getCountryCode()).toBe("AO");
    });

    it("BF", () => {
      const iban = new IBAN("BF2312345678901234567890123");
      expect(iban.getCountryCode()).toBe("BF");
    });

    it("BI", () => {
      const iban = new IBAN("BI41123456789012");
      expect(iban.getCountryCode()).toBe("BI");
    });

    it("BJ", () => {
      const iban = new IBAN("BJ11B00610100400271101192591");
      expect(iban.getCountryCode()).toBe("BJ");

      const iban2 = new IBAN("BJ66BJ0610100100144390000769");
      expect(iban2.getCountryCode()).toBe("BJ");
    });

    it("CF", () => {
      const iban = new IBAN("CF4220001000010120069700160");
      expect(iban.getCountryCode()).toBe("CF");
    });

    it("CI", () => {
      const iban = new IBAN("CI93CI0080111301134291200589");
      expect(iban.getCountryCode()).toBe("CI");
    });

    it("CM", () => {
      const iban = new IBAN("CM9012345678901234567890123");
      expect(iban.getCountryCode()).toBe("CM");
    });

    it("CV", () => {
      const iban = new IBAN("CV30123456789012345678901");
      expect(iban.getCountryCode()).toBe("CV");
    });

    it("DJ", () => {
      const iban = new IBAN("DJ2110002010010409943020008");
      expect(iban.getCountryCode()).toBe("DJ");
    });

    it("DZ", () => {
      const iban = new IBAN("DZ8612345678901234567890");
      expect(iban.getCountryCode()).toBe("DZ");
    });

    it("GQ", () => {
      const iban = new IBAN("GQ7050002001003715228190196");
      expect(iban.getCountryCode()).toBe("GQ");
    });

    it("HN", () => {
      const iban = new IBAN("HN54PISA00000000000000123124");
      expect(iban.getCountryCode()).toBe("HN");
    });

    it("IR", () => {
      const iban = new IBAN("IR861234568790123456789012");
      expect(iban.getCountryCode()).toBe("IR");
    });

    it("MG", () => {
      const iban = new IBAN("MG1812345678901234567890123");
      expect(iban.getCountryCode()).toBe("MG");
    });

    it("ML", () => {
      const iban = new IBAN("ML15A12345678901234567890123");
      expect(iban.getCountryCode()).toBe("ML");
    });

    it("MZ", () => {
      const iban = new IBAN("MZ25123456789012345678901");
      expect(iban.getCountryCode()).toBe("MZ");
    });

    it("SN", () => {
      const iban = new IBAN("SN52A12345678901234567890123");
      expect(iban.getCountryCode()).toBe("SN");
    });

    // ----
    it("KM", () => {
      const iban = new IBAN("KM4600005000010010904400137");
      expect(iban.getCountryCode()).toBe("KM");
    });

    it("TD", () => {
      const iban = new IBAN("TD8960002000010271091600153");
      expect(iban.getCountryCode()).toBe("TD");
    });

    it("CG", () => {
      const iban = new IBAN("CG3930011000101013451300019");
      expect(iban.getCountryCode()).toBe("CG");
    });

    it("EG", () => {
      const iban = new IBAN("EG2100037000671002392189379");
      expect(iban.getCountryCode()).toBe("EG");
    });

    it("GA", () => {
      const iban = new IBAN("GA2140021010032001890020126");
      expect(iban.getCountryCode()).toBe("GA");
    });

    it("MA", () => {
      const iban = new IBAN("MA64011519000001205000534921");
      expect(iban.getCountryCode()).toBe("MA");
    });

    it("NI", () => {
      const iban = new IBAN("NI92BAMC000000000000000003123123");
      expect(iban.getCountryCode()).toBe("NI");
    });

    it("NE", () => {
      const iban = new IBAN("NE58NE0380100100130305000268");
      expect(iban.getCountryCode()).toBe("NE");
    });

    it("TG", () => {
      const iban = new IBAN("TG53TG0090604310346500400070");
      expect(iban.getCountryCode()).toBe("TG");
    });
  });

  describe("national check digits - failures", () => {
    it("NO", () => {
      expect(() => new IBAN("NO9386011117948")).toThrow();
    });

    it("BE", () => {
      expect(() => new IBAN("BE68539007547035")).toThrow();
    });

    it("FR", () => {
      expect(() => new IBAN("FR1420041010050500013M02607")).toThrow();
    });

    it("BJ", () => {
      expect(() => new IBAN("BJ66BJ0610100100144390000760")).toThrow();
    });
  });

  describe("sample value", () => {
    it("FR", () => {
      expect(IBAN.sample("FR")).toBe("FR1420041010050500013M02606");
    });

    it("germany as default", () => {
      expect(IBAN.sample("XX")).toBe("DE89370400440532013000");
    });
  });

  describe("iban-js compatibility", () => {
    it("printFormat", () => {
      expect(IBAN.printFormat("FR1420041010050500013M02606")).toBe(
        "FR14 2004 1010 0505 0001 3M02 606",
      );
    });

    it("electronicFormat", () => {
      expect(IBAN.electronicFormat(" FR14*2&004 1010050500013M02606*")).toBe(
        "FR1420041010050500013M02606",
      );
    });

    it("toBBAN", () => {
      expect(IBAN.toBBAN(" FR142004 1010050500013M02606*")).toBe(
        "20041 01005 0500013M026 06",
      );
    });

    it("fromBBAN", () => {
      expect(IBAN.fromBBAN("FR", "20041010050500013M02606")).toBe(
        "FR1420041010050500013M02606",
      );
    });

    it("isValidBBAN", () => {
      expect(IBAN.isValidBBAN("FR", "20041010050500013M02606")).toBe(true);
    });
  });
});
