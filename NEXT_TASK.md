# NEXT_TASK

## Active task

**Final UI-freeze candidate: simplify citizen interaction and strengthen official red accents**

Do not deploy live. Preserve the high-fidelity official-site foundation.

## Human decision

Implement the following final citizen-facing refinements.

### Remove redundant intro

Remove:

`用自己的話描述問題，從官方資訊中尋找解答。`

The page title and query UI are sufficient.

### Move and rewrite example questions

Remove the current:

`試著詢問 / 印花稅稅率 / 租賃住宅稅務`

Replace it with one simple line **above the query form**:

`您可詢問` + two clickable quoted example questions.

Use:

- `房屋稅自住住家用稅率怎麼申請？`
- `地價稅自用住宅用地優惠稅率怎麼申請？`

Suggested visual form:

`您可詢問 「房屋稅自住住家用稅率怎麼申請？」 「地價稅自用住宅用地優惠稅率怎麼申請？」`

The quoted questions should remain clickable and populate the textarea.

### Placeholder

Use:

`例如：房屋稅自住住家用稅率如何申請？`

### Reset/session control

Remove the current explanatory row:

`可接著詢問；開始新查詢會重設查詢脈絡。`

Do not show any reset control before the first successful answer.

After a successful answer, show one secondary action with the exact label:

`清除前次問答，重新提問`

Behavior:

- execute the existing real session reset;
- re-arm the first-turn 1999 Playbook behavior exactly as today;
- clear the input;
- return focus to the textarea;
- do not merely clear visible content while keeping the same session.

### Normal ready state

Do not show the normal idle/status panel when the service is ready.

The normal ready page should be:

- official header;
- return link;
- page title;
- `您可詢問 ...`;
- query form;
- submit button.

Status UI should appear only when needed for:

- loading;
- unavailable/live-disabled;
- empty answer;
- error;
- reset/session feedback if necessary.

Do not remove unavailable/error/loading handling.

### Red identity

Red is still judged slightly too weak.

Increase official-red presence modestly using only verified official colors:

- `#d4222d`
- `#de313c`

Approved places:

1. retain/enhance the H1 red accent;
2. make `您可詢問` visibly red or use an official-red marker;
3. add a restrained red accent/top rule to the query section if it improves continuity;
4. keep existing red result heading;
5. keep red hover states;
6. keep footer red separator.

Do not:

- recolor the global header;
- recolor the TRS logo;
- recolor the yellow submit button;
- make all borders red;
- create large red surfaces;
- add gradients/banners.

### Preserve

Keep unchanged unless strictly required for this UI behavior:

- official TRS header image;
- official page background;
- official font stack;
- official content width/density;
- official yellow query button;
- result/source visual structure.

## Functional freeze

Do not change:

- Dialogflow Messenger transport;
- one-shot `currentPlaybook`;
- session/reset/expiry/timeout semantics;
- normalized result model;
- answer/source/FAQ extraction/rendering;
- CX/GCP/Messenger integration settings;
- Production Environment;
- `assets/config.js` `liveEnabled=false`.

The only allowed JavaScript behavior change is the minimum UI state wiring needed to:
- hide idle status in ready state;
- reveal the reset action only after a successful answer;
- keep the existing reset behavior intact.

## Verification

1. Run existing Node tests.
2. Run existing offline Chromium suite.
3. Add/update focused tests for:
   - no idle status panel in ready state;
   - examples appear above the form and populate the textarea;
   - reset action absent before first answer;
   - exact reset label after successful answer;
   - reset still starts a true new session/re-arms first-turn behavior;
   - no regression to loading/error/unavailable states.
4. Generate desktop, 390px and 320px screenshots.
5. Confirm no overflow/accessibility regression.
6. Update `PROJECT_STATE.md` and `NEXT_TASK.md`.
7. Commit/push and STOP for Web ChatGPT review.

No Production questions or deployment are authorized.
