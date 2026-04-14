# CORVYN Studio — GitHub + Vercel + Sanity

## Local clickable version
Open `index.html` directly in a browser.

## Deploy on Vercel
- Push the whole project to GitHub
- Import the repository into Vercel
- Keep the root directory as project root

## Environment variables for secure contact backend
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_TOKEN`

## Sanity
Add `sanity/schemas/contactSubmission.js` to your schema index.

## Notes
- No favicon has been added.
- The homepage opens from the language screen on click, with an automatic fallback hide.
- The contact form works in local preview mode but only stores submissions once the Vercel API is connected to Sanity.
