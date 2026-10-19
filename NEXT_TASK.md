# NEXT_TASK — 2026-10-19｜FAQ 查無結果提示前端小改版

**狀態：工作分支實作／離線驗證／候選打包完成，待 ChatGPT 審核；未 merge／未部署。**

詳細執行及驗收規格：[`docs/1999_FAQ_ZERO_RESULT_FRONTEND_COPY_PLAN_2026-10-19.md`](docs/1999_FAQ_ZERO_RESULT_FRONTEND_COPY_PLAN_2026-10-19.md)。

- [x] Codex 從前端 main 開獨立分支，精確辨識真正 FAQ zero 的固定兩段文字（非一般零 cards 或 service error），只在前端**顯示層**使用新版文案：「暫時沒有找到符合您需求的 1999 常見問答。請試著補充問題的具體情況，讓我們為您搜尋更相關的官方資訊。」
- [x] 保留出租專區可點擊連結、原文 FAQ／來源、Messenger／GA4／currentPage 等不變，加入正反例與錯誤／逾時測試。
- [x] 執行 `npm test`、可用的離線 browser 測試、打包完整性檢查；提交工作分支後 STOP 交 ChatGPT 審核；**不自行合併 main 或發布 Pages**。
- [x] 後端短關鍵字／NOT_FOUND 研究僅留分支，不修改正式 CX 或 Data Store，不因本輪 UI 文案小改另行觸發研究。

## 2026-10-19 執行證據

- Base：最新 `origin/main` **d8b54de**；分支 `fix/faq-zero-result-copy-2026-10-19`。
- Runtime 僅改 `assets/result-model.js`：完整兩段白名單辨識，無 raw/parsed info（含壞卡）、items、sources、metadata 或 extension answer／矛盾 parsed text 才標記 `isFaqZero`；renderer 才換文案，原始 answer/detail 不變。未知／不完整格式仍保守 fallback。
- `npm test`：**39 PASS**（32 model/config/transport + 7 analytics），0 FAIL。
- `python3 tests/phase7e3a_browser.py --base-url http://127.0.0.1:8765/ --output-dir /workspace/work/faq-zero-copy/browser`：**32 grouped PASS**，0 page errors／外部轉送／Production requests。真正 zero 的 raw、SDK parsed-only、精確可見文案／Rental anchor、1～5 FAQ、一般／未知／多餘文字、安全 DOM、accepted clear／heading／currentPage／GA4、error／timeout／expiry／late-zero／連續替換均通過。
- 1280／390／320px zero screenshots 無水平溢出；已檢視 320px 截圖，文案完整可讀、出租專區可見。截圖為本機合成 fixture，不是 live 驗收。
- `python3 tools/package_static.py --output-dir /workspace/work/faq-zero-copy/build-{one,two}`（各執行一次），hosting/demo 各自 byte-identical；hosting **12 entries**／demo **19 entries**，CRC／manifest SHA／source parity／secret scan PASS。
- `python3 tools/verify_hosting.py packages/hosting.zip --extract /workspace/work/faq-zero-copy/extracted`：PASS；`(cd packages && sha256sum --check hosting.sha256)`：PASS。已同步 committed 候選 hosting ZIP/checksum。
- Hosting：**216,939 bytes**，SHA-256 `e94fb0a96ed1b7b80f3bd72867f987ad6467fe2666327f167d48eea0804584c3`。
- Demo：**237,281 bytes**，SHA-256 `88330b25d6e12b29d3ac7a14983f71bae12956e78e23c7fd3c36865dc712d403`。
- config／app／Messenger transport／analytics／CSS／HTML／mock／Pages workflow／packager／verifier 共 **11 protected files byte-unchanged**。Pages workflow 僅 push main 或人工 dispatch 觸發；本輪只 push 工作分支，未 dispatch。
- 實際變更：result-model、兩個既有測試檔、RESULT_CONTRACT、PROJECT_STATE、本 checklist、packages/hosting.zip、packages/hosting.sha256。
- 本機完整證據：`/workspace/work/faq-zero-copy/`（Node log、browser JSON／screenshots、package checks／兩次建置）。未上傳 Drive，無其他 Repo／CX／Data Store／GCP／官方網站修改，**0 新 Production query**。
- 截圖 SHA-256：1280 `882951cf0d9670c5d8ae7dd96653fb5bfa0a2c09d4cd212f1de413e5fc753e96`；390 `99d87590f87e9f8178f26fd56c3948a64ca403741775314b700bc1095fac5d42`；320 `07ab912ba78f9c9fc9a23fa926911473eee62492d8a2ea4008b6d246c53f03f2`。

