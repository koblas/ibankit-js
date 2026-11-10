# Changelog

## [1.7.0](https://github.com/koblas/ibankit-js/compare/v1.6.6...v1.7.0) (2026-11-10)


### Features

* align BBAN structures with the current SWIFT IBAN Registry ([#53](https://github.com/koblas/ibankit-js/issues/53)) ([7182cf0](https://github.com/koblas/ibankit-js/commit/7182cf0e0d4e5ab20e2d26c7d0da6f183a6717d8))
* align IS, SC and MU bank codes with the IBAN Registry ([#56](https://github.com/koblas/ibankit-js/issues/56)) ([b855578](https://github.com/koblas/ibankit-js/commit/b855578f0ca77504431480ec809798e481e7c917))
* validate embedded check digits for CZ, SK, FI, HR, IS ([#59](https://github.com/koblas/ibankit-js/issues/59)) ([034da15](https://github.com/koblas/ibankit-js/commit/034da15fcdcabc00e3f48c302559aad2f448c2c6))
* validate national check digits for AL, DJ, EE, HU, MG, MR, PL, TN, XK ([#58](https://github.com/koblas/ibankit-js/issues/58)) ([dd5a961](https://github.com/koblas/ibankit-js/commit/dd5a961f9c4893220995861a9147a44865b3ef6c))
* validate national check digits for BA, ME, MK, RS, SI, TL ([#57](https://github.com/koblas/ibankit-js/issues/57)) ([41ef050](https://github.com/koblas/ibankit-js/commit/41ef0509a52452856a475a55100beff54cd76661))
* validate the RIB key for CEMAC, BCEAO, KM and MA ([#60](https://github.com/koblas/ibankit-js/issues/60)) ([b304366](https://github.com/koblas/ibankit-js/commit/b3043665b7f5c8fc60d48e117924c2852c33b247))


### Bug Fixes

* **ML, BF:** use the 28 character BCEAO BBAN format (2c,22n) ([#55](https://github.com/koblas/ibankit-js/issues/55)) ([b576403](https://github.com/koblas/ibankit-js/commit/b576403006096ba2d2e90a029d730938769ff165))
* reject IBAN check digits outside 02-98 and allow alphanumeric OM accounts ([#61](https://github.com/koblas/ibankit-js/issues/61)) ([5973c03](https://github.com/koblas/ibankit-js/commit/5973c03eb2c8d5baaafc7bb6a266a6b7575b7ad1))

## [1.6.6](https://github.com/koblas/ibankit-js/compare/1.6.5...v1.6.6) (2026-11-10)


### Bug Fixes

* keep printFormat from emitting a trailing separator ([#45](https://github.com/koblas/ibankit-js/issues/45)) ([934069c](https://github.com/koblas/ibankit-js/commit/934069cb7bd326608444b1c0ff75417033abb39f))
* **MU:** account number is numeric (12!n) per ISO 13616 ([#44](https://github.com/koblas/ibankit-js/issues/44)) ([6a90b58](https://github.com/koblas/ibankit-js/commit/6a90b5838ed2d097ffbad4cee0b446ba0f89a2da))
