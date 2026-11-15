# NEAR Hackathon — remaining tasks

**Deadline:** **2026-11-14 · 23:59 UTC**  
**Submit:** [nearhackathon.com/#apply](https://nearhackathon.com/#apply) · **Rules:** [HACKATHON.md](https://nearhackathon.com/HACKATHON.md)  
**Entry repo:** `https://github.com/discernible-io/rodit-sdk` · Track: `nfts` (+ recommend `security`, `agents`)

| Tag | Meaning |
| --- | --- |
| **Repo** | GitHub |
| **Website** | Live site |
| **Document** | Draft / notes |
| **X** | Public X post (human) |
| **Form** | Contest form / API |

---

## Blocking (do in order)

### 1. Demo + X post

| Done | ID | Task | Where |
| :---: | --- | --- | --- |
| [ ] | F1 | Record demo: Passport → native login → protected call → federated remint | **Document** / media |
| [ ] | H | Cover judge path: on-chain Passport; native JWT; protected route; federated peer JWT | (same as F1) |
| [ ] | F2 | Draft X text: problem → one moment → NEAR role → repo + demo links | **Document** |
| [ ] | F3 | Publish public X post: NEAR HACKATHON, `@NEARProtocol`, `#NEARHackathon`, video and/or screenshots | **X** |
| [ ] | F5 | Copy post URL as `demoUrl` | **X** → **Form** |

### 2. Form fields + submit once

| Done | ID | Task | Where |
| :---: | --- | --- | --- |
| [ ] | A1 | Project name (2–80 chars) | **Form** |
| [ ] | A2 | Lead name, email, team size (`1` \| `2 - 4` \| `4 - 6` \| `6 - 8` \| `8+`) | **Form** |
| [ ] | A3 | NEAR payout address (mainnet) | **Form** |
| [ ] | A4 | `projectUrl` = `https://github.com/discernible-io/rodit-sdk` | **Form** |
| [ ] | A5 | Tracks: at least `nfts`; recommend `security`, `agents` | **Form** |
| [ ] | A6 | Idea text (20–2000): NFT → native → federated → on-chain ownership; Last Cradle supporting only | **Document** → **Form** |
| [ ] | A7 | Consent: organizers may use details to review and contact about this hackathon | **Form** |
| [ ] | A8 | One `requestId` UUID (keep for retries; do not commit PII) | **Document** |
| [ ] | G1 | Validate payload (no `website` spam-trap field) | **Form** |
| [ ] | G2 | Print JSON; human confirms before POST | **Document** |
| [ ] | G3 | Submit once at [#apply](https://nearhackathon.com/#apply) or `POST /api/applications` **after** F3 | **Form** |
| [ ] | G4 | On `201`, stop — do not resubmit same repo | **Form** |
| [ ] | G5 | Mistakes → [request-changes](https://nearhackathon.com/request-changes) only | **Form** |
| [ ] | C6 | Do not submit a second repo for the same product | **Form** |

---

## Optional

| Done | ID | Task | Where |
| :---: | --- | --- | --- |
| [ ] | E4 | Hero URL stack for X: discernible → purchase → api.identyclaw.com → federated peer; lastcradle secondary | **Document** |
| [ ] | F4 | Also tag `@NearLegion` / `@NearBuilders` | **X** |

---

## Quick links

| | |
| --- | --- |
| Apply | https://nearhackathon.com/#apply |
| Entry | https://github.com/discernible-io/rodit-sdk |
| Mint | https://purchase.identyclaw.com |
| Product | https://www.discernible.io |
| Home API | https://api.identyclaw.com |
| Peer API | https://api.lastcradle.io |
