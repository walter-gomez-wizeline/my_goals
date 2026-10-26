# Architecture vote for the client demo — v0.8

Date: 2026-10-26. Status: approach selected through the user-requested three-agent decision. This records engineering judgment, not an empirical benchmark or authorization to purchase/deploy.

## Decision context

The user clarified priorities: develop an MVP very quickly; initially use it as a portfolio/sample/demo to attract clients. The primary agent requested independent votes from architect, developer and qa before disclosing their choices to one another. Each reviewed the existing cloud options under its project role instructions. No code or infrastructure was changed by the voters.

## Ballots

| Agent | Vote | Reason | Main qualification |
| --- | --- | --- | --- |
| architect | A — Next.js/TypeScript, Vercel, Supabase PostgreSQL/Auth | Least initial infrastructure/identity integration work while retaining a general journal domain and SQL transactions | Two-provider dependence; keep domain and stable internal account IDs separate from provider adapters |
| developer | A | One repository for responsive UI and authenticated server use cases; more time for a polished, complete demo flow | Deliberate transactions, pooling, private caches and sessions remain necessary; defer a generic indicator builder |
| qa | A | Fewer integrations to qualify; focus verification on journal behavior, persistence, ownership and cross-device access | Managed services do not prove isolation, retry correctness, recovery or session revocation |

Tally: A = 3, B (Render) = 0, C (AWS) = 0. All voters identified no blocker to approach selection. Budget, plan purchase, region, sign-in details and recovery qualification remain open gates.

## Selected approach

- One TypeScript/Next.js application with responsive UI and server use cases.
- Vercel as the intended application host.
- Supabase managed PostgreSQL and Supabase Auth.
- Managed identity plus revocable server-side application sessions as already proposed; exact session/sign-in contract remains to specify.
- Server-authorized operations, explicit database transactions, bounded connection pooling and version-controlled migrations.
- Journal and collections first; optional goal/tracking extensions remain on the roadmap.

No ORM, driver, framework version, region, email provider or public-registration policy is selected by this vote. Resolve these in the next specification step without introducing unnecessary alternatives.

## Demo scope and evidence

First end-to-end slice: sign in → open Today without a goal → capture task/event/note → create collection and link the original → complete or intentionally migrate a task → revisit persisted data from another device. Monthly/future views and reflection complete the core method delivery; the first slice does not silently remove their existing requirements.

Use synthetic demonstration content. Visitor access design is proposed for a later spec: isolated demo accounts or controlled invitation rather than a shared writable journal with private data. Do not add public registration or automated reset jobs without defining their behavior.

Before client demonstration, verify account isolation, persistence after refresh, no duplicate retry, recoverable version conflict, truthful save failures, per-session sign-out, private cache cleanup, English copy and mobile/desktop behavior. Before calling the service production-ready, qualify RNF-07 with the documented restore drill, including identity reconciliation and session invalidation.

## Commercial hosting and costs

Because the stated purpose is client acquisition, plan the hosted demo on Vercel Pro rather than assuming Hobby eligibility. Vercel restricts Hobby to personal noncommercial use. [Vercel plan documentation](https://vercel.com/docs/plans/hobby).

Intended cost illustration: one Vercel Pro seat ($20/month starting price) plus base Supabase Pro ($25/month), totaling $45/month before usage, taxes, domain, email, extra environments and add-ons. Pro plans are an intended hosting configuration, not a budget commitment or an activated subscription. Supabase Pro is the proposed baseline for the existing seven-day daily-backup objective; it does not itself prove RTO compliance. Sources checked 2026-10-26: [Vercel pricing](https://vercel.com/pricing), [Supabase pricing](https://supabase.com/pricing).

## Next specification step

Define the first slice's screens and acceptance mapping; select sign-in method and demo-account strategy; specify session lifecycle and minimum physical schema/transaction contracts. Then derive implementation tasks. The user has delegated the approach decision; purchases and deployment remain outside this action.

No software tests, cloud benchmarks, or restore drills were executed as part of the vote.


Scope refinement, v0.12: the [first internal implementation slice](13-first-flow-spec.md) covers completion/reopening and collection membership; intentional planning migration follows with Monthly/Future/Review. The complete-core demo commitment above remains in force. Access/lifecycle decisions are now in ADR-006.
