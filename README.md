# Across

A Hong Kong ↔ Shenzhen recruitment prototype with candidate-reviewed CV editing and multilingual profile sharing. All built-in jobs, companies and candidate examples are fictional.

## Run locally

Use Node.js 22 or newer. No dependency installation or build step is required.

```powershell
cd across
node server.mjs
```

Open `http://127.0.0.1:4173`. `npm run dev` is equivalent when npm is available. On Windows, `Start-Across.cmd` also starts the preview. Keep the server running while using it.

```powershell
npm run check
npm test
```

Without npm, run `node --test tests/career.test.mjs` from `across/`. The server listens on loopback only. Public hosting and authentication are separate deployment work.

## CV studio

Open **AI workspace → Open CV studio**, or use the sidebar.

1. Paste a CV, import a `.txt` file, or describe education, work, projects and skills in everyday language, one fact per line. For PDF/Word documents, paste their text. Choose English, Simplified Chinese or Traditional Chinese as the source language.
2. Review and categorize each fact. Each approval covers all wording entered for that fact. Facts begin unapproved; editing them removes approval. The bilingual example is fictional.
3. Add a company, role and JD, or choose a fictional sample JD. Choose **Tailor** or **Translate only**, then the output language.
4. Create a review draft. Review the source references and questions about missing requirements. Final candidate approval is required before downloading text or using **Print / Save PDF**. Keep up to 12 separate company/language versions and delete individual old versions when needed.

**Local mode** organizes the exact approved wording already supplied in the selected language; it does not invent translations or perform semantic tailoring. The bilingual example lets you try this flow without credentials. **AI mode** rewrites supported experience for the JD or translates between Chinese and English. Translation-only mode must preserve every approved fact. The server checks source IDs and rejects newly introduced numeric claims. These checks do not prove semantic correctness: the candidate must review every statement and translation. Missing evidence is a review question, never a new qualification. Changing source facts invalidates old draft approvals.

## Enable AI tailoring and translation

Copy `across/.env.example` to `across/.env`, set `OPENAI_API_KEY` there, and restart the server. Node.js 22 loads this optional file. `OPENAI_MODEL` defaults to `gpt-5.4-mini` and can be changed to an available model supporting structured outputs. A key can also be supplied as a server environment variable. Never place credentials in `dist/`, a share URL or Git.

The implementation calls the OpenAI Responses API with strict structured output and `store: false`. No live model calls are made until the candidate explicitly consents in the app. CV calls send only the approved facts, company, role, JD and output language; they do not send the original pasted CV, default email or private work-status answers. Profile translation sends only the approved source headline and introduction. Provider retention rules still apply; `store: false` is not a promise of zero provider retention. See [structured output documentation](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).

A missing key, provider error, refusal or timeout is shown explicitly. There is no fake AI fallback after a failed request. The local editor remains usable. Tests mock provider responses; live translation quality needs verification with a configured key.

The local API validates origin and host, caps request bodies, limits concurrent calls and rate limits requests. Do not expose a key-backed endpoint publicly without authentication, user quotas and a deployment review. `APP_ORIGIN` is an exact allowed reverse-proxy origin, not an authentication mechanism.

## Multilingual talent profile

Open **AI workspace → Create my share profile**, or **Share my profile** in the sidebar.

- Write a display name, headline and introduction in English, Simplified Chinese and/or Traditional Chinese. Edit manually or use AI to draft all three language versions from an approved source. Each language needs its own candidate approval.
- Choose whether city, skills and a contact method are public. Contact is excluded by default. The editor never automatically copies a CV, default email, source facts or work-authorisation answers into the share link. Candidates should review free text for anything they do not want public.
- Review the exact public snapshot, approve sharing, then create a link. Recipients see a standalone profile and can switch between approved language versions. They can use the included contact method to discuss the role and request a CV; there is no built-in messaging inbox.

The link is a self-contained snapshot in the URL fragment. The recipient does not need the candidate's browser storage or an account. The snapshot is not encrypted or identity-verified: anyone with the link can decode, edit or copy it. New editor changes need a new link; an old link cannot be revoked or updated. Viewer expiry (7/30/90 days) does not delete copied text. The profile data is not stored in a server database.

A `127.0.0.1`/`localhost` link works only on that computer. Share links work across devices when the static app is deployed to a reachable host; pushing to GitHub alone does not deploy it. Long snapshot links are intended for direct sharing; shortened URLs, QR codes and revocable hosted profile pages are future work.

## Existing demos

Explore/search/filter jobs, save opportunities, edit the candidate profile and create browser-local employer job drafts. Employer marketing uses editable templates for six channels in three languages. The application assistant follows a scripted simulation on a local form. No marketing content is published and no job application is sent to an employer. The core discovery interface, CV studio and Share my profile editors follow the app's English, Simplified Chinese or Traditional Chinese interface selector. CV output, source facts and profile versions keep their independent content-language choices; changing the interface never translates or modifies candidate text. Some longer job descriptions and existing employer demos remain English.

Demo and career workspaces use separate keys in this browser's local storage. **Reset demo** clears both; exported CVs and copies of snapshot links remain outside that reset. Use fictional data when demonstrating on a shared computer.

Work-status questions distinguish admission permission from professional certificates. Official sources for IANG, ASMTP, TTPS and Mainland employment guidance are linked in the app; summaries were checked on 17 October 2026. The prototype does not determine eligibility or verify documents.

## Structure

- `across/dist/`: static app and deployable share-profile viewer.
- `across/dist/career-ui.js`: candidate fact review, draft review/export and profile editor.
- `across/dist/career-i18n.js`: interface translations and localized validation messages for the career editors.
- `across/dist/career-core.js`: shared validation, local drafting and snapshot serialization.
- `across/career-ai.mjs`: structured CV tailoring/translation and profile translation.
- `across/server.mjs`: local preview and validated AI endpoints.
- `across/tests/career.test.mjs`: approval, evidence, provider contract, privacy and HTTP tests.

Account-specific hosting configuration, credentials and local artifacts are excluded from Git. The Jobsdb reference informed familiar recruitment interactions; Across uses original styling and synthetic content.

## Screenshot demo cases

Use **Load CV demo case** in CV studio for fictional Alex Chen, a product designer applying to Forma Studio. It loads five facts with prewritten English/Simplified/Traditional Chinese wording and fills the company, role and JD. The selected interface language becomes the initial source/output language. All facts start unapproved: review them, create a local draft, and approve the final version to show the export controls. No AI key is needed; this uses exact approved wording, not a live AI translation.

Use **Load profile demo case** in Share my profile for the matching introduction in three languages. Review each version you want to share, keep contact excluded unless deliberately selected, then review the public snapshot and approve its creation. The profile example includes a fictional 18% onboarding result from an internal test, matching the CV facts. Example contacts use example.com.

Both loaders ask before replacing existing input. Saved CV versions are retained but invalidated for renewed review when the facts change. For clean screenshots without altering your personal workspace, use a separate browser origin/profile. The feature interiors use Across green; the AI workspace cards retain their distinct navigation accents.
