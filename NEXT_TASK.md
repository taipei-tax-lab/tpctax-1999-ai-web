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