下方 2026-10-09 的工作紀錄保留為已完成結果呈現／部署歷史，不代表本輪小改已經執行。

---

# NEXT_TASK — FAQ 多候選結果呈現

Date: 2026-10-09 (Asia/Taipei)
Status: **UI DEPLOYED / HUMAN RENDERER VISUAL CONFIRMATION PENDING**

承接最新 main `cc233ae1e02ec140f71389c298d0914c8822e99a`。
1999 FAQ Flow cutover 已人工接受：
**1999 FAQ SURFACE-DIRECTED FLOW SEARCH LIVE / USABLE**。
本輪只改結果呈現；不重新執行完成的 cutover checklist，不改 CX backend、
Flow、Data Store、Production、Agent、currentPage、Rental 或 GA4 contract。
本輪部署、真實 Messenger 視覺確認與 GA4 receipt 分開記錄。

## A. 來源核對與實作

- [x] 同步 main；依 AGENTS 閱讀 state/task/README/handoff/product/result contract、result-model/app/CSS/demo/mock/tests。
- [x] 唯讀核對既有 Production raw shape 與官方 SDK event shape；不猜欄位、不要求 backend 修改。
- [x] 優先 info-card `title/subtitle/actionLink` → optional `items[{title,answer,url}]`；完整 text 對照避免截短／漏筆。
- [x] 每筆獨立 `ol > li`，題號、原題目 anchor、完整答案；FAQ 之間細線與 16px/20px 上下 padding，無陰影。
- [x] FAQ 原題目作連結文字／對應官方 href；答案末尾來源裸 URL 不另列。
- [x] Intro/outro 保留；Rental guidance 是清單外的「出租專區」連結，不分類或呼叫 Rental。
- [x] Cards 缺少時僅辨識已確認的逐筆 text 訊息邊界；未知／合併格式保留完整 text-first fallback，不按答案內數字拆筆。
- [x] 維持 safe URL、official origin validation、text escaping／DOM nodes、最小 Markdown、安全 source 去重。
- [x] currentPage／SDK defaults、無 currentPlaybook／reset UI、accepted-send input clear、latest replacement、timeout/service/session recovery、GA4 exactly once/query 均維持。

原始證據：backend 封存 ZIP SHA
`6af3f8d25d99edb31dfb43283bbcfa37b709254a515f6286048dc06638838537`；
22 個既有 Production cases 的 raw hash 核對 PASS，0/2/5 筆都與完整 info
欄位一致。SDK 的 df-response-received 保留 raw，parsed 為 customCard /
richElements。新 adapter 對全部 22 cases 完整欄位／筆數 PASS。
本輪 **0 新 Production query／0 backend 或 Rental mutation**。
詳細證據：[FAQ presentation](docs/FAQ_RESULT_PRESENTATION_2026-10-09.md)。

## B. 測試與視覺比較

- [x] Node **37 PASS**：30 model/config/transport + 7 analytics，0 FAIL。
- [x] Offline Chromium **30 grouped PASS**，0 page errors、0 forwarded external／Production requests。
- [x] 1／2／5（另含 3／4）FAQ：獨立 DOM、原題目 anchor／exact href、無來源裸 URL、完整答案、原換行／內部編號不誤切。
- [x] Raw info／SDK parsed customCard／card-only、部分／截短 card、text-only fallback、未知／合併 text、zero-result、unsafe URL／inert HTML。
- [x] Rental link 在清單外，最新 query／1-item／zero/generic result 清除前次 5-item，無 stale metadata 或 CSS state。
- [x] 1280／390／320：16px 字體、pre-wrap、清楚細分隔線、足夠上下空間、無陰影／橫向溢出；保留品牌與紅色視覺。
- [x] 三種寬度的同一公開 Q01 完整回應前後截圖；明確標示 frozen replay，不假稱新 live Messenger。
- [x] currentPage 第一／二／三題 request 與 SDK defaults 完全一致；GA queue 1／2／3、無 business parameters／重複 event。
- [x] 接受前失敗留輸入、接受後才清空／原 query heading／新草稿保留；timeout／session recovery／無 reset regression。

