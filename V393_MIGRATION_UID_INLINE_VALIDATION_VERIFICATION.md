# V393 Migration UID Inline Validation Verification

Base artifact: EZPK-v392.zip
Base SHA-256: c70a803a686078bc8ad9bf5dca4918d05153e8403be2f213fe520d62b5acdac2

## Scope
- Migration Step 1 application Game UID field
- Migration Step 1 Application Status Game UID field
- No modal / centered popup added
- Existing duplicate-UID API and DB guard preserved unchanged

## Confirmed behavior
- UID inputs accept digits only; non-digit characters are removed on input/paste.
- Paste remains supported.
- Values longer than 16 digits are not silently truncated to 16 digits.
- More than 16 digits immediately shows an inline error directly below the affected UID input.
- Korean over-length message: `UID는 16자리 숫자만 입력할 수 있습니다.`
- Fewer than 16 digits shows the existing exact-16-digits inline validation when Next / Check Status is invoked.
- Exactly 16 digits proceeds to the existing duplicate/application-status checks.
- Existing duplicate message remains: `이미 신청이 접수된 UID입니다. 신청 현황 조회에서 현재 상태를 확인해 주세요.`
- Status lookup operational results (not found, rate limit, server error, found status) remain separate from format-validation inline errors.

## Static validation
- migration/migration.js syntax: PASS
- worker.js syntax: PASS
- v392 existing paths removed: 0
- Changed existing paths before this verification file: 2
  - migration/migration.js
  - migration/migration.css
- DB migrations changed: 0
