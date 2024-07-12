import { BIC } from "../src";

describe("BIC", () => {
  describe("Creation", () => {
    it("invalid country code", () => {
      expect(() => new BIC("DEUTAAFF500")).toThrow();
    });

    it("equal", () => {
      const bic1 = new BIC("DEUTDEFF500");
      const bic2 = new BIC("DEUTDEFF500");

      expect(bic1.toString()).toBe(bic2.toString());
    });

    it("not equal", () => {
      const bic1 = new BIC("DEUTDEFF500");
      const bic2 = new BIC("DEUTDEFF501");

      expect(bic1.toString()).not.toBe(bic2.toString());
    });

    it("bank code", () => {
      const bic = new BIC("DEUTDEFF500");

      expect(bic.getBankCode()).toBe("DEUT");
    });

    it("bank code alphanum", () => {
      const bic = new BIC("E097AEXXXXX");

      expect(bic.getBankCode()).toBe("E097");
    });

    it("country code", () => {
      const bic = new BIC("DEUTDEFF500");

      expect(bic.getCountryCode()).toBe("DE");
    });

    it("branch code", () => {
      const bic = new BIC("DEUTDEFF500");

      expect(bic.getBranchCode()).toBe("500");
    });

    it("branch code", () => {
      const bic = new BIC("DEUTDEFF");

      expect(bic.getBranchCode()).toBe(null);
    });

    it("location code", () => {
      const bic = new BIC("DEUTDEFF");

      expect(bic.getLocationCode()).toBe("FF");
    });

    it("toString 1", () => {
      const bic = new BIC("DEUTDEFF");

      expect(bic.toString()).toBe("DEUTDEFF");
    });

    it("toString 2", () => {
      const bic = new BIC("DEUTDEFF500");

      expect(bic.toString()).toBe("DEUTDEFF500");
    });
  });
});
