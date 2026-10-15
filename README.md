# Ireland · November 2026

A public travel guide built with **Quartz 5, GitHub Pages, Giscus and Hypothesis**. All work belongs in `~/Ireland November 2026`. Do not sync to the older Documents copy.

## What lives where

- `content/`: the **only public Markdown source**, eleven explicitly allowed pages. Edit these files to change the site. Their filenames are stable URLs; ordinary title edits are safe.
- `private/originals/`: the complete original guides, full personal itinerary and WhatsApp contacts. Local only, ignored before Git initialization. Back up privately; Git cannot restore ignored files.
- `site/`: shared reading styles, collaboration script and public integration settings. IDs here are public identifiers, never credentials.
- `scripts/`: build, checks and local preview.
- `quartz/`: MIT-licensed Quartz source; npm dependencies locked in `package-lock.json`.
- `public/`: generated deployment artifact, ignored. Never edit it by hand.
- `AGENTS.md`: local assistant instructions, ignored and excluded from Git and the website.

The public itinerary is a deliberate summary. Flights, hotel identities, room preferences, private cottage location, receipt references and personal contact records remain only in the complete local originals. Public business contact details and research source links remain in the guides. Dates, planned route and selected booking-status distinctions are public; review that disclosure before publishing.

## Edit and preview

Requires Node 22+ (CI uses Node 24) and npm 10.9.2+. From this folder:

```sh
npm ci
npm run build
npm run preview
```

Open http://localhost:8096/ireland-november-26/ . The preview binds only to this laptop. After editing, rebuild then reload. The preview serves only `public/`, never the project root. `npm run build` cleans stale output, applies the settings, builds only `content/`, adds collaboration/canonical links, then checks the complete artifact and search index. `npm run privacy:check` repeats the checks. Source allowlists must be deliberately updated in `scripts/check.mjs` when adding a guide.

Keep research dates, source links, uncertainty and recorded-versus-confirmed booking distinctions. Optional stops are alternatives. A venue's regular hours do not establish opening on our travel date. Never replace public files with an automatic copy of private originals.

## Contribute and publish

Readers need no account. **Edit this guide** opens the Markdown on GitHub. Friends can fork and propose a pull request. Repository collaborators must also use a branch and PR, not commit straight to main. Review content and privacy before merging. The workflow builds PRs but uploads and deploys **only main**, after accepted changes. It does not use `pull_request_target`, secrets or a custom backend.

The owner approved public publication on October 15, 2026. The public repository is `robinsoncptdit/ireland-november-26`; Pages uses GitHub Actions and main requires PRs with passing build checks. Initial website deployment is held until the owner installs Giscus and its connection is verified. The address is https://robinsoncptdit.github.io/ireland-november-26/ . No domain, paid hosting or trial is needed. Public GitHub repositories support free Pages hosting and standard Actions runners.

Set a main-branch ruleset requiring a pull request and the `build` status check. Allow no bypass if practical, and block force pushes/deletion. With two trusted maintainers, require a reviewer other than the author; with a single maintainer, require PRs and checks without an impossible second-person approval. CI prevents PR deployment; branch rules enforce review for repository writers.

Do not publish until Giscus is connected (the release check blocks publication when IDs are missing):

