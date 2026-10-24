# Wonder and Worship · My Learning Loop

A shared homeschool loop tracker for the Yeo family. Progress, custom studies and notes are stored in Neon Postgres through a Vercel Function. No sign-in is required: anyone with the site link can read and edit the same tracker. Language and the selected loop stay specific to each browser.

## Development

Use Node.js 22 or newer. Run `npm ci`, configure `DATABASE_URL` in your local environment, and run `npm run dev`. The app opens at http://localhost:3000. Without a database, the UI still works locally and clearly reports that online saving is unavailable.

Run `npm test` for validation and sync recovery tests, and `npm run build` to generate the static frontend in `dist/`.

## Deployment

The GitHub repository is connected to the Vercel project `homeschool-tracker`. Pushes to `main` deploy production. Neon is connected through Vercel Marketplace with `DATABASE_URL` injected into production and preview. Vercel serves `dist/` and deploys `api/progress.js` as a Node.js Function in Singapore. The first API request creates the `tracker_records` table.

## Saving and existing progress

The first browser initializes an empty shared database. Later browsers load shared data without overwriting it with stale local progress. Existing browser data is backed up locally and can be imported with **Import device progress**. Import adds completed items and missing notes without clearing shared completions or replacing existing notes.

Saves are batched after editing, with a visible saving/saved/error status. Unsent changes are retained locally and retried when connectivity returns, including after reload. Open tabs refresh shared changes every 30 seconds and when focused. Changes to different studies or notes merge independently; simultaneous edits to the same study or note use the last saved value. Study removal is stored as a tombstone so it survives reloads. Daily checklists use Singapore dates, and past journal entries remain in the database.

Database credentials remain on the server. The API validates record keys, values, sizes and link protocols. This is intentionally a public shared tracker, not a private multi-user system.
