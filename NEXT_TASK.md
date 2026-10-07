# NEXT_TASK

## Active task

**Final placement-only UI refinement**

Do not deploy live. Do not redesign the page.

## Human decision

The current UI-freeze candidate is accepted except for one layout detail.

Inside the query area, the exact visual order must be:

1. label: `您想了解什麼？`
2. textarea
3. clickable example sentence:
   `您可詢問 「房屋稅自住住家用稅率怎麼申請？」 「地價稅自用住宅用地優惠稅率怎麼申請？」`
4. yellow `查詢解答` button

The example sentence is input assistance and must appear between the textarea and the primary submit button.

## Preserve exactly

Keep the existing:

- example copy;
- click-to-fill/focus behavior;
- official-red emphasis on `您可詢問`;
- official yellow submit button colors/styles;
- H1 red accent;
- result red heading;
- official TRS logo/background/font/content width;
- placeholder text;
- `清除前次問答，重新提問` behavior and gating;
- ready-state idle-panel hiding;
- unavailable/loading/empty/error/session handling.

Do not change any wording unless required by markup movement.

## Implementation scope

This should be the smallest possible HTML/CSS adjustment.

If the current markup structure makes placement awkward, reorganize only the query-form markup needed to achieve the required order.

Do not alter Messenger/session/result semantics.

## Verification

1. Run existing Node tests.
2. Run existing offline Chromium suite.
3. Confirm at desktop, 390px and 320px:
   - textarea appears above examples;
   - examples appear above submit button;
   - example buttons still populate/focus textarea;
   - yellow submit remains the primary action;
   - no overflow/accessibility regression.
4. Regenerate review screenshots.
5. Update `PROJECT_STATE.md` and `NEXT_TASK.md`.
6. Commit/push and STOP for Web ChatGPT review.

## Functional freeze

Do not change:

- Dialogflow Messenger transport;
- one-shot `currentPlaybook`;
- session/reset/expiry/timeout semantics;
- normalized result model;
- answer/source/FAQ extraction/rendering;
- CX/GCP/Messenger integration;
- Production Environment;
- `assets/config.js` `liveEnabled=false`.

No Production query or deployment is authorized.
