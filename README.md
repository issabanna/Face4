# Face4

A sample-first free photo assessment. The visitor sees an example card, clicks **Get yours**, and provides only a name, email, and photo. No style mood or palette questionnaire is required.

## Frontend

Static website in `dist/`; deployment copy is on `gh-pages`.
Website: https://issabanna.github.io/Face4/

The sample card is explicitly labeled as illustrative. A personal card is shown only after the analysis API returns a valid result. While `dist/config.js` has an empty endpoint, submitting explains that analysis is not connected and sends no personal data. Photos preview locally, then are resized to a maximum 1280-pixel edge before submission. The form is for adults using their own photo.

## Vercel deployment

Import this repository’s `main` branch. Keep Root Directory at the repository root (do not set it to `dist`). The tracked `vercel.json` serves `dist` and deploys `api/analyze.js` as a serverless function using the shared handler. Add `OPENAI_API_KEY` as a Production environment variable, then redeploy. The Vercel website automatically calls `/api/analyze`; GitHub Pages stays a frontend-only preview. Optional `ALLOWED_ORIGIN` lets a separate frontend call the API; same-origin Vercel requests work without it.

Production rate limits in the shared handler remain per-instance and reset on cold starts. Set Vercel Firewall rate limits and an OpenAI project budget before opening this endpoint broadly.

## Standalone OpenAI server

Requires Node 22+ and an OpenAI API account with model access and billing.

1. Deploy `server/server.mjs` to a Node hosting service using `npm start` (no dependencies to install).
2. Set `OPENAI_API_KEY` through that host's secret manager. Never add it to GitHub, browser JavaScript, or this chat.
3. Set `ALLOWED_ORIGIN=https://issabanna.github.io`, optionally `OPENAI_MODEL` (default `gpt-4.1-mini`), `DAILY_LIMIT` (default 50), and the host's `PORT`.
4. Configure HTTPS and deployment-level request limits. In-memory limits here are only per-process (5/hour per socket IP and 50/day total). Behind a reverse proxy, socket IP may group users together; use your host's trusted edge rate limits rather than trusting arbitrary forwarded headers. Multiple instances or restarts reset in-memory limits.
5. Set `window.FACE4_ANALYSIS_URL` in `dist/config.js` to the deployed HTTPS URL ending in `/api/analyze`.
6. After a successful live test, remove the two disconnected-service notices from `dist/index.html`. Publish the updated frontend to `gh-pages`.

The server calls OpenAI's Responses API with image input, structured JSON output, and `store:false`. It forwards only the photo to OpenAI, not the name or email. No submissions or reports are saved or logged by this implementation. Email delivery, marketing subscriptions, database retention, and payments are not implemented. OpenAI and hosting-provider retention policies still apply; `store:false` does not guarantee zero provider retention.

The first-impression assessment describes visible photo composition, lighting and styling, with exploratory colors and three tips. It does not infer personality, protected traits, age, health, identity or employment suitability. Invalid photos and provider errors produce messages rather than fabricated results.

## Checks

`npm test` runs server integration tests with mocked OpenAI responses: disconnected service, CORS, invalid input, successful structured output, PII exclusion, unsuitable image, malformed output, and budget limits. `node --check dist/app.js` checks frontend syntax. Live OpenAI and visual browser testing require configured infrastructure and remain outstanding.

## Domain and payments

`face4.org` is the owner's proposed domain; it is not registered or connected by this work. Payments are not enabled. Jordan supports standard PayPal Checkout, subject to merchant eligibility; do not promise card guest checkout for every country. Verify product eligibility and account approval before implementing paid reports.

References:
- https://developers.openai.com/api/reference/resources/responses/methods/create
- https://developers.openai.com/api/docs/guides/your-data
- https://developer.paypal.com/platforms/seller-onboarding
