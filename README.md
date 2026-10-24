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

- English: separate Capital letters and Small letters tabs, each with independent Name and Sound checkboxes for all 26 letters; separate Red words, Sight words, Digraphs, Trigraphs and Syllable types. The starter word list is not presented as Alana’s exact manual sequence. Add your manual’s words inline; custom words are shared, but checkmarks remain per child. “Syllabus type” is interpreted as “syllable type”.
- Chinese: Level 1 Beginning Reader, 5 books × 20 characters. Book and lesson order were transcribed from the publisher’s [character chart, page 5](https://www.sagebookshk.com/wp-content/uploads/2024/06/2024-ICBCC_EN.pdf). Simplified equivalents are supplied, with an edition-variant note for 甚/什 and 裏/里. Script selection does not duplicate or reset coverage.
- Math: The shared conversation confirms **NCETM** (not NCTM). Its six Early Years areas are mapped to [MOE’s NEL 2022 numeracy goals](https://nel.moe.edu.sg/la/numeracy/overview/). Direct matches cover all 18 listed NEL KSD references. Related links and optional extensions are labelled separately. This is a parent-created crosswalk, not an official NCETM–MOE alignment. Every item has a practical observation example. Observed, Secure independently, Needs practice and This week’s lesson are independent checkboxes. Weekly focus is stored by Monday’s Singapore date, so historical focus weeks remain in the database. Montessori materials and household alternatives accompany each math skill. An observed tick never auto-marks mastery.

Sources and the interpretation notes are linked within each subject’s checklist. Search and covered/not-covered filters help find the next teaching target.


The original [shared conversation](https://chatgpt.com/share/6adc21a4-0750-83ec-8fd5-eb506ec4b3e6) and its linked math reference establish the checkbox structure restored here. [NCETM’s own six areas](https://www.ncetm.org.uk/in-the-classroom/early-years/) are Cardinality and counting, Comparison, Composition, Pattern, Shape and space, and Measures. Existing lowercase-sound and math skill IDs are retained, so saved coverage and notes survive regrouping. The earlier app’s content could not be read without ChatGPT sign-in; no claim is made that the editable starter word lists exactly reproduce Alana’s inaccessible manual.
