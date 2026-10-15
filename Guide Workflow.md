# Guide workflow: from a maybe to a published amendment

For everyday steps and chat requests, start with [HOWTO.md](HOWTO.md) or the [website HOWTO](content/howto.md). This document explains the process behind them. [README.md](README.md) covers setup and maintenance.

## The authority model

**Wanderlog is the Constitution.** It defines the adopted where, when and what. The local private snapshot preserves its recorded status and uncertainties. The public itinerary is a deliberate summary, not a competing source of truth.

**The wiki holds unadopted amendments.** Research supplies useful alternatives for weather, closures, energy and spare time. A good discovery is not a reason for the editor to rearrange the trip.

**Giscus and Hypothesis are the debating floor.** Participants can propose a new amendment, revise an existing one, correct a fact or raise an objection. Discussion can lead to reviewed wiki edits. It does not directly edit Markdown or adopt a change into Wanderlog.

Interest, approval of a wiki proposal, booking evidence, approval to publish and adoption into Wanderlog are distinct. A chosen change absent from the authoritative plan remains pending Wanderlog. If a fresh import no longer supports an earlier adoption record, keep the discrepancy visible and reconcile it; do not let the ledger overrule the import.

## The research and review team

| Role | Work |
|---|---|
| Orchestrator / editor | Coordinates the task, preserves decisions and attribution, integrates source changes and prepares the batch. |
| Food and drink researcher | Meals, cafés, bakeries, takeaways, pubs and inexpensive choices. |
| Local activities researcher | Walks, museums, town experiences and miscellaneous alternatives. |
| Farms and rural industries researcher | Growers, working producers, husbandry, horticulture and productive businesses. |
| Folklore and ancient sites researcher | Documented traditions, trees, caves, tombs, stones and archaeological landscapes. |
| Ruins and abbeys researcher | Substantial quiet ruins, abbeys, castles, access and approach constraints. |
| Horse riding researcher | Suitable guided rides, rider assessment and practical waiting/access questions. |
| Independent makers researcher | Maker-run shops, studios, workshops, books, craft and producer markets. |
| Art, culture and music researcher | Exhibitions, theatre, poetry, film, traditional and experimental music, concerts and festivals; reconciles weekly event reports. |
| Schedule and route reviewer | Checks practical fit and conflicts before final guide assembly, without changing Wanderlog's anchors. |
| Independent guide reviewer | Checks the finished output against sources, decisions, optional status and links. |

These are on-demand roles during project work, not permanent background services. Researchers reassess saved/Wanderlog options and discover beyond the inventory. They report evidence and uncertainty; the editor integrates shared files. Substantive guide changes receive both review passes. Formatting-only changes need appropriate focused checks, not fresh trip research.

## Which files do what?

| Source | Role |
|---|---|
| Wanderlog and the local private snapshot | Authoritative adopted plan and its dated local reference. |
| `content/itinerary.md` | Deliberate public summary, preserving uncertainty and excluding private details. |
| Public topic Markdown in `content/` | Detailed evidence and broad inventories of optional ideas. |
| `data/guide-options.json` | Curated public-safe summaries, stable identifiers, candidate dates and links to research headings. |
| `content/daily-travel-guide.md` | Generated reading copy: public current-plan summary plus dated wiki maybes. |
| Private decisions and research records | Attributed interests, approvals, exclusions, booking evidence and unresolved questions. |
| Giscus / Hypothesis | Discussion input; separate services and conversations. |
| Local staged queue | Approved public edits waiting to be committed/published. |
| A branch and pull request | Proposed repository changes; not a live deployment. |
| GitHub Pages output | The website produced after accepted changes merge and deploy successfully. |

The active project is `~/Ireland November 2026`. Full planning records and the earlier complete workflow are retained under ignored `private/`. The older Documents project is not automatically synchronized. Internal agent instructions remain local; this document describes the system for its users.

## One food discovery, all the way through

1. In chat, ask for a few inexpensive food alternatives near a planned stop. The researcher checks sources and date/route fit, including uncertainties.
2. Decide: **“Write this to the public cheap-eats guide and queue it. Keep it a maybe.”** That authorizes the public edit and local staging, without another staging confirmation.
3. The editor updates the topic evidence. If it belongs beneath a day, the editor also adds or revises the dated summary in `data/guide-options.json` using the same stable place identifier.
4. The daily guide is regenerated, and affected schedule/output reviews run. Existing Wanderlog text remains intact. Quick validation checks the explicit public files, sources and actual staged contents.
5. The approved change enters the local queue. More approved edits can join across project chats. No deploy occurs on each save.
6. **“Commit and push the batch”** saves the checked changes and creates or updates the matching PR. It does not authorize merge.
7. **“Publish the batch”** authorizes the remaining checked publication sequence: commit/push if needed, required checks for the exact PR head, merge and Pages verification. Repository-required reviews still apply.
8. Read the updated public page after deployment succeeds. The food entry remains an unadopted option until deliberately reflected in Wanderlog.

The default for an unspecified daily-guide mapping is editorial selection, not automatic inclusion of every topic entry. The generator does not extract new suggestions from prose. Changing an existing entry also requires reconciling any already-curated summary so it does not retain stale hours, prices or constraints.

## Discussion can create or revise an amendment

When a discussion is considered in a relevant chat task, preserve its author, date, link, target guide and passage/context. A correction is a claim to verify. An objection is not a rejection by everyone, and reactions are not consent to publish.

A revision should retain the original place/proposal identity and earlier rationale where useful. An actual new option or separately dated event can receive a new identifier. Private traveler decisions stay in the private record. Other readers cannot approve on a traveler's behalf.

Ask: **“Review this thread and propose revised wording,”** or **“Apply this specific public correction and queue it.”** The second authorizes the stated edit. Neither requests posting a reply or resolving the external discussion. Comments must be retrieved during the task or supplied as links/quotes; automatic monitoring is not installed.

## Weekly events and Wanderlog refreshes

The existing weekly events checker supplies leads, not an automatic file update. During a relevant refresh the arts researcher reads an accessible report, or uses a supplied copy, then checks event year/date, venue, timing, route fit and official evidence. An older report's itinerary assumptions must not override the current plan. New events, cancellations and programme changes can produce proposed wiki revisions.

When Wanderlog changes, refresh its private snapshot and deliberately update the public summary with privacy review. Reconcile affected dates, optional mappings, decisions and evidence. Rebuild the guide and complete the appropriate reviews. Never publish the complete private snapshot by copying it over the public itinerary.

The private prototype uses source fingerprints to flag changed research awaiting review. The public builder validates mapped dates and source headings, but it does not automatically detect every stale prose summary or reverify external facts. Editorial reconciliation remains necessary.

## Fast queue, full publication

Approved public writes trigger the local queue workflow. Quick staging checks regenerate the public daily guide, run focused tests, scan public sources/mappings and inspect the actual Git index. Only named public inputs and the generated page are staged. Unknown same-file hunks, other unreviewed inputs and unrelated staged work are preserved for review.

A content commit runs one complete site build: source/index/history privacy validation, generation, artifact/search privacy checks and local links. Output is checked independently without rescanning all history a second time. A successful unchanged build is not repeated merely to push the same batch.

The editor uses a branch/PR, checks the current remote head and required checks, and reports local commit, push, merge and successful deployment separately. Internal skills and private planning files are never included. Maintenance changes such as these documentation files use a reviewed maintenance commit; the content-only helper does not stage them automatically.

No filesystem watcher, deploy-on-save, automatic comment ingestion or automatic transfer from the weekly checker is installed. The trigger is an authorized project-chat action; publication follows the existing GitHub main/Pages workflow.
