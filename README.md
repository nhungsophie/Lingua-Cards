# Lingua Cards (local-first PWA)

A local-first flashcard PWA for iPhone Safari and desktop browsers. There is no app account, database server, or cloud sync. Decks, cards, review history, and optimized FSRS settings live in the browser's IndexedDB.

## Included
- Decks, cards, and CSV/TSV import (duplicate card fronts in the same deck are skipped)
- Four FSRS review ratings: Again / Hard / Good / Easy
- Official `ts-fsrs@5.4.2` scheduling with a 90% desired retention and short learning steps (`1m`, `10m`; relearning `10m`)
- **Optimize FSRS parameters** button using the official `fsrs-browser@6.6.0` WebAssembly optimizer
- Local IndexedDB persistence, JSON backup/restore, speech synthesis, and service-worker caching

## FSRS optimization

1. Use the app for a while and record a few hundred reviews. A card needs to be reviewed repeatedly for its history to be informative.
2. Open the **FSRS** tab and choose **Optimize FSRS parameters**.
3. The optimizer uses the stored per-card rating history and computes a personalized 21-value FSRS-6 parameter set in the browser.
4. The parameters are stored locally in IndexedDB and used for future scheduling. Optimizing deliberately **does not immediately reschedule existing due dates**, so it does not unexpectedly flood your queue. Cards use the new parameters when you rate them next.
5. Choose **Use default parameters** to revert. This does not delete reviews or cards.

The app waits for at least 200 ratings and repeated reviews across at least 10 cards before enabling optimization. This threshold is a practical guard, not a guarantee that the result is statistically reliable; more diverse history generally gives the optimizer more information. Anki's manual similarly cautions that optimization on only a few hundred reviews may not be reliable and says monthly optimization is usually sufficient.

### Browser requirements and privacy

- The regular scheduler and study data remain local. Optimization is performed locally by WebAssembly; **review records are not sent to the optimizer CDN or to a server**.
- The optimizer module is fetched from jsDelivr on first use, so Internet access is required to download that code and its WASM asset. After download, whether optimization works offline depends on browser caching.
- The optimizer uses WebAssembly threads. On GitHub Pages, the service worker adds the Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers needed by supported browsers and reloads once when the updated worker takes control. If the FSRS tab reports that cross-origin isolation is unavailable, close/reopen the app or reload after the service-worker update. Some browser/PWA configurations may not support this path; this must be confirmed on the actual target device.
- I have checked JavaScript syntax, but have not run the optimizer on a real iPhone/Safari session. Treat the first optimization run as a test and export a JSON backup beforehand.

## Hosting

Host all files in this folder on HTTPS, for example GitHub Pages. Keep `index.html`, `sw.js`, `manifest.webmanifest`, and `sample-cards.csv` together in the deployed folder. After updating an existing deployment, open it online and reload once so the new service worker installs.

## CSV format

Required headers: `front,back`. Optional: `deck,example,language,tags`. Export Excel/Numbers sheets as CSV UTF-8. Existing cards are not overwritten by a duplicate import, so their review progress is retained.

## Backup

Use **Export JSON backup** regularly. Version 2 backups include decks, cards, review logs, and personalized FSRS settings. Older version 1 backups can still be restored, but they do not contain optimized settings.

## Important limitation

Browser-local data can be lost if Safari site data is cleared or the browser evicts storage. Keep a backup outside the app. This app does not sync review history across devices.