1. Enable **Settings → General → Features → Discussions** on the repository.
2. Use the existing **Announcements** discussion category (already configured).
3. Install the [Giscus GitHub App](https://github.com/apps/giscus) for **only this repository**. This permission step belongs to the account owner.
4. Repository and category IDs have been discovered and saved in `site/settings.json`. On [giscus.app](https://giscus.app), enter the repository to verify that the installation is accepted. Keep the existing specific-term mapping in our script.
5. Rebuild, run `node scripts/release-check.mjs`, preview and test the real Giscus frame. Merge the integration PR only after that connection succeeds, then watch the Pages workflow.

Each guide uses an immutable Giscus term `ireland-2026/<filename-without-md>`, strict matching and reactions. Do not change filenames/terms after discussions exist. If moving a page, preserve the old URL with a redirect and retain its discussion term; update the build implementation deliberately. Hypothesis uses the canonical production URL, so keep URLs stable. Avoid saving test annotations from localhost because the canonical URL points at the future live guide.

## Annotation and navigation

Hypothesis embeds directly; readers need no browser extension. Its sidebar starts collapsed. **Annotate this guide** reloads with `?annotate=1` and the documented `openSidebar` setting, then readers select text. Canonical URLs exclude that query. Default guide visits always start collapsed.

Quartz client-side navigation and hover popovers are deliberately disabled. Every guide navigation gets a fresh Giscus mapping and Hypothesis document, avoiding stale annotations or comments from the previous page. Search and navigation remain enabled. Do not re-enable SPA without implementing and testing Hypothesis unload/reload and Giscus remapping on every navigation.

Giscus and Hypothesis conversations are separate. GitHub sign-in is required to comment/react; Hypothesis sign-in is required to save annotations. Reading needs neither. Public annotations can be visible outside this site. Never paste private details into either service.

## Moderation

Moderate Giscus in the repository's Discussions: edit/hide/delete inappropriate contributions, lock discussions and manage abusive users using GitHub controls. Monitor the category through GitHub notifications.

Hypothesis public annotations belong to its service and their authors, not this repository. Authors can edit/delete their own; report abusive public annotations using Hypothesis's reporting tools. Site maintainers do not automatically have power to delete all public annotations. Agree on a private Hypothesis group if a separate invitation-only conversation is later wanted; that is not the current public default.

## Privacy and maintenance

`.gitignore` is not a publishing boundary. The build reads only the explicit `content/` tree, rejects symlinks/unapproved files and scans generated HTML, scripts and search data. Workflow uploads only `public/`. Before initial commit and every release, inspect the staged file list, run privacy checks and inspect the artifact. The checker scans all reachable Git commits for private paths and known personal markers. It is a guardrail, not a substitute for reading proposed changes. If private material ever enters history, stop publication and remove it from history before any push; ignoring it afterward is insufficient.

`private/`, `AGENTS.md`, dependencies, caches and generated output must stay untracked. The complete source originals remain local. `private/` is not encrypted: rely on laptop security and a private backup. Repository source, README, build code, public identifiers and all accepted guide changes will be publicly inspectable on GitHub.

Update dependencies on a branch, review lockfile changes, build and preview before merging. Initial compatible patches resolved sharp and source-map-js warnings. On October 15, npm still reports the braces ≤3.0.3 recursion advisory through micromatch/fast-glob/globby; 3.0.3 is the latest registry version. This affects the build-time file matcher, not browser runtime. There is no patched compatible release available in that chain at this review. Keep PR builds without secrets or write permissions and recheck with `npm audit` during maintenance.

## Official setup references checked October 15, 2026

- [Quartz installation](https://quartz.jzhao.xyz/getting-started/installation) and [Pages workflow](https://quartz.jzhao.xyz/hosting)
- [GitHub Pages availability and project URLs](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Giscus setup and permissions](https://giscus.app)
- [Hypothesis embed](https://web.hypothes.is/help/embedding-hypothesis-in-websites-and-platforms/) and [configuration](https://h.readthedocs.io/projects/client/en/latest/publishers/config.html)

## Daily guide and proposal workflow

`data/guide-options.json` contains public-safe suggestions, candidate dates and links to topic research. `scripts/build-daily-guide.mjs` builds `content/daily-travel-guide.md` from those options and the existing public itinerary, preserving its baseline text. The normal build regenerates this page first. It uses only public sources, with no dependency on local private files.

The daily guide separates the adopted itinerary summary from unadopted wiki options. Comments and annotations may originate new proposals or revisions; publishing a wiki change does not adopt it into Wanderlog. Preserve attribution and sources when incorporating discussion, and use PRs for public changes. The arts guide records checked details and uncertainty; advertised tickets are not bookings.

The complete local planning workflow, decisions, research snapshots and full guide are preserved under ignored `private/trip-guide/`. They are local-only and are not included in this repository or deployment. Deliberately refresh private snapshots when the authoritative plan changes; do not automatically synchronize the older Documents workspace. Public changes remain deliberate edits to public sources.
