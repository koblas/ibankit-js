import { IBAN } from "../src";

describe("IBAN", () => {
  describe("Test IBAN list", () => {
    it("AD", () => {
      const iban = new IBAN("AD1200012030200359100100");
      expect(iban.getCountryCode()).toBe("AD");
    });

    it("AE", () => {
      const iban = new IBAN("AE070331234567890123456");
      expect(iban.getCountryCode()).toBe("AE");
    });

    it("AL", () => {
      const iban = new IBAN("AL47212110090000000235698741");
      expect(iban.getCountryCode()).toBe("AL");
    });

    it("AT", () => {
      const iban = new IBAN("AT611904300234573201");
      expect(iban.getCountryCode()).toBe("AT");
    });

    it("AZ", () => {
      const iban = new IBAN("AZ21NABZ00000000137010001944");
      expect(iban.getCountryCode()).toBe("AZ");
    });

    it("BA", () => {
      const iban = new IBAN("BA391290079401028494");
      expect(iban.getCountryCode()).toBe("BA");
    });

    it("BE", () => {
      const iban = new IBAN("BE68539007547034");
      expect(iban.getCountryCode()).toBe("BE");
    });

    it("BG", () => {
      const iban = new IBAN("BG80BNBG96611020345678");
      expect(iban.getCountryCode()).toBe("BG");
    });

    it("BH", () => {
      const iban = new IBAN("BH67BMAG00001299123456");
      expect(iban.getCountryCode()).toBe("BH");
    });

    it("BR", () => {
      const iban = new IBAN("BR9700360305000010009795493P1");
      expect(iban.getCountryCode()).toBe("BR");
    });

    it("BY", () => {
      const iban = new IBAN("BY13NBRB3600900000002Z00AB00");
      expect(iban.getCountryCode()).toBe("BY");
    });

    it("CH", () => {
      const iban = new IBAN("CH9300762011623852957");
      expect(iban.getCountryCode()).toBe("CH");
    });

    it("CR", () => {
      //                     CR05015202001026284066
      const iban = new IBAN("CR72012300000171549015");
      expect(iban.getCountryCode()).toBe("CR");
    });

    it("CY", () => {
      const iban = new IBAN("CY17002001280000001200527600");
      expect(iban.getCountryCode()).toBe("CY");
    });

    it("CZ", () => {
      const iban = new IBAN("CZ6508000000192000145399");
      expect(iban.getCountryCode()).toBe("CZ");
    });

    it("DE", () => {
      const iban = new IBAN("DE89370400440532013000");
      expect(iban.getCountryCode()).toBe("DE");
    });

    it("DK", () => {
      const iban = new IBAN("DK5000400440116243");
      expect(iban.getCountryCode()).toBe("DK");
    });

    it("DO", () => {
      const iban = new IBAN("DO28BAGR00000001212453611324");
      expect(iban.getCountryCode()).toBe("DO");
    });

    it("EE", () => {
      const iban = new IBAN("EE382200221020145685");
      expect(iban.getCountryCode()).toBe("EE");
    });

    it("ES", () => {
      const iban = new IBAN("ES9121000418450200051332");
      expect(iban.getCountryCode()).toBe("ES");
    });

    it("FI", () => {
      const iban = new IBAN("FI2112345600000785");
      expect(iban.getCountryCode()).toBe("FI");
    });

    it("FO", () => {
      const iban = new IBAN("FO6264600001631634");
      expect(iban.getCountryCode()).toBe("FO");
    });

    it("FR", () => {
      const iban = new IBAN("FR1420041010050500013M02606");
      expect(iban.getCountryCode()).toBe("FR");
    });

    it("GB", () => {
      const iban = new IBAN("GB29NWBK60161331926819");
      expect(iban.getCountryCode()).toBe("GB");
    });

    it("GE", () => {
      const iban = new IBAN("GE29NB0000000101904917");
      expect(iban.getCountryCode()).toBe("GE");
    });

    it("GI", () => {
      const iban = new IBAN("GI75NWBK000000007099453");
      expect(iban.getCountryCode()).toBe("GI");
    });

    it("GL", () => {
      const iban = new IBAN("GL8964710001000206");
      expect(iban.getCountryCode()).toBe("GL");
    });

    it("GR", () => {
      const iban = new IBAN("GR1601101250000000012300695");
      expect(iban.getCountryCode()).toBe("GR");
    });

    it("GT", () => {
      const iban = new IBAN("GT82TRAJ01020000001210029690");
      expect(iban.getCountryCode()).toBe("GT");
    });

    it("HR", () => {
      const iban = new IBAN("HR1210010051863000160");
      expect(iban.getCountryCode()).toBe("HR");
    });

    it("HU", () => {
      const iban = new IBAN("HU42117730161111101800000000");
      expect(iban.getCountryCode()).toBe("HU");
    });

    it("IE", () => {
      const iban = new IBAN("IE29AIBK93115212345678");
      expect(iban.getCountryCode()).toBe("IE");
    });

    it("IL", () => {
      const iban = new IBAN("IL620108000000099999999");
      expect(iban.getCountryCode()).toBe("IL");
    });

    it("IS", () => {
      const iban = new IBAN("IS140159260076545510730339");
      expect(iban.getCountryCode()).toBe("IS");
    });

    it("IT", () => {
      const iban = new IBAN("IT60X0542811101000000123456");
      expect(iban.getCountryCode()).toBe("IT");
    });

    it("IQ", () => {
      const iban = new IBAN("IQ98NBIQ850123456789012");
      expect(iban.getCountryCode()).toBe("IQ");
    });

    it("JO", () => {
      const iban = new IBAN("JO15AAAA1234567890123456789012");
      expect(iban.getCountryCode()).toBe("JO");
    });

    it("KW", () => {
      const iban = new IBAN("KW81CBKU0000000000001234560101");
      expect(iban.getCountryCode()).toBe("KW");
    });

    it("KZ", () => {
      const iban = new IBAN("KZ86125KZT5004100100");
      expect(iban.getCountryCode()).toBe("KZ");
    });

    it("LB", () => {
      const iban = new IBAN("LB62099900000001001901229114");
      expect(iban.getCountryCode()).toBe("LB");
    });

    it("LC", () => {
      const iban = new IBAN("LC07HEMM000100010012001200013015");
      expect(iban.getCountryCode()).toBe("LC");
    });

    it("LI", () => {
      const iban = new IBAN("LI21088100002324013AA");
      expect(iban.getCountryCode()).toBe("LI");
    });

    it("LT", () => {
      const iban = new IBAN("LT121000011101001000");
      expect(iban.getCountryCode()).toBe("LT");
    });

    it("LU", () => {
      const iban = new IBAN("LU280019400644750000");
      expect(iban.getCountryCode()).toBe("LU");
    });

    it("LV", () => {
      const iban = new IBAN("LV80BANK0000435195001");
      expect(iban.getCountryCode()).toBe("LV");
    });

    it("MC", () => {
      const iban = new IBAN("MC5811222000010123456789030");
      expect(iban.getCountryCode()).toBe("MC");
    });

    it("MD", () => {
      const iban = new IBAN("MD24AG000225100013104168");
      expect(iban.getCountryCode()).toBe("MD");
    });

    it("ME", () => {
      const iban = new IBAN("ME25505000012345678951");
      expect(iban.getCountryCode()).toBe("ME");
    });

    it("MK", () => {
      const iban = new IBAN("MK07250120000058984");
      expect(iban.getCountryCode()).toBe("MK");
    });

    it("MR", () => {
      const iban = new IBAN("MR1300020001010000123456753");
      expect(iban.getCountryCode()).toBe("MR");
    });

    it("MT", () => {
      const iban = new IBAN("MT84MALT011000012345MTLCAST001S");
      expect(iban.getCountryCode()).toBe("MT");
    });

    it("MU", () => {
      const iban = new IBAN("MU17BOMM0101101030300200000MUR");
      expect(iban.getCountryCode()).toBe("MU");
    });

    it("NL", () => {
      const iban = new IBAN("NL91ABNA0417164300");
      expect(iban.getCountryCode()).toBe("NL");
    });

    it("NO", () => {
      const iban = new IBAN("NO9386011117947");
      expect(iban.getCountryCode()).toBe("NO");
      expect(iban.getBankCode()).toBe("8601");
      expect(iban.getAccountNumber()).toBe("111794");
    });

    it("PK", () => {
      const iban = new IBAN("PK36SCBL0000001123456702");
      expect(iban.getCountryCode()).toBe("PK");
    });

    it("PL", () => {
      const iban = new IBAN("PL61109010140000071219812874");
      expect(iban.getCountryCode()).toBe("PL");
    });

    it("PS", () => {
      const iban = new IBAN("PS92PALS000000000400123456702");
      expect(iban.getCountryCode()).toBe("PS");
    });

    it("PT", () => {
      const iban = new IBAN("PT50000201231234567890154");
      expect(iban.getCountryCode()).toBe("PT");
    });

    it("QA", () => {
      const iban = new IBAN("QA30AAAA123456789012345678901");
      expect(iban.getCountryCode()).toBe("QA");
    });

    it("RO", () => {
      const iban = new IBAN("RO49AAAA1B31007593840000");
      expect(iban.getCountryCode()).toBe("RO");
    });

    it("RS", () => {
      const iban = new IBAN("RS35260005601001611379");
      expect(iban.getCountryCode()).toBe("RS");
    });

    it("SA", () => {
      const iban = new IBAN("SA0380000000608010167519");
      expect(iban.getCountryCode()).toBe("SA");
    });

    it("SC", () => {
      const iban = new IBAN("SC18SSCB11010000000000001497USD");
      expect(iban.getCountryCode()).toBe("SC");
    });

    it("SE", () => {
      const iban = new IBAN("SE4550000000058398257466");
      expect(iban.getCountryCode()).toBe("SE");
    });

    it("SI", () => {
      const iban = new IBAN("SI56263300012039086");
      expect(iban.getCountryCode()).toBe("SI");
    });

    it("SK", () => {
      const iban = new IBAN("SK3112000000198742637541");
      expect(iban.getCountryCode()).toBe("SK");
    });

    it("SM", () => {
      const iban = new IBAN("SM86U0322509800000000270100");
      expect(iban.getCountryCode()).toBe("SM");
    });

    it("ST", () => {
      const iban = new IBAN("ST68000100010051845310112");
      expect(iban.getCountryCode()).toBe("ST");
    });

    it("SV", () => {
      const iban = new IBAN("SV62CENR00000000000000700025");
      expect(iban.getCountryCode()).toBe("SV");
    });

    it("TL", () => {
      const iban = new IBAN("TL380080012345678910157");
      expect(iban.getCountryCode()).toBe("TL");
    });

    it("TN", () => {
      const iban = new IBAN("TN5910006035183598478831");
      expect(iban.getCountryCode()).toBe("TN");
    });

    it("TR", () => {
      const iban = new IBAN("TR330006100519786457841326");
      expect(iban.getCountryCode()).toBe("TR");
    });

    it("UA", () => {
      const iban = new IBAN("UA511234567890123456789012345");
      expect(iban.getCountryCode()).toBe("UA");
    });

    it("VG", () => {
      const iban = new IBAN("VG96VPVG0000012345678901");
      expect(iban.getCountryCode()).toBe("VG");
    });

    it("XK", () => {
      const iban = new IBAN("XK051212012345678906");
      expect(iban.getCountryCode()).toBe("XK");
    });

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

    it("DZ", () => {
      const iban = new IBAN("DZ8612345678901234567890");
      expect(iban.getCountryCode()).toBe("DZ");
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
  });
});
