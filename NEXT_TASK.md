# NEXT_TASK

## Active task

**Review conservative visual draft and finish official-site reference/logo alignment**

Do not deploy live. The functional V1 architecture remains accepted.

## Completed draft

On 2026-10-07, the page was simplified: agency-name text replaces the invented
green badge, the title and spacing are smaller, cards have ordinary borders
without shadows, links are underlined, and controls retain accessible sizes.
10 Node tests and 9 existing offline Chromium checks passed. See
`PROJECT_STATE.md` for evidence, artifact locations and validation limitations.

This is a **provisional visual draft**, not completed official-site alignment:
the cloud proxy blocked the official reference page with `CONNECT 403`, so
official colors/font values and the logo asset could not be verified.

## Required next work

1. Have Web ChatGPT review the desktop/mobile screenshots and offline demo.
2. Save the drafted `tpctax.gov.taipei` network rule in environment settings
   (or supply the official reference screenshot/CSS/logo files). Retry the
   exact official FAQ URL after access changes:
   `https://tpctax.gov.taipei/News.aspx?n=BB8B93F0A49EAB80&sms=87415A8B9CE81B16`.
3. Inspect the actual official page's palette, typography and agency identity;
   adjust the provisional styles as needed. Do not copy unrelated navigation
   or footer content.
4. If a suitable official logo can be obtained, save it locally without
   altering its design, record its exact source and include it in both
   hosting/demo packages. Keep a meaningful accessible brand name.
5. Rerun affected offline checks, generate new review screenshots/packages,
   update state, commit/push and STOP for Web ChatGPT review.

## Guardrails

Only visual markup/styles and supporting branding/package documentation may
change. Preserve Messenger transport, one-shot `currentPlaybook`, session/reset/
expiry logic, normalized result contract, answer/source/FAQ renderer and
`assets/config.js` with `liveEnabled=false`.

Do not send Production questions, deploy, or modify CX/GCP/Messenger integration,
Production Environment or the official site. The draft and synthetic browser
fixtures establish no live SDK/Production behavior.