量化前後：同一公開 5-FAQ response，獨立 FAQ container **0→5**、
原題目 anchor **0→5**、末尾裸 FAQ source URL **5→0**、FAQ 間分隔線
**0→4**；每筆原完整 answer／官方 URL **5/5 一致**。
截圖／hash／重現命令見 presentation 文件；本機在
`/workspace/work/faq-items/browser/production-replay-{before,after}-{1280,390,320}.png`。

## C. 打包與部署

- [x] Deterministic production/demo 雙 rebuild、byte cmp、manifest／CRC／source parity、fresh extraction。
- [x] Credential／secret scan：兩 ZIP、所有 changed text，固定 transport/config/GA/workflow/images/performance unchanged。
- [x] 更新 committed hosting.zip／hosting.sha256，commit／push implementation。
- [x] 既有 Actions Pages source guard／test／build／deploy PASS，記 implementation／deployed SHA、run／artifact、package SHA。
- [x] Hosted 12-file exact byte parity／MIME；6 個 demo/test/tool/internal URL 404。
- [x] 已執行真實無 mock、TLS verification enabled Pages browser probe，記錄 Cloud CA blocker；實際 renderer live 確認仍在 D 未勾。

Package evidence: production **216,416 bytes**, SHA `8a2937cd4c43b2c8e99a17b0d13a381edec4cc467ca2976bc1a7b00da7baf1b4`;
demo **235,888 bytes**, SHA `a64c8d77e22ce98fedadba27d5d2e6ce8346ab8b24a621702f818f71b3e1400b`。
兩次獨立 rebuild 的兩 ZIP 均 byte-identical；production12／demo19 entries，
manifest／source／CRC／fresh extraction／committed checksum PASS；ZIP9／16
text entries 與14 changed text files secret scan PASS。15 protected files byte
unchanged（config/transport/analytics/HTML/images/workflow/packager/performance/
analytics/backend handoff）。

