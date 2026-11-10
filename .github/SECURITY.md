# Security Policy

## Supported versions

Security fixes are released for the latest `1.x` version only. Upgrade to the
newest release on npm to receive them.

## Reporting a vulnerability

Please **do not** open a public issue or pull request.

Report it privately through GitHub:
[Report a vulnerability](https://github.com/koblas/ibankit-js/security/advisories/new)
(Security tab → Advisories → "Report a vulnerability").

Include the affected version, the class or function involved (`IBAN`, `BIC`,
`IBANBuilder`, ...), and an input or steps that reproduce the problem.

You can expect an acknowledgement within a week. Once a fix is released, the
advisory is published with credit to the reporter unless you ask otherwise.

## Scope

In scope, for example:

- Inputs that make validation or parsing hang, recurse without bound or use
  excessive memory (ReDoS or other denial of service).
- Anything that executes code or touches the host environment through the
  library.
- Compromise of the release process: the npm package, GitHub Actions
  workflows or release tags.

Out of scope: an IBAN or BIC being accepted or rejected incorrectly, or a
country's BBAN structure being out of date. That is a bug; please open a normal
issue, ideally with a link to the SWIFT IBAN Registry or the national standard.
