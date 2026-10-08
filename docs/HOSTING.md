# 1999 AI 靜態 hosting package

目前 live candidate 使用 `liveEnabled=true`；人工作證已確認 Pages 問答、
renderer／Rental parity 與 session/reset PASS。本版最小 GA4 實際網路收送
仍 PENDING；交付放行狀態、阻擋與證據以 [NEXT_TASK.md](../NEXT_TASK.md) 為準。

## 本機預覽

`python3 -m http.server 8765 --bind 127.0.0.1`，開啟
`http://127.0.0.1:8765/demo.html`。demo 使用隔離 mock，不載入 Google SDK 或 GA4。
`index.html` 使用 live 設定，請勿把它當作 offline demo；離線 tests 會攔截 SDK。

## Production package

`python3 tools/package_static.py --output-dir <directory>` 產生 hosting 與 demo
兩份 ZIP。正式只用 hosting.zip；保留 index.html、九個 assets 檔（含
analytics.js）、docs/IT_HANDOFF.md、MANIFEST.json（共 12 檔）。沒有 npm/runtime server 相依性。
HTTPS、JavaScript MIME、資料夾結構及目錄結尾斜線必須正確。

確認 origin 為 `https://services.arpa.tpctax.dof.gov.taipei`；final path 由資訊室
決定，任一 agreed HTTPS directory path 均可，不需 rebuild。hostingUrl 是未使用
metadata。資訊室實際操作及掛載回覆清單見 [IT_HANDOFF.md](IT_HANDOFF.md)。

GitHub Pages 已驗證為 Actions source，使用 `.github/workflows/pages.yml`；
流程驗證 committed ZIP 與重建 ZIP 相同，再上傳解壓後 12 檔，不發布全 repo。
原 main/root Jekyll 發布已遷移；候選版已 fast-forward 至 main 並部署。
實際 Actions run、deployed SHA、ZIP hash、線上檔案比對及 E2E blocker
見 [PAGES_DEPLOYMENT.md](PAGES_DEPLOYMENT.md)。

Production binding 與兩個允許 hostname 已 PASS；不需更改 Console/CX。
session/reset 已有人工作證 PASS；SDK/subresources/connect/CSP/CORS 與新增
GA4 hosts 仍須實際 browser network 證據，精確已知 bootstrap URL 見 IT handoff。
不要加入猜測 wildcard／iframe／全面 inline 允許。Agency-host headers 需另查
final URL，不能由 root 或 Pages 推定。

詳細契約見 [RESULT_CONTRACT.md](RESULT_CONTRACT.md)。不自動 retry；timeout
後仍維持原有等待 SDK operation 結束語義。官方入口在 live 驗證前維持未新增。