Source / implementation / deployed SHA: `87411897eb48ffc21516498f18542206cdd45908`。
[Actions run 37879115932](https://github.com/taipei-tax-lab/tpctax-1999-ai-web/actions/runs/37879115932)
**PASS**；成功時間 **2026-10-09 11:24:38 Asia/Taipei**（03:24:38 UTC），
Production Pages artifact `11593702193`。Pages URL：
<https://taipei-tax-lab.github.io/tpctax-1999-ai-web/>。
ZIP **216,416 bytes**，SHA-256 `8a2937cd4c43b2c8e99a17b0d13a381edec4cc467ca2976bc1a7b00da7baf1b4`。
既有 source guard 證明 Pages build_type=workflow；configure/build/deploy、
CI Node37、deterministic rebuild／committed checksum／manifest／source／
credential scan／fresh extraction PASS。
Hosted HTTPS parity 完成 **11:25:10 Asia/Taipei**：12/12 HTTP200、exact bytes／
正確 MIME，6 個 demo/test/tool/internal exclusions HTTP404；無 reset HTML，
fixed faqCurrentPage／GA4 ID 與封存 config/transport/analytics 相同。

## D. 新 renderer browser-only confirmation / operational follow-up

- [ ] 在可信任瀏覽器用真正 Messenger 確認原題目連結、完整多筆答案、分隔、Rental link、mobile 與下一題替換。
- [ ] Non-blocking：一般可信任瀏覽器 Realtime／DebugView 可觀察 ai_query_submit；不送 query/answer/source，無新 event。

Fresh real Chromium probe：**2026-10-09 11:25:45 Asia/Taipei**，390×844，
沿用 Cloud proxy、TLS verification enabled、無 network mock。Pages document
GET 即遇 `net::ERR_CERT_AUTHORITY_INVALID`，無 origin response／page JS／SDK
執行，**0 Production query／0 observed GA4 collection requests**。
新 renderer browser-only confirmation 保持 **PENDING**，不是 FAIL／PASS；
未繞過 CA／proxy／policy。既有人工作證的 FAQ Flow LIVE acceptance 保留。
GA4 Realtime／DebugView receipt 為 **PENDING / NON-BLOCKING**，不是本輪 UI
deployment gate；沒有新增 event 或改 currentPage／backend／Rental。

以上不重開已人工通過的 Flow cutover。離線 replay 不證明新 live／GA4
receipt；GA4 observation 不阻擋 UI deployment。

Optional evidence storage: Drive ZIP upload was rejected by automatic approval
review because this exact payload/destination lacked explicit authorization and
included currentPage/GA4 identifiers. **Not uploaded / no retry**. Screenshot files
remain local; Git retains hashes, reproduction instructions and durable findings.
This optional archive is not a test/deployment blocker. Prepared ZIP has 11 files,
1,312,910 bytes, SHA `be05834e575963956b3b1145f58d0944dcd7b8699b93c01510a6d1400fbeb7c2`.

## E. 文件、交付與 STOP

- [x] 更新 README／RESULT_CONTRACT／IT_HANDOFF：可靠 items enhancement、完整 text fallback、linked original titles、non-blocking GA receipt。
- [x] 更新 PROJECT_STATE／PAGES_DEPLOYMENT／本 checklist，記錄最終 package／deploy／hosted／browser evidence 與 rollback assessment。
- [x] Commit／push final report、確認 remote main／clean tree，STOP 等待 Web ChatGPT review。

UI-only rollback：如本輪出現 launch-critical presentation 問題，恢復
`cc233ae` 的 result-model/app/styles（runtime 等同既有 Flow 部署），重新
打包並 Pages redeploy。**保留 faqCurrentPage 與既有 Flow/GA contract**；
不使用舊 Playbook rollback、不碰 Rental/Agent/backend。本輪未觸發 rollback。

## Out-of-scope backlog（承接人工 review）

- [ ] 日後從真實 search misses 改善 FAQ corpus，不在本輪新增 aliases／改 Data Store。
- [ ] 日後 Rental↔1999 保持 guided-link-only，不建立內部 handoff orchestration。

## Completion summary

- 結果呈現實作、37 Node／30 offline Chromium、三種寬度前後比較、22 封存回應核對、deterministic package／integrity／secret scan **PASS**。
- Implementation／deployed **87411897eb48ffc21516498f18542206cdd45908**；Actions **37879115932 PASS**、hosted **12/12 exact bytes**，6 exclusions404。
- 人工已接受的 **1999 FAQ FLOW LIVE / USABLE** 延續；本輪 UI **DEPLOYED**，新真實 Messenger 視覺確認 **PENDING**（Cloud CA）；GA4 receipt **NON-BLOCKING PENDING**。
- 截圖本機保留，hash／重現方式入 Git；optional Drive upload遭 automatic review 拒絕，未上傳／未重試。
- Rollback **AVAILABLE / NOT EXECUTED**，無已觀察 launch-critical presentation issue；config/transport/analytics/backend/Rental不變。
- Final report-only commit 不變更 runtime／hosting ZIP／deployed SHA；最終 main HEAD 與 deployed implementation 分開。Commit/push後 **STOP 等待 Web ChatGPT review**。

## 2026-10-19 Completion summary

True-zero 文案最小顯示層修改、39 Node／32 offline Chromium 與 deterministic
候選打包完整性檢查 PASS；正式 FAQ、出租導引、Messenger、GA4 保留。
本輪 commit/push 工作分支後 **STOP 等待 ChatGPT 審核**；未 merge／未部署，
未查詢 Production，未進行任何後端研究或修改其他 Repo。
