# 1999 AI 靜態 hosting package

目前 live candidate 使用 `liveEnabled=true`，尚未完成 Pages Production E2E；
交付放行狀態、阻擋與證據以 [NEXT_TASK.md](../NEXT_TASK.md) 為準。

## 本機預覽

`python3 -m http.server 8765 --bind 127.0.0.1`，開啟
`http://127.0.0.1:8765/demo.html`。demo 使用隔離 mock，不載入 Google SDK。
`index.html` 使用 live 設定，請勿把它當作 offline demo；離線 tests 會攔截 SDK。

## Production package

`python3 tools/package_static.py --output-dir <directory>` 產生 hosting 與 demo
兩份 ZIP。正式只用 hosting.zip；保留 index.html、八個 assets 檔、
docs/IT_HANDOFF.md、MANIFEST.json（共 11 檔）。沒有 npm/runtime server 相依性。
HTTPS、JavaScript MIME、資料夾結構及目錄結尾斜線必須正確。

確認 origin 為 `https://services.arpa.tpctax.dof.gov.taipei`；final path 由資訊室
決定，任一 agreed HTTPS directory path 均可，不需 rebuild。hostingUrl 是未使用
metadata。資訊室實際操作及掛載回覆清單見 [IT_HANDOFF.md](IT_HANDOFF.md)。

GitHub Pages 需改為 Actions source，使用 `.github/workflows/pages.yml`；
流程驗證 committed ZIP 與重建 ZIP 相同，再上傳解壓後 11 檔，不發布全 repo。
現有 main/root Jekyll 發布需先遷移；候選版在獨立分支等待 review。

Production binding 與兩個允許 hostname 已 PASS；不需更改 Console/CX。
實際 SDK/subresources/connect/CSP/CORS/session/reset 仍須 live browser 驗證。
不要加入猜測 wildcard／iframe／全面 inline 允許。Agency-host headers 需另查
final URL，不能由 root 或 Pages 推定。

詳細契約見 [RESULT_CONTRACT.md](RESULT_CONTRACT.md)。不自動 retry；timeout
後仍維持原有等待 SDK operation 結束語義。官方入口在 live 驗證前維持未新增。
