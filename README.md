# ibankit

[![CircleCI](https://circleci.com/gh/koblas/ibankit-js/tree/master.svg?style=svg)](https://circleci.com/gh/koblas/ibankit-js/tree/master)
[![npm version](https://badge.fury.io/js/ibankit.svg)](https://badge.fury.io/js/ibankit)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/koblas/ibankit-js/blob/master/LICENSE.txt)

A library for generation and validation of the International Bank Account Numbers (<a href="http://en.wikipedia.org/wiki/ISO_13616" target="_blank">IBAN ISO_13616</a>) and Business Identifier Codes (<a href="http://en.wikipedia.org/wiki/ISO_9362" target="_blank">BIC ISO_9362</a>).

#### Key Features

- Drop in replacable with iban-js
- Currently conformant with Version 80 of the IBAN registry
- Decodes bank, branch and account numbers from IBAN
- Supports random BBAN / IBAN generation for testing
- Has BIC validation as a bonus
- Supports validation of National Check Digits if in BBAN format
- This library provides full TypesScript support
- No external dependancies

#### Iban quick examples:

```javascript
// How to generate Iban
const iban = new IbanBuilder()
  .countryCode(CountryCode.AT)
  .bankCode("19043")
  .accountNumber("00234573201")
  .build();

// How to create Iban object from String
const iban = new IBAN("DE89370400440532013000");

// The library ignores spaces in IBANs, this is valid
const iban = IBAN("DE89 3704 0044 0532 0130 00");

// For testing, the library will also generate random IBANs
const iban = IBAn.random(CountryCode.AT);
const iban = IBAN.random();
const iban = new Iban.Builder()
  .countryCode(CountryCode.AT)
  .bankCode("19043")
  .buildRandom();

// For simplicity in porting from iban-js applications
// you can quickly check validity
IBAN.isValid("AT611904300234573201"); // ===  true
IBAN.isValid("DE89 3704 0044 0532 0130 00"); // == true
IBAN.isValid("hello world"); // == false
```

#### Bic quick examples:

```typescript
// How to create Bic object from String
const bic = BIC("DEUTDEFF");

// Check to see is BIC code is valid
BIC.isValid("DEUTDEFF500"); // === true
```

#### References

- http://en.wikipedia.org/wiki/ISO_13616
- http://en.wikipedia.org/wiki/ISO_9362
- https://www.swift.com/resource/iban-registry-pdf
- https://docs.oracle.com/cd/E18727_01/doc.121/e13483/T359831T498954.htm
- https://en.bitcoinwiki.org/wiki/International_Bank_Account_Number

#### Credits

- [iban-js](https://www.npmjs.com/package/iban) by ARHS Group
- [iban4j](https://github.com/arturmkrtchyan/iban4j) by Artur Mkrtchyan

## License

Copyright 2018 David Koblas

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
