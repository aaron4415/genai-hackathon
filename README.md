# Across

A frontend recruitment prototype connecting Hong Kong and Shenzhen in both directions. All jobs, companies and candidate profiles are fictional.

## Run locally

Requires Node.js 18 or newer. No dependency installation, database, API key or build step is required.

```powershell
cd across
npm run dev
```

Open `http://127.0.0.1:4173`. To check JavaScript syntax, run `npm run check` from the same directory.

On Windows, you can also double-click `Start-Across.cmd` and keep its console open while using the demo.

## Try the demo

- Explore jobs in both cities; search by title, skill or company; filter by discipline and work arrangement.
- Open a role, save it, and try the explicitly simulated application flow.
- Edit the candidate profile and destination-specific work-status questions.
- Switch to the employer workspace and create a browser-local job draft.
- Explore official-source cross-border guidance and the four future AI concepts.
- Switch English, Simplified Chinese and Traditional Chinese for the core discovery interface and job titles. Other screens and longer job descriptions currently use English.

Demo changes use this browser's local storage. Reset demo clears that local activity. Nothing is sent to employers, and no files are uploaded. Do not enter real sensitive information into the demo.

## Deferred features

CV editing / Chinese-to-English JD adaptation, employer marketing generation, multilingual public talent profiles, and an application agent are concept previews only. There are no AI calls, account authentication, real application submissions, document checks, or backend services.

Work-status questions distinguish admission permission from professional certificates. Official sources for IANG, ASMTP, TTPS and Mainland employment guidance are linked in the app; summaries were checked on 17 October 2026. The prototype does not determine eligibility or verify documents.

## Structure

- `across/dist/` — deployable static HTML, CSS, JavaScript and SVG favicon.
- `across/server.mjs` — small local preview server; not a production backend.

Account-specific hosting configuration and local screenshots are excluded from Git.

The Jobsdb reference informed familiar recruitment interactions. Across uses original styling and synthetic content; no vacancies, logos or proprietary assets were copied.
