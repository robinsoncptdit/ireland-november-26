# HOWTO: use the Ireland guide from reading to publication

Start with [How to use this guide](content/howto.md). It covers the Quartz website, Giscus discussion, Hypothesis annotations, direct edits, chat examples and the stages of publication.

The production site is [Ireland · November 2026](https://robinsoncptdit.github.io/ireland-november-26/). The new HOWTO will appear there after this batch is published. For the system's process and ownership, see [Guide Workflow.md](Guide%20Workflow.md). For development and file locations, see [README.md](README.md).

## A five-minute start

1. Read the itinerary, then the daily guide and its Research links.
2. Use Giscus for general discussion and Hypothesis for notes on selected text. They are separate conversations and require separate accounts to contribute.
3. Open a chat in the active **Ireland November 2026** project. Ask for research or bring a discussion link into the chat.
4. When a finding is ready, say: **“Write this to the public food guide and queue it as a maybe.”** Approval of a researcher's specific public edit works the same way.
5. Say **“Show the queue”**, then **“Publish the batch”** when ready to make those public changes live.

You do not need to know terminal commands for ordinary use. Chat requests are interpreted by the project workflow; they are not commands typed into the website.

## Useful requests to copy

- “Find three indoor alternatives near our planned Athlone stops. Propose them first.”
- “Write this to the public cheap-eats guide and add it to the daily guide on suitable dates. Queue the changes.”
- “Yes, add the researcher's two proposed food entries to the wiki. Keep them unadopted.”
- “Record this privately; do not put it in the public guides.”
- “Read this Giscus discussion and this Hypothesis annotation, preserve attribution, and propose a revision.”
- “Reconcile the latest weekly events report with the current plan. New events remain suggestions.”
- “I updated Wanderlog. Refresh its private snapshot and deliberately update the public summary, preserving decisions and privacy.”
- “Show what is staged, committed, pushed, merged and deployed.”
- “Commit the batch locally.”
- “Commit and push the batch, but don't merge it.”
- “Publish the approved batch and verify the changed pages.”

A request to publish does not authorize changing Wanderlog, making bookings or contacting anyone. Say explicitly when you want those separate actions. A request that is only for research, discussion or a private note does not approve a public edit.

## Where to open the project

The active project folder is `~/Ireland November 2026`. Its public sources live in `content/`. The older `~/Documents/ChatGPT/Ireland November 2026` folder is a legacy prototype; its local instructions route public work to the active project. There is no automatic synchronization between them.

The complete planning sources and decision records remain under ignored `private/`. They are not uploaded by a commit/push of the public repository. Back them up privately; Git cannot recover ignored files. Ask for a deliberate public-safe projection when a private discovery should also become a wiki option.

The two daily guides are different: the full local planning copy is private; the published daily guide uses only the public itinerary summary and approved public suggestion mappings. Never replace the latter with the private copy.

## What happens when you approve a guide edit

The editor writes the public-safe source, updates dated suggestions when appropriate, regenerates the daily guide and queues the approved files. If a source edit changes an already curated suggestion, its summary and dates must be reconciled too; regeneration alone does not reread the research prose. The two review passes apply to substantive guide changes. Quick queue checks avoid rebuilding the entire site for each small addition.

Another approved change to an already staged file can join the same batch after the editor reviews the combined diff. Unrelated changes and selected hunks are preserved. If something cannot be staged safely, the editor reports the specific conflict instead of discarding work.

Researcher findings and website comments need an approved edit before they enter the public queue. Comments are not automatically monitored. Bring links or quotes into chat if the relevant discussion cannot be retrieved.

## Optional terminal commands

Run these from the active repository on an editorial branch. An agent can create the branch when the tracked tree is clean; do not switch branches over pending work.

| Task | Command |
|---|---|
| See staged and unstaged tracked files | `npm run guide:status` |
| Queue a specific food guide | `npm run guide:stage -- content/cheap-eats.md` |
| Queue research plus its dated mapping | `npm run guide:stage -- content/cheap-eats.md data/guide-options.json` |
| Queue a reviewed combined edit to an already staged file | `npm run guide:stage -- --reviewed-restage content/cheap-eats.md` |
| Commit a content-only batch | `npm run guide:commit -- --message "Update food alternatives"` |
| Run the focused guide/publisher tests | `npm run guide:test` |
| Build the site and check privacy and links | `npm run build` |
| Recheck an existing build and Git privacy | `npm run privacy:check` |
| Preview the built site locally | `npm run preview` |

Preview at [the local guide](http://localhost:8096/ireland-november-26/) after building; rebuilding and reloading are required to see later changes. Previewing is not deployment. Use the production site for real comments and annotations, since the embed uses production page identity.

The content queue helper intentionally excludes README, this HOWTO, Guide Workflow, scripts and configuration. A documentation/maintenance batch uses an explicitly reviewed Git commit with equivalent checks. If those files are staged with topic edits, ask the editor to handle the mixed batch; do not unstage or delete someone else's work to force the content-only helper to pass.

`guide:status` reports staged and unstaged tracked changes, not every untracked file. The editor also checks ordinary Git status before committing. The queue commands neither push nor deploy. Use the chat publishing workflow for the checked PR/merge/Pages sequence rather than bypassing protected main.

## If the workflow stops

| Message or situation | What to do |
|---|---|
| A file has both staged and unstaged edits | Ask the editor to review the whole combined diff. Use reviewed-restage only after both portions are known to be approved. |
| Other public inputs have unreviewed changes | Review and explicitly include the intended files; leave unrelated work intact. |
| The generated daily guide has direct edits | Preserve them for review and move intended wording into its topic source or dated mapping. Do not simply overwrite the page. |
| Another publishing operation holds the lock | Let that operation finish. Ask the editor to check its owner if it appears abandoned. |
| Privacy check fails | Keep the content local, remove or deliberately redact the private material, and recheck before any push. |
| PR checks or required reviews are pending | The batch is not live. Wait for the matching commit's checks or satisfy the stated review requirement. |
| Deployment fails after merge | Ask for the failure and actual live status. A merge alone is not evidence that the new page is online. |

For detailed architecture and a worked food example, continue to [Guide Workflow.md](Guide%20Workflow.md).
