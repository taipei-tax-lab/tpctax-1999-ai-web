# NEXT_TASK — FAQ 多候選結果呈現

Date: 2026-10-09 (Asia/Taipei)
Status: **IMPLEMENTED / OFFLINE PASS / UI DEPLOYMENT PENDING**

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
- [ ] 更新 committed hosting.zip／hosting.sha256，commit／push implementation。
- [ ] 既有 Actions Pages source guard／test／build／deploy PASS，記 implementation／deployed SHA、run／artifact、package SHA。
- [ ] Hosted 12-file exact byte parity／MIME；6 個 demo/test/tool/internal URL 404。
- [ ] 真實無 mock、TLS verification enabled 的 Pages browser probe；如 Cloud 阻擋記 PENDING，不寫 FAIL／PASS。

Package evidence: production **216,416 bytes**, SHA `8a2937cd4c43b2c8e99a17b0d13a381edec4cc467ca2976bc1a7b00da7baf1b4`;
demo **235,888 bytes**, SHA `a64c8d77e22ce98fedadba27d5d2e6ce8346ab8b24a621702f818f71b3e1400b`。
兩次獨立 rebuild 的兩 ZIP 均 byte-identical；production12／demo19 entries，
manifest／source／CRC／fresh extraction／committed checksum PASS；ZIP9／16
text entries 與14 changed text files secret scan PASS。15 protected files byte
unchanged（config/transport/analytics/HTML/images/workflow/packager/performance/
analytics/backend handoff）。

## D. 新 renderer browser-only confirmation / operational follow-up

- [ ] 在可信任瀏覽器用真正 Messenger 確認原題目連結、完整多筆答案、分隔、Rental link、mobile 與下一題替換。
- [ ] Non-blocking：一般可信任瀏覽器 Realtime／DebugView 可觀察 ai_query_submit；不送 query/answer/source，無新 event。

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
- [ ] 更新 PROJECT_STATE／PAGES_DEPLOYMENT／本 checklist，記錄最終 package／deploy／hosted／browser evidence 與 rollback assessment。
- [ ] Commit／push final report、確認 remote main／clean tree，STOP 等待 Web ChatGPT review。

UI-only rollback：如本輪出現 launch-critical presentation 問題，恢復
`cc233ae` 的 result-model/app/styles（runtime 等同既有 Flow 部署），重新
打包並 Pages redeploy。**保留 faqCurrentPage 與既有 Flow/GA contract**；
不使用舊 Playbook rollback、不碰 Rental/Agent/backend。本輪未觸發 rollback。

## Out-of-scope backlog（承接人工 review）

- [ ] 日後從真實 search misses 改善 FAQ corpus，不在本輪新增 aliases／改 Data Store。
- [ ] 日後 Rental↔1999 保持 guided-link-only，不建立內部 handoff orchestration。

## Completion summary

實作／offline／視覺比較完成；C/E 部署與最終證據待本輪完成後更新。
