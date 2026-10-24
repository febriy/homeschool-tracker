# Wonder and Worship · Children’s Learning Loop

The Yeo family’s shared children’s homeschool tracker. No sign-in is required; anyone with the link can view and edit it.

## Children’s plan

Daily Bible and worship: Kingdom of God Storybook Bible, Without Doors · Life of Jesus, It Is Well with My Soul, scripture memory and catechism. Existing scripture, catechism and composer playlist links are retained; Without Doors and the hymn have Spotify search links.

Daily foundations: English with Alana’s manual, Mandarin with Sagebooks, and Kate Snow’s Math with Confidence.

Rotating studies: Beauty (Beatrix Potter, George Frideric Handel, Drawing, and Handicraft · My First Piano Adventures Book A), Literature (Literary Ladder), then History/Geography/Natural Philosophy (BiblioPlan · Roman and Student Bible Atlas).

## Learning records

**Record lesson** captures the child, subject, date, lesson/page/skill, outcome (completed, practised or revisit), and optional notes. **Progress** keeps the complete dated history, with filters by child and subject and edit/remove actions. Today shows the most recent record for each subject and selected child. Records can be backdated. The default recording group is **Children together**; use **Add a child** to keep individual histories.

Bible and loop checklists are shared family activities that reset by Singapore date. Family notes can be viewed or written for any past date. The loop selection is shared; language and selected child stay local to each browser.

## Data and preservation

Neon Postgres is connected through Vercel Marketplace. `api/children.js` creates and uses the `children_records` table. The previous parent-oriented plan’s `tracker_records` table and legacy API are retained unchanged. Parent completions are not treated as children’s lesson records.

Browser caches and pending queues use the separate `children-v1` namespace. Unsent edits survive reload and retry when connectivity returns. Open tabs refresh every 30 seconds and on focus. Different records merge independently; the last saved edit wins for the same record. Removed lesson entries are retained as tombstones.

## Development and deployment

Use Node.js 22 or newer. Run `npm ci`, provide `DATABASE_URL`, then `npm run dev` (http://localhost:3000). Without a database the UI reports online saving as unavailable and keeps pending edits locally.

Run `npm test` for curriculum, history, validation and sync recovery checks. `npm run build` copies the frontend into `dist/`. Vercel deploys the Node.js API Functions in Singapore. The GitHub-connected project `homeschool-tracker` deploys pushes to `main`; database credentials remain server-side.


## Skill checklists

The **Skills** tab is separate from lesson history. Select the learner in **Recording for**; persistent checklist state uses `skill:<child-id>:<skill-id>` records and never resets with the daily checklists. Each tick retains its last-change date. English and math items also allow a short observation note. Existing lesson records are preserved.

- English: initial letter sounds, starter sight words, digraphs, trigraphs and six syllable types. The starter word list is not presented as Alana’s exact manual sequence. Add your manual’s words inline; custom words are shared, but checkmarks remain per child. “Syllabus type” is interpreted as “syllable type”.
- Chinese: Level 1 Beginning Reader, 5 books × 20 characters. Book and lesson order were transcribed from the publisher’s [character chart, page 5](https://www.sagebookshk.com/wp-content/uploads/2024/06/2024-ICBCC_EN.pdf). Simplified equivalents are supplied, with an edition-variant note for 甚/什 and 裏/里. Script selection does not duplicate or reset coverage.
- Math: “NICETM” is interpreted as NCTM. Five NCTM content categories plus cross-cutting thinking habits are mapped to [MOE’s NEL 2022 numeracy goals](https://nel.moe.edu.sg/la/numeracy/overview/). Direct matches cover all 18 listed NEL KSD references. Related links and optional extensions are labelled separately. This is a parent-created crosswalk, not an official NCTM–MOE alignment. Every item has a practical observation example. A checkmark records an observation, not formal mastery or a diagnosis.

Sources and the interpretation notes are linked within each subject’s checklist. Search and covered/not-covered filters help find the next teaching target.
