# ibankit

[![npm version](https://badge.fury.io/js/ibankit.svg)](https://badge.fury.io/js/ibankit)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/koblas/ibankit-js/blob/master/LICENSE.txt)

A library for generation and validation of International Bank Account Numbers
(IBAN, [ISO 13616](http://en.wikipedia.org/wiki/ISO_13616)) and Business
Identifier Codes (BIC, [ISO_9362](http://en.wikipedia.org/wiki/ISO_9362)).

#### Key Features

- Drop-in replaceable with [iban-js](https://www.npmjs.com/package/iban)
- Currently conformant with Version 95 (July 2023) of the IBAN registry
- Decodes bank, branch and account numbers from IBAN
- Supports random BBAN / IBAN generation for testing
- Has BIC validation as a bonus
- Supports validation of National Check Digits if part of BBAN format
- Full TypesScript support
- No external dependencies

## SWIFT IBAN Registry

This release should be compatible with the [SWIFT IBAN Registry
Version 95](https://www.swift.com/swift-resource/9606/download). There may be a limited number
of value differences, some countries in the Registry doesn't describe bank/branch information
but may expose it as `3!n4!n` but leave the branch description as a blank.

#### IBAN quick examples

```javascript
// How to generate IBAN
const ibanStr = new IBANBuilder()
  .countryCode(CountryCode.AT)
  .bankCode("19043")
  .accountNumber("00234573201")
  .build()
  .toString();

// How to create IBAN object from String
const iban = new IBAN("DE89370400440532013000");

// The library ignores spaces in IBANs, this is valid
const iban = new IBAN("DE89 3704 0044 0532 0130 00");

// For testing, the library will also generate random IBANs
const iban = IBAN.random(CountryCode.AT);
const iban = IBAN.random();
const iban = new IBANBuilder().countryCode(CountryCode.AT).bankCode("19043").build();

// For simplicity in porting from iban-js applications
// you can quickly check validity
IBAN.isValid("AT611904300234573201"); // ===  true
IBAN.isValid("DE89 3704 0044 0532 0130 00"); // == true
IBAN.isValid("hello world"); // == false
```

#### BIC quick examples

```typescript
// How to create BIC object from String
const bic = BIC("DEUTDEFF");

// Check to see is BIC code is valid
BIC.isValid("DEUTDEFF500"); // === true
```

### TODO

- [ ] Finish writing all national check digit generators (see Oracle spec)
- [x] For random IBANs the National Check digits is random, rather than "valid"

#### References

- http://en.wikipedia.org/wiki/ISO_13616
- http://en.wikipedia.org/wiki/ISO_9362
- https://www.swift.com/resource/iban-registry-pdf
- https://docs.oracle.com/cd/E18727_01/doc.121/e13483/T359831T498954.htm
- https://en.bitcoinwiki.org/wiki/International_Bank_Account_Number
- https://github.com/globalcitizen/php-iban/issues/39

#### Credits

- [iban-js](https://www.npmjs.com/package/iban) by ARHS Group
- [iban4j](https://github.com/arturmkrtchyan/iban4j) by Artur Mkrtchyan

## License

Copyright 2018-2021 David Koblas

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
