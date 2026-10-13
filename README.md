# Lingua Cards MVP (iPhone-first PWA)

A local-first multilingual flashcard MVP. It is a web app/PWA, not a signed native iOS app. It can be opened on iPhone Safari after being hosted on HTTPS, then added to the Home Screen.

## Included
- Flashcards and decks
- Local IndexedDB storage
- Four self-rating buttons (Again / Hard / Good / Easy)
- Lightweight adaptive review scheduler
- Speech synthesis using the browser/iOS voices
- CSV/TSV import (Excel/Numbers: export as CSV UTF-8 first)
- JSON backup and restore
- Service worker cache for app assets; FSRS module is loaded from esm.sh

## SRS implementation
- Uses the official `ts-fsrs@5.4.2` package via an ES module from `esm.sh`.
- Scheduler settings: request retention 0.90, fuzz enabled.
- The package is fetched from a CDN, so the app needs internet on first load (and may need internet again if the module is not cached by the browser/service worker). Test offline behavior after first successful load.
- This MVP does not optimize FSRS parameters from your review history; it uses the package defaults. It stores the scheduler card state with each flashcard and records review logs.

## How to use with only an iPhone
1. Put the contents of this folder on a static HTTPS host. A practical phone-only path is to create a GitHub repository in Safari and upload `index.html`, `manifest.webmanifest`, and `sw.js` using GitHub's web interface. `sample-cards.csv` is optional.
2. In the repository settings, enable GitHub Pages for the main branch/root. Wait until the HTTPS site is published.
3. Open the published URL in Safari on the iPhone.
4. Tap Share -> Add to Home Screen -> Add.
5. Open it from the Home Screen. Import `sample-cards.csv` or your own CSV.
6. Export a JSON backup regularly.

GitHub's UI can change. If uploading multiple files on iPhone is difficult, use a static hosting service with a browser-based upload flow.

## CSV format
Required headers: `front,back`. Optional: `deck,example,language,tags`.
Header names are case-insensitive. Supported aliases include `question/term/word`, `answer/meaning/definition/translation`, `notes/reading/furigana`, and `lang/language_code`.
For Excel `.xlsx`, open in Excel or Numbers and export the sheet to CSV UTF-8. Direct `.xlsx` parsing is not included.

## Known limitations
- No direct `.apkg` Anki import in this MVP.
- No official FSRS implementation yet (see limitation above).
- No image/audio file attachments on cards yet.
- Data is local to the browser profile/site. Clearing website data can erase it; export backups.
- The PWA must be hosted over HTTPS to install reliably and enable the service worker. FSRS is imported from esm.sh, so first load requires internet.
- The web app is not currently a native `.ipa` and does not use Apple's native app signing.

## Card reveal behavior
- Tap “Show answer” or tap the card area to reveal the answer. The question side is hidden while the answer is shown. Tap “Show question” or tap the card to return to the prompt.


## CSV sample fix
The Download sample CSV button and bundled sample CSV have been fixed to use real line breaks. If already published on GitHub Pages, replace `index.html`, `sw.js`, and `sample-cards.csv`, then reload while online so the service worker refreshes.
