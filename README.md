# Ireland · November 2026

A shared Ireland travel wiki built with Quartz, GitHub Pages, Giscus and Hypothesis. Wanderlog holds the adopted itinerary; the wiki holds unadopted options and fallbacks. Discussion can introduce or revise an option without adopting it into the trip.

**[Open the website](https://robinsoncptdit.github.io/ireland-november-26/) · [User HOWTO](HOWTO.md) · [Guide workflow](Guide%20Workflow.md) · [Website HOWTO source](content/howto.md)**

The site is live and its Giscus connection is configured. Newly added pages and edits in a local branch become live only after review, merge and successful deployment.

## Which document should I read?

| You want to… | Read |
|---|---|
| Browse, comment, annotate or learn useful chat requests | [How to use this guide](content/howto.md) |
| Use the project in chat, handle a queue or run optional terminal commands | [HOWTO.md](HOWTO.md) |
| Understand research roles, reviews, decisions and the publication path | [Guide Workflow.md](Guide%20Workflow.md) |
| Build, preview, maintain or troubleshoot the site | This README |

## Project layout and sources

Work in `~/Ireland November 2026`. The older Documents project is a legacy prototype, not an automatically synchronized copy.

| Location | Purpose | Public? |
|---|---|---|
| `content/` | Sole public Markdown source; explicit page allowlist | Yes |
| `data/guide-options.json` | Curated dated suggestions and research links for the daily guide | Yes, in repository |
| `scripts/` | Generation, queueing, checks and preview | Yes, in repository |
| `site/` | Reading styles and public discussion/annotation settings | Yes |
| `quartz/` | Quartz source, with dependencies locked | Yes |
| `HOWTO.md`, `Guide Workflow.md`, `README.md` | User/process/maintenance documentation | Yes, in repository; not site pages |
| `private/originals/` | Complete original sources and personal planning records | No; ignored/local-only |
| `private/trip-guide/` | Full local guide workflow, decision records and research snapshots | No; ignored/local-only |
| `private/publish-trip-guide/` | Project-local publishing skill and validation notes | No; ignored/local-only |
| `AGENTS.md` | Local routing and assistant instructions | No; ignored/local-only |
| `public/` | Generated deployment artifact | Deployed, not tracked; never edit directly |

Public guide filenames, URLs and Giscus terms remain stable. The public itinerary deliberately excludes personal transport/accommodation records, private location details, contacts and receipts. Research retains dates, sources and uncertainty. A regular-hours listing is not confirmed opening on our travel date.

## Everyday editing and publishing

Use chat for ordinary work:

- **“Write this finding to the public cheap-eats guide and queue it.”** Approves that public edit and local staging.
- **“Show the queue.”** Reports local and publication status.
- **“Commit and push the batch.”** Saves and uploads the approved batch and opens/updates its PR, without merging.
- **“Publish the batch.”** Requests the checked PR/merge/Pages sequence, including verification of affected live pages.

Private notes stay private. An unapproved finding or comment does not authorize publication. No automatic filesystem watcher or deploy-on-save is installed. See the [HOWTO](HOWTO.md) for the complete command vocabulary and troubleshooting.

The daily guide is generated from `content/itinerary.md` and `data/guide-options.json`. It does not extract new entries or factual changes from prose automatically. Update the relevant mapping when adding or revising a curated suggestion. Never overwrite the public guide with the complete private guide.

## Optional terminal workflow

Requires Node 22+ and npm 10.9.2+; CI uses Node 24. From the active repository:

```sh
npm ci
npm run guide:test
npm run build
npm run preview
```

Preview at [localhost:8096](http://localhost:8096/ireland-november-26/). Build again and reload after changes. The server binds only to this laptop and serves `public/`, not the project root. Preview is not publication; use production URLs for real comments/annotations.

From an editorial branch, stage named approved topic changes with:

```sh
npm run guide:stage -- content/cheap-eats.md
npm run guide:status
npm run guide:commit -- --message "Update food alternatives"
```

Include `data/guide-options.json` explicitly when it changes. Reviewed same-file additions can use `--reviewed-restage`; this still runs the same checks. The content-only helper excludes root documentation, code and configuration. Maintenance batches use an explicitly reviewed Git commit with equivalent tests/privacy/build checks, preserving unrelated work.

`npm run build` regenerates the daily guide, checks public sources plus the actual index and available Git history, builds Quartz, adds collaboration/canonical links, scans output/search data and checks local links. `npm run privacy:check` rechecks the existing artifact and Git sources/history. Quick queue checks defer the full artifact/history scan until commit/publication, so small queued edits do not rebuild the entire site.

## GitHub review and deployment

The public repository is [robinsoncptdit/ireland-november-26](https://github.com/robinsoncptdit/ireland-november-26). Use branches and PRs; protected main requires the build check. Do not bypass required reviews or force-push over work.

The workflow tests/builds PRs without deploying them. Accepted main changes trigger a production build, discussion-configuration check and Pages deployment. Publishing must distinguish **committed**, **pushed**, **merged** and **deployed**. A successful PR build alone is not a live update. Verify the exact current head before merging and the intended main deployment afterward.

Keep PR builds without secrets or write permissions. The workflow uploads only `public/`; it does not use `pull_request_target`. The publishing skill reuses the matching open PR and avoids repeating a successful unchanged full local build solely to push it.

## Discussion and annotation configuration

`site/settings.json` contains public repository/category identifiers; no credentials belong there. Giscus is connected to GitHub Discussions in **Announcements**, using immutable specific terms `ireland-2026/<page-filename>`, strict mapping and reactions. If the connection breaks, verify Discussions, the category and the Giscus app installation for this repository, then run `node scripts/release-check.mjs` and test the production widget.

Hypothesis is embedded with its sidebar initially collapsed. **Annotate this guide** reloads with `?annotate=1` and opens the sidebar; canonical URLs exclude that query. Real annotations should use production page identity. Giscus and Hypothesis remain separate accounts/conversations.

Quartz SPA navigation and hover popovers remain disabled so each page loads fresh discussion mappings and annotation identity. Do not re-enable them without testing both integrations through navigation. If moving a guide, preserve old URLs with redirects and retain its discussion term.

GitHub maintainers can moderate Giscus through repository Discussions. Hypothesis annotations are managed through that service: authors can manage their own annotations, and inappropriate public annotations can be reported. Site ownership does not automatically grant deletion rights over everyone else's annotations.

## Privacy and maintenance

Only allowlisted `content/` pages enter the site build. `.gitignore` alone is not a publishing boundary. Adding a public page requires deliberately updating `scripts/check.mjs`; add its queue path in `scripts/guide-queue.mjs` and fixture coverage if it should be editable through the content helper. Check navigation, search, local links, discussion mappings and the generated artifact.

Before pushing, inspect the staged file list and actual diff, complete the applicable reviews, and run required checks. The checker scans public sources, the real index, reachable Git history, output and search data for prohibited paths and known private markers. It is a guardrail, not a substitute for reading proposed changes. Never include internal agent instructions, contact records or full private planning files in Git or public content.

Back up ignored planning files privately; Git cannot restore them. If private material enters Git history, stop publication and remove it from history before any push. Do not merely ignore it afterward.

Update dependencies on a branch, inspect lockfile changes, run the tests/build and check `npm audit` during maintenance. Dependency security status changes over time; do not treat a dated advisory note as current verification.

## Reference documentation

The implementation is grounded in [Quartz setup](https://quartz.jzhao.xyz/getting-started/installation), [Quartz hosting](https://quartz.jzhao.xyz/hosting), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Giscus](https://giscus.app), and [Hypothesis embedding](https://web.hypothes.is/help/embedding-hypothesis-in-websites-and-platforms/). For ordinary use, follow the project HOWTO and the implemented controls rather than repeating the original installation steps.
