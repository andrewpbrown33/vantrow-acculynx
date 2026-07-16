# Trademark & Collision Screens — Raw Evidence Record

**Screen date: 2026-07-15** (all lookups below were executed on this date unless a line notes otherwise)
**Scope:** 18 naming candidates for the Vantrow roofing-SaaS subsidiary
**Companion memo:** `docs/brand/naming-decision-memo.md`

> ## ⚠️ These are first-pass automated screens, NOT legal clearance
>
> Domain checks used registry RDAP (Verisign for .com; rdap.org / registry RDAP for .io) cross-checked against Google DNS-over-HTTPS. Collision checks used web search. Trademark checks could **not** query USPTO TESS directly — tmsearch.uspto.gov is a JS-only application that rendered no data, its API rejected POSTs (405/MethodNotAllowed), and aggregators (trademarks.justia.com, uspto.report, trademarkelite.com) frequently blocked access (403/404) — so most trademark findings rest on web-search indexing of those aggregators, a **non-authoritative method that misses recent, pending, state, and common-law filings**. Direct TSDR status pages were fetched where a serial number was known. A professional clearance search per `docs/runbooks/05-legal-counsel-checklist.md` is required before adopting any name.
>
> Recurring known issue: rdap.org returns 404 for some **registered** .io domains (bootstrap coverage gap). Every .io "available" verdict below was cross-checked against DNS NS records; where DNS showed live delegation, the domain was recorded as REGISTERED regardless of the RDAP 404.

---

## 1. Vantra (vantrow-play) — ELEVATED

**Domain checks**
- `curl -s -o /dev/null -w "%{http_code}" https://rdap.verisign.com/com/v1/domain/vantra.com` → 200 (exit 0) = REGISTERED
- `curl -s "https://dns.google/resolve?name=vantra.com&type=NS"` → Status:0, 6 NS records (ultradns.com/.org/.biz/.net) = registered, corporate DNS
- `curl -s -o /dev/null -w "%{http_code}" -m 15 https://vantra.com` → 000 (exit 56) = registered but dormant/unreachable over HTTPS
- `curl -s -o /dev/null -w "%{http_code}" https://rdap.org/domain/vantra.io` → 404 — **misleading**; DNS shows ns1/ns2.vercel-dns.com and https://vantra.io serves a 307 to a live site (Pokémon graded-card e-commerce, UK, confirmed via WebFetch) = .io REGISTERED
- getvantra.com → Verisign RDAP 200 = REGISTERED; vantrahq.com → Verisign RDAP 200 = REGISTERED. All fallbacks taken.

**Collision findings (WebSearch)**
- Active software companies on the exact name: Vantra Software (vantrasoftware.com, AI productivity); Vantra (vantrawork.com, project-management/workflow SaaS); Vantra AI (vantraai.com, cybersecurity/automation, DR); Vantra (vantra.app, AI workflow agents); Vantra Digital (vantradigital.com, Buenos Aires).
- Construction-adjacent: Vantra Building Services (vantraservices.com, VA janitorial/post-construction cleaning).
- Others: vantra.vc (VC firm); legacy Vantra Group (acquired by ADP 2002); vantra.io (collectibles marketplace); vantra-official.com (car safety hardware). Similar-sounding roofers: Vantage Roofing & Construction, Vantis Roofing & Construction.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov via WebFetch → JS search shell only, no results. Authoritative TESS query not possible.
- Fallback WebSearch ('"Vantra" trademark USPTO') → no live VANTRA registration surfaced; nearest: VANTARE Reg #2094982 (Coach LLC, vehicles), VANTA app #97830784 (Vanta Inc. — note: well-known SaaS security brand one letter away).
- Limitation: non-authoritative; with 4+ active Vantra software companies, pending class 9/42 applications are plausible.
- AccuLynx similarity: LOW (no overlap in sound, appearance, meaning).

---

## 2. Vanward (vantrow-play) — ELEVATED

**Domain checks**
- vanward.com → Verisign RDAP 200 = REGISTERED; DNS NS ns1–ns4.35.net (Chinese registrar 35.com)
- vanward.io → rdap.org 404 BUT DNS NS ns1/ns2.siteground.net = REGISTERED (bootstrap gap; site empty/parked per WebFetch)
- getvanward.com → Verisign RDAP 404 = AVAILABLE; vanwardhq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- Guangdong Vanward New Electric Co., Ltd. (SZSE 002543) — water-heater/gas-appliance maker, ~$1.06B TTM revenue (PitchBook 164619-19), owns vanward.com.
- Vanward Technologies Inc. — Virginia, AI/digital solutions (ZoomInfo 53575834) — software collision.
- Vanward Information Technologies LLP — Bangalore, custom software/SaaS dev — software collision.
- Vanward Ent. (movingvanward.com) — energy. No exact-name roofing/construction firm (nearest: unrelated Vanguard Roofing).
- Dictionary note: "vanward" is a real English adverb (Merriam-Webster; OED).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell, no data; direct API POST → MethodNotAllowed; Justia 403; TrademarkElite 404.
- Site-restricted WebSearch (trademarks.justia.com) → no exact VANWARD mark indexed; nearest: VANWARE (SN 77227922, Meggitt), VANTRUE (Reg 5458561), VANER (Reg 6338281), VANGUARD (Reg 3205376).
- Limitation: web-index absence is not proof of no filing — Guangdong Vanward plausibly holds US class 11 marks not surfaced here.
- AccuLynx similarity: none (VAN-werd vs AK-yoo-links; no shared sound/appearance/meaning).

---

## 3. Vantero (vantrow-play) — ELEVATED

**Domain checks**
- vantero.com → Verisign RDAP 200 = REGISTERED; NS ns17/ns18.worldnic.com; A 66.96.161.165 (NetSol shared hosting); direct HTTPS timeout (exit 000), www → bare 301 = parked/inactive
- vantero.io → rdap.org 404 + DNS NXDOMAIN (Status:3) = AVAILABLE
- getvantero.com → Verisign RDAP 404 + NXDOMAIN = AVAILABLE; vanterohq.com → Verisign RDAP 404 + NXDOMAIN = AVAILABLE

**Collision findings (WebSearch)**
- Vantero (vantero.ai) — active restaurant-knowledge SaaS with iOS app (App Store id 6504098341).
- vantero.co Instagram ("Growth & AI" agency); Vantreo Insurance Brokerage (near spelling); Vantor (Maxar rebrand, phonetically close). No Vantero in roofing/construction/field-services software.

**Trademark screen — method, findings, limitations**
- **Direct TSDR hit:** WebFetch https://tsdr.uspto.gov/statusview/sn98610310 → mark VANTERO, serial 98610310, owner Sapere Technology LLC (FL), filed 2024-06-20, **LIVE/APPLICATION/Under Examination**, Class 009 ("downloadable mobile applications featuring training and instruction to hospitality industry workers"), 2nd SOU extension approved 2026-06-12. This is the vantero.ai product.
- tmsearch.uspto.gov → JS shell, no data; uspto.report → 403. Screen relied on TSDR for the known serial plus web search; other pending/state filings could exist.
- AccuLynx similarity: none.

---

## 4. Trowen (vantrow-play) — MEDIUM

**Domain checks**
- trowen.com → Verisign RDAP 200 = REGISTERED (full RDAP: registered 2009-01-12, expires 2027-01-12, registrar GoDaddy IANA 146, NS11/NS12.DOMAINCONTROL.COM)
- trowen.com A record → SOA only, no Answer; www.trowen.com → NXDOMAIN = web-dormant; WebFetch https://www.trowen.com/ → ENOTFOUND
- trowen.io → rdap.org 404 + DNS NXDOMAIN = AVAILABLE
- gettrowen.com → Verisign RDAP 404 = AVAILABLE; trowenhq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- Trowen International (trowen.com) — exporter of copper tube and welding/cutting equipment serving AC, refrigeration, construction, petrochemical, automotive, electronics; web presence dormant.
- Trowen Communications (trowencomm.com) — small CA internet-marketing agency.
- Non-commercial: esports handle, musician, Middle English word ("trow" = to believe).
- No Trowen roofing, construction-contractor, or SaaS company; construction searches returned only phonetic near-misses (Troy, Troon, Trow).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell, no data; Justia/uspto.report → 403 on direct fetch.
- WebSearch of Justia/Trademarkia/uspto.report indexes → no exact "Trowen" US mark; nearest: TROVENET (75868554), TRUVEN (97739801), TROWE.NET (99567483) — none identical, none in roofing SaaS.
- Limitation: based on web-search indexing, not a direct TESS/TSDR query — not comprehensive.
- AccuLynx similarity: low (TROH-wen vs AK-yoo-links; no shared phonemes, letters, or meaning).

---

## 5. Varrow (vantrow-play) — ELEVATED

**Domain checks**
- varrow.com → Verisign RDAP 200 = REGISTERED; NS ha1–ha4.markmonitor.zone (corporate brand-protection registrar — consistent with CDW/Sirius ownership); A 67.225.132.53 but HTTPS no response (code 000) = dark but defended
- varrow.io → rdap.org 404 + DNS NXDOMAIN = AVAILABLE
- getvarrow.com → Verisign RDAP 404 = AVAILABLE; varrowhq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- Varrow, Inc. — Greensboro NC IT solutions (cloud/virtualization/storage/security; ~$146M revenue 2014), acquired by Sirius Computer Solutions May 2015 (Sirius later acquired by CDW); brand retired but .com corporately held via MarkMonitor. (PitchBook 112724-74; Crunchbase; CB Insights; LinkedIn.)
- VArrow Technologies (varrow.tech, varrow.uk) — ACTIVE IT services/digital transformation/AWS migration; on AWS Marketplace as "VArrow Professional Services."
- No Varrow in roofing/construction (only Varner Roofing, Arrow Roofing & Construction, Warrior Roofing near-names).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell; API POST → HTTP 405.
- Site-restricted WebSearch (justia/trademarkia/uspto.report) → NO exact VARROW record; nearest unrelated: VAARROOM (SN 90591622), VARLIVOO (SN 90791237), VAROLE (SN 87848219).
- Limitation: non-authoritative quick screen; common-law rights from Varrow Inc. (CDW) or VArrow Technologies could exist in class 9/42 territory.
- AccuLynx similarity: none. Minor note: embeds "arrow," common in roofing-contractor names, but not confusingly similar as a whole.

---

## 6. Swiftsure (acculynx-play) — ELEVATED

**Domain checks**
- swiftsure.com → Verisign RDAP 200 = REGISTERED; NS ns33/ns34.domaincontrol.com (GoDaddy)
- swiftsure.io → rdap.org 404 BUT DNS NS abby/albert.ns.cloudflare.com = REGISTERED (DNS overrides RDAP)
- getswiftsure.com → Verisign RDAP 404 = AVAILABLE; swiftsurehq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- Swiftsure Group, LLC (Seattle, swiftsuregroup.com) — RFID/sensor tracking software + hardware with an explicit construction vertical page ("helps the construction industry improve project ROI... track equipment and workers").
- Swiftsure Innovations (swiftsure.com) — Canadian medtech (SwishKit), $2.3M CAD seed, holds the .com.
- Swiftsure Timberworks (swiftsuretimber.com) — timber-framing construction/design.
- Swiftsure Capital LLC; Swiftsure Yachts; Swiftsure International Yacht Race; HMS Swiftsure ships/submarine class.
- No Swiftsure roofing company (only unrelated "Swift Roofing" contractors).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS-only shell. Method: web search of Justia/Trademarkia, then **direct TSDR verification by serial via curl** — a spot-check, not an exhaustive class search.
- TSDR sn87315206 (SWIFTSURE, Swiftsure Group, RFID readers, cl. 9) → **DEAD**/abandoned (no SOU after NOA).
- TSDR sn75911828 (Swiftsure Spatial Systems, database mgmt) → **DEAD**/registered-then-cancelled.
- TSDR sn79418949 (Swiftsure Vineyards, wine) → **DEAD**/abandoned. SN 85114155 (nail fungus prep) surfaced, not verified.
- No LIVE US SWIFTSURE registration found by this method, but Swiftsure Group's ongoing commercial software use in construction creates common-law risk in our space.
- AccuLynx similarity: LOW — same speed/precision compound formula (bucket intent) but clearly distinct in sound/appearance/meaning.

---

## 7. Truhawk (acculynx-play) — ELEVATED

**Domain checks**
- truhawk.com → Verisign RDAP 200 = REGISTERED; NS ns05/ns06.domaincontrol.com (GoDaddy); direct curl → 409, WebFetch → 503, but Google index shows live title "Get in the loop. | TruHawk" = live site, not bare parking
- truhawk.io → rdap.org 404 + DNS NXDOMAIN = likely AVAILABLE
- gettruhawk.com → Verisign RDAP 404 + NXDOMAIN = AVAILABLE; truhawkhq.com → Verisign RDAP 404 + NXDOMAIN = AVAILABLE

**Collision findings (WebSearch)**
- TruHawk (truhawk.com) — live online forum/community software platform; YouTube demos ("Truhawk description" nALBs1mcRsY; "Truhawk Community Platform: Flagging" Lm9VAWsg2Tc).
- True Heroes "Truhawk" fighter-jet toy (unrelated category).
- No Truhawk roofing/construction company; heavy "Tru-" prefix use among roofers (TruCraft, TruEco, TRU Roofing, Tru-Built).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → confirmed empty JS shell. Screen via web search + TrademarkElite — not comprehensive; no phonetic-equivalent, common-law, or state-mark coverage.
- TrademarkElite record: TRUHAWK, serial 88477094, owner Yonatan Gates (Hayward CA), filed 2019-06-17, classes 25 + 35 — **DEAD/ABANDONED 2020-04-01** (office action response not filed). No live class 9/42 TRUHAWK mark surfaced.
- AccuLynx similarity: phonetically/visually distinct, BUT replicates AccuLynx's exact formula (truncated accuracy adjective + sharp-eyed predator) producing a closely parallel commercial impression in the identical market; bird-of-prey imagery also abuts EagleView.

---

## 8. Surefox (acculynx-play) — ELEVATED

**Domain checks**
- surefox.com → Verisign RDAP 200 = REGISTERED; NS ns-cloud-e1..e4.googledomains.com; A 96.125.174.107; direct HTTPS → TLS failure (exit 35) from sandbox, HTTP → 503; content confirmed via search (Surefox North America site: /about, /careers, /contact)
- surefox.io → rdap.org 404 + DNS NXDOMAIN = AVAILABLE
- getsurefox.com → Verisign RDAP 404 = AVAILABLE; surefoxhq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- **SureFox by 42Gears Mobility Systems** — actively sold exact-name software (secure kiosk/lockdown browser, Android/iOS/Windows): Google Play com.gears42.surefox; 42gears.com pricing pages; SoftwareOne Marketplace PCP-7175-1078; SureFox(TM) asserted in 42Gears EULA (42gears.com/eula/surefox).
- Surefox North America — ~296-employee veteran-founded security services firm (Sunnyvale CA, founded 2016), owns surefox.com.
- No Surefox in roofing/construction (only SureRoof/SureBuild/Fox Roofing near-names).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell; API POST → S3 MethodNotAllowed; Justia and uspto.report → 403.
- Site-restricted WebSearch → NO exact SUREFOX record (only SUREFLIX, SUGARFOX, SURE-FI, SUEROX near-misses). Live registration neither confirmed nor ruled out — inconclusive screen.
- 42Gears has common-law class 9/42-territory rights on an in-commerce product regardless of registration; Surefox North America has senior class-45 use.
- AccuLynx similarity: sound/appearance distinct, but construction closely parallel — [assurance prefix]+[small predator], same CamelCase, same target market.

---

## 9. Ospra (acculynx-play) — ELEVATED

**Domain checks**
- ospra.com → Verisign RDAP 200 = REGISTERED; NS ns35/ns36.domaincontrol.com (GoDaddy)
- ospra.io → rdap.org 404 (spurious) BUT DNS NS dns1/dns2.registrar-servers.com (Namecheap) AND authoritative registry RDAP (rdap.identitydigital.services) → 200 = **REGISTERED** (registry RDAP overrides rdap.org)
- getospra.com → Verisign RDAP 404 = AVAILABLE; osprahq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch/WebFetch)**
- Ospra ApS (ospra.com, Viby J, Denmark, CVR DK45025403) — SaaS industrial documentation platform; Carlsberg testimonial; SAP/ERP integrations (confirmed via WebFetch of ospra.com).
- Ospra (ospra.co) — SaaS for battery supply-chain traceability/sustainability reporting.
- Many unrelated OSPRA acronyms (NYSED office, Oregon School PR Assoc., NIH NICHD) — low concern.
- Phonetically-near roofing contractors under "Osprey": Osprey Construction (ospreyconst.com), Osprey Roof LLC (ospreyroof.com).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell; API POST → MethodNotAllowed; Justia → 403; WebSearch → no specific Ospra US registration surfaced.
- Limitation: inconclusive by method; two operating exact-name software companies imply likely EU/common-law class 9/42 rights. Attorney search required.
- AccuLynx similarity: low (OS-prah vs AK-yoo-links; distinct on all axes) — risk driver is the Ospra incumbents.

---

## 10. Accupitch (acculynx-play, FLAGGED) — ELEVATED

**Domain checks**
- accupitch.com → Verisign RDAP 200 = REGISTERED; NS forsale.hugedomainsdns.com / domain-for-sale.hugedomainsdns.com = **parked for sale at HugeDomains** (aftermarket likely $2k+)
- accupitch.io → rdap.org 404 + DNS NXDOMAIN = likely AVAILABLE
- getaccupitch.com → Verisign RDAP 404 = AVAILABLE; accupitchhq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- "AccuPitch – Chromatic" Android tuner app (apkpure.net, com.instrument.accupitch.chromatic) — exact-name software.
- Guild AccuPitch 440 tuner (vintage hardware); Boss/Roland "Accu-Pitch" tuner feature (long class-9-territory commercial use); AccuPitch baseball/softball game mounds (Beacon Athletics / PYT Sports).
- No exact-name roofing/construction entity — but "Accupitch roofing" searches return acculynx.com as a top organic result (search adjacency to the incumbent).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → HTTP 503; trademarks.justia.com → 403. Fallback: web search of Trademarkia/uspto.report/Justia indexes → no live ACCUPITCH or ACCU-PITCH US registration surfaced. Non-exhaustive.
- Senior-use exposure in class 9 exists regardless of registration (Roland Accu-Pitch; AccuPitch tuner app).
- **AccuLynx similarity: HIGH** — identical "Accu-" prefix (first two syllables), roofing-term suffix, identical goods/services (class 42 roofing-contractor SaaS), identical channels and customers. Classic likelihood-of-confusion posture against a well-funded incumbent likely to enforce.

---

## 11. Vantrix (hybrid) — ELEVATED

**Domain checks**
- vantrix.com → Verisign RDAP 200 = REGISTERED; NS charles/elma.ns.cloudflare.com
- vantrix.io → rdap.org 404 BUT DNS NS natasha/major.ns.cloudflare.com = REGISTERED
- getvantrix.com → Verisign RDAP 404 = AVAILABLE; vantrixhq.com → Verisign RDAP 404 = AVAILABLE
- Also in use: vantrix.org, vantrixtech.org (other software firms)

**Collision findings (WebSearch)**
- Vantrix Corporation (vantrix.com) — Montreal media-processing/video-optimization software co., founded 2004, 275+ patents, deployed in 75+ networks, **acquired by Harris Computer 2024-10-04** (harriscomputer.com news; Crunchbase; Bloomberg 0020668D:CN).
- Vantrix LLC (vantrix.org) — US SaaS-auditing/AI-readiness/cybersecurity consulting (~$1.8M revenue, 24 people per GetLatka).
- vantrixtech.org — "Vantrix | Software."
- No exact Vantrix in roofing/construction; phonetically adjacent contractors: Vantis Roofing & Construction (AR), Vantage Roofing & Construction.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell. WebSearch → VANTRIX serial 99340813 (Zhao Jihong; ropes/pet-toy rope/hammocks — unrelated class, likely 22).
- uspto.report/company/Vantrix-Corporation → 403; could not enumerate Vantrix Corp marks. A 20-year software company with 275+ patents plausibly holds class 9/42 registered or common-law rights — treat as probable pending professional search.
- AccuLynx similarity: mild evocation only (-trix/-Lynx both end /ks/); prefixes, stress, spelling, meaning differ. Disqualifier is the identical-name software incumbents.

---

## 12. Accurow (hybrid) — ELEVATED

**Domain checks**
- accurow.com → Verisign RDAP 404 + DNS NXDOMAIN (Status:3) = **.com AVAILABLE**
- accurow.io → rdap.org 404 + DNS NXDOMAIN = **.io AVAILABLE**
- Note: accurow.ca registered and in active use by an unrelated crochet-counter product.

**Collision findings (WebSearch)**
- AccuRow(TM) by Raven Industries (CNH Industrial) — GPS-guided planter section control (hardware+software, in market since ~2009): agriexpo.online product 170093-14628; live support portal portal.ravenprecision.com/accurow; also marketed by Contree Sprayer.
- Roofing near-identity: Accu-Rite Roofing & Construction (San Antonio), American Accu-Roof Systems (TX), Accu Roofing LLC (Miami) — "Accurow" phonetically near-identical to "Accu-Roof"/"Accu Roofing." AccuLynx surfaced in the same result sets.
- No existing Accurow software/SaaS company.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell; API POST → MethodNotAllowed; Justia and uspto.report → 403.
- Site-scoped WebSearch → NO ACCUROW USPTO record (near marks: ACCURO Reg 5990604, ACCUROC (CA), ACCUFLOW, ACCUREPORTS). Suggests no live federal registration — but Raven brands AccuRow with ™ and has common-law use since ~2009 on a class-9-territory product. Formal TESS/TSDR clearance still needed.
- **AccuLynx similarity: HIGH** — shared dominant "Accu-" prefix in sound and appearance (first 4 letters identical), same "accuracy" meaning, identical product category (roofing SaaS, classes 9/42), identical customers. Not clearly distinct.

---

## 13. Vanlynx (hybrid) — ELEVATED

**Domain checks**
- vanlynx.com → Verisign RDAP 200 = REGISTERED; full RDAP: registered **2026-03-25**, expires 2027-03-25, registrar DomainRegistry.com LLC (IANA 128), NS1/NS2.HOSTING.BUSINESSIDENTITY.LLC; NS present but no A record; curl → exit 6 / code 000 = dormant/parked (possibly speculator), unavailable
- vanlynx.io → rdap.org 404 + DNS NXDOMAIN = AVAILABLE
- getvanlynx.com → Verisign RDAP 404 = AVAILABLE; vanlynxhq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- **VanLynk by TopProz** (vanlynk.com; topproz.com/products; Apple App Store id1494163403; Google Play com.topproz.vanlynk) — live field-service management SaaS for home-service contractors (scheduling, dispatch, billing, invoicing, inventory, fleet). One letter off, phonetically near-identical, directly adjacent contractor-software space.
- AccuLynx (acculynx.com) — dominant roofing CRM; Vanlynx copies the distinctive "-lynx" suffix in the identical product category.
- Minor: VenLynx (venlynx.com, crypto); Redbubble artist handle.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → header only, no results (JS SPA); API POST → HTTP 405.
- WebSearch ('"Vanlynx" OR "VanLynx" trademark USPTO'; '"VanLynk" trademark TopProz') → no registered or pending marks surfaced for either name. Non-authoritative; cannot rule out filings.
- **AccuLynx similarity: HIGH** — identical "-lynx" suffix; rhyming two-syllable marks ending /lɪŋks/; shared dominant LYNX element; same lynx-animal evocation; exact same goods/services (roofing software, classes 9/42) where AccuLynx is a well-funded senior user. Plus VanLynk as a second potential common-law senior user.

---

## 14. Kestrow (hybrid) — MEDIUM

**Domain checks**
- kestrow.com → Verisign RDAP **404** (curl exit 0) = **.com AVAILABLE**; DNS NS → Status:3 NXDOMAIN (corroborates)
- kestrow.io → rdap.org 404 = likely AVAILABLE
- getkestrow.com / kestrowhq.com — **not checked** in this screen (not needed with .com open); verify before defensive registration.

**Collision findings (WebSearch)**
- No exact "Kestrow" company or product — only twitch.tv/kestrow and scattered personal social profiles.
- Near-namespace (not exact): Kestros (kestros.io, software content-delivery platform, one letter off); Kestrel Software LLC (medical inventory SaaS, FlexScanMD); Kestrel Software (creative/mobile apps, Marin County CA); Kestrel Roofing and Kestrel Roofing & Building Ltd (UK contractors); Kestrel Construction/Contracting (small US GCs in OR/NY/NC). None are roofing-software competitors.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → heading only, no data; API POST → MethodNotAllowed (via proxy); uspto.report and trademarks.justia.com → 403.
- Domain-restricted WebSearch (trademarks.justia.com, uspto.report, trademarkelite.com) → **zero Kestrow marks**; nearest: KESTREL by Skerry Technologies (SN 97513272, tech-adjacent — could touch class 9/42) and KESTREL MEDIA GROUP (Reg 5988034, paper/publishing).
- Limitation: fallback method, not a TESS query. Formal clearance should specifically evaluate the KESTREL mark family in classes 9/42 given phonetic proximity of Kestrow to Kestrel/Kestros.
- AccuLynx similarity: clearly distinct — sound (KES-troh, 2 syllables vs AK-yoo-links, 3), appearance (no shared strings), meaning (kestrel/falcon vs accuracy+lynx). Not confusingly similar.

---

## 15. Sheltra (standalone) — ELEVATED

**Domain checks**
- sheltra.com → Verisign RDAP 200 = REGISTERED; NS ns49/ns50.worldnic.com (NetSol); HTTP 200 but HTTPS handshake fails (exit 35) = neglected/legacy site; WebFetch → 503 via proxy
- sheltra.io → rdap.org 404 + DNS NXDOMAIN = AVAILABLE
- getsheltra.com → Verisign RDAP 200 = **REGISTERED** (NS ns55/ns56.domaincontrol.com; live site of the Sheltra insurance startup)
- sheltrahq.com → Verisign RDAP 404 + NXDOMAIN = AVAILABLE

**Collision findings (WebSearch)**
- Sheltra, Inc. (getsheltra.com; San Mateo CA; incorporated 2025-08-04 per bizprofile.net) — active AI-native medical-malpractice insurance brokerage/tech startup on the exact name.
- "Sheltra" Android app — Google Play co.shelfwise.sheltra (reading tracker, updated ~June 2026) — exact-name software product.
- Sheltra & Son Construction Co Inc (Vero Beach FL, GC since 1959, license CGC1509373, BuildZoom 97) and Sheltra & Sons Contracting (site development/excavation, 35+ yrs) — construction-industry collisions.
- Sheltra Insurance Group (Yuma AZ); Sheltra Tax & Accounting — unrelated surname businesses.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → heading only; API POST → MethodNotAllowed; Justia → 403.
- Domain-restricted WebSearch → no exact SHELTRA mark; nearest: A SHELTA Reg 4609254 (class 25 apparel), SHEERTA Reg 4689676 (cosmetics), SHELIFT.
- Limitation: a pending 2025-26 application by Sheltra, Inc. could exist without being indexed yet.
- AccuLynx similarity: negligible on all axes.

---

## 16. Envelo (standalone) — ELEVATED

**Domain checks**
- envelo.com → Verisign RDAP 200 = REGISTERED; NS ns43/ns44.domaincontrol.com
- envelo.io → rdap.org 404 = **FALSE NEGATIVE**; DNS NS ns37/ns38.domaincontrol.com AND authoritative .io registry RDAP (rdap.identitydigital.services) → 200 = **REGISTERED**
- getenvelo.com → Verisign RDAP 200 = REGISTERED
- envelohq.com → Verisign RDAP 404 = AVAILABLE (only open option)

**Collision findings (WebSearch)**
- Envelo (envelo.com) — live payment-processing/merchant-services company, Florence SC.
- Envelo Solutions (envelo.solutions, UK) — active SaaS building-management/IAQ/space-management platform on Capterra/GetApp/SoftwareAdvice — software collision, building-adjacent.
- Envelo Facade (@envelofacade, Instagram) — contractor "specializing in Facade & Roofing" — direct roofing/construction collision.
- Envelo Homes (envelohomes.com) — residential design/build. Envelo (envelo.cc) — bicycle/MTB retailer, holder of the live ENVELO word mark. INVZBL "Envelo" — SaaS air-quality monitoring.
- Near-misses: Envel Facade Inc. (UHPC facades), Envelopro (roofing/siding), Invelo (real-estate software).

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → page shell only. Fallback: web search + Trademarkia record fetch.
- **ENVELO word mark LIVE at USPTO:** serial 85753199, Usul Md Corporation, Class 035 (retail store/online ordering for bicycles), filed 2012-10-12, registered 2014-07-08, **renewed 2024-01-15 — "REGISTERED AND RENEWED"** (confirmed via Trademarkia fetch). Identical mark, different class.
- ENVELO NERVE CONFORMING GEL CAP — serial 90747349, Tulavi Therapeutics (pharma/medical, not 9/42).
- No live class 9/42 US registration surfaced via this method; Envelo Solutions (UK) plausibly holds UK/EU marks and has US common-law software use — unverified.
- AccuLynx similarity: none.

---

## 17. Ridgely (standalone) — ELEVATED (near medium border)

**Domain checks**
- ridgely.com → Verisign RDAP 200 = REGISTERED (registrar GoDaddy IANA 146; clientDelete/TransferProhibited); NS graham/rayne.ns.cloudflare.com; WebFetch → **parked for-sale page (DomainEmpire Ltd) listed at $1,980** — acquirable, not an operating business
- ridgely.io → rdap.org 404 + DNS Status:3 NXDOMAIN = AVAILABLE
- getridgely.com → Verisign RDAP 200 = REGISTERED; ridgelyhq.com → Verisign RDAP 404 = AVAILABLE

**Collision findings (WebSearch)**
- Ridgely Roofing (Marble Falls, TX) — active metal-roofing contractor, owner Scott Ridgely; BBB profile (bbb.org .../ridgely-roofing-0825-90044147) and Facebook page. Direct name collision inside the exact vertical (the SaaS's prospective customers).
- Ridgeline (ridgelineapps.com) — large investment-management SaaS (~$104M ARR 2024, Dave Duffield) — visually/phonetically close (2-letter difference), unrelated industry.
- ZoomInfo lists a "Ridgely" entity (1152787601, details unclear). Heavy dilution from US place names (Ridgely MD/TN) and the surname.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → header only; api-v1-0-0/tmsearch POST → MethodNotAllowed. Fallback: WebSearch against trademarks.justia.com and general USPTO queries — non-authoritative proxy.
- No exact live RIDGELY wordmark surfaced; nearest: RIDGEYARD (Reg 5545208, 5130304, Guangzhou trading), RIDGAL (Reg 0749754), dead SN 87686460 (entertainment services) — none in class 9/42.
- Caveat: as a surname, RIDGELY could face a 2(e)(4) primarily-merely-a-surname registrability hurdle. Full clearance recommended.
- AccuLynx similarity: negligible (RIDGE-lee vs AK-yoo-links; no common pattern or meaning).

---

## 18. Curbly (standalone) — ELEVATED

**Domain checks** *(some checks logged 2026-07-16 as the screen ran past midnight)*
- curbly.com → Verisign RDAP 200 = REGISTERED; NS damien/fay.ns.cloudflare.com
- curbly.io → rdap.org 404 (false negative); DNS NS rob/candy.ns.cloudflare.com + live product site = **REGISTERED**
- getcurbly.com → Verisign RDAP 404 = AVAILABLE; curblyhq.com → Verisign RDAP 404 = AVAILABLE
- curbly.us also in use (Curbly Home app)

**Collision findings (WebSearch)**
- Curbly.com — established DIY design/home-improvement media community (Curbly, LLC) with large social presence — home-improvement adjacent to roofing.
- Curbly.io — live SaaS, "AI-Powered Car Photo Retouching" — exact-name software product.
- Curbly Home app (curbly.us; Apple App Store id6754256993) — home-services marketplace connecting homeowners with local providers — software in the home-services vertical.
- Curbly Labs (curblylabs.com) — AI photo-app studio. Curbly Bins (curblybins.com) — curbside bin cleaning.
- Roofing/construction search: no company collision, but "roof curb" is a standard roofing component term (maxwellroofing.com, designcomponents.com, mcelroymetal.com) — name reads quasi-descriptive in-vertical.

**Trademark screen — method, findings, limitations**
- tmsearch.uspto.gov → JS shell; API POST → HTTP 405; trademarks.justia.com → 403.
- WebSearch ('"Curbly" trademark USPTO'; 'curbly site:trademarks.justia.com') → no exact CURBLY federal registration surfaced; only near-misses (CURBHUGGERS, CURVE marks). Weak-negative evidence from search-engine indexing, not formal clearance.
- Curbly LLC and the Curbly Home app could hold common-law rights or unindexed filings in classes 9/35/42.
- AccuLynx similarity: LOW (distinct on sound, appearance, meaning).

---

---

## Round 2 (domain-first, roofing-native) — 2026-07-16

**Screen date: 2026-07-16.** **Scope:** a second-round, **domain-first** pass. A large pool of roofing/exteriors-native names was generated, filtered to those with an available `.com`, and only the survivors (8 candidates) were deep-screened. **Companion memo:** `docs/brand/naming-decision-memo-round2.md` (supersedes Round 1 for domain-available options; Round 1 evidence above is retained for history).

> Same method and limitations as Round 1 apply: `.com` via Verisign RDAP + Google DNS-over-HTTPS; `.io` via Identity Digital / rdap.org RDAP cross-checked against DNS (rdap.org / rdap.nic.io intermittently returned HTTP 000 through the agent proxy — treated as transport failures, not signal, and superseded by DNS and/or authoritative registry RDAP where reachable). **USPTO tmsearch.uspto.gov is a JS-only SPA that cannot be fetched (empty shell / API 405), and mirrors (uspto.report) returned 403 — so every trademark finding below is web-search indexing only, NOT a cleared register search.** Formal clearance per `docs/runbooks/05-legal-counsel-checklist.md` required before adoption.

### R2-1. Eaverow — LOW

**Domain checks**
- eaverow.com → rdap.verisign.com/com/v1/domain/eaverow.com HTTP 404 = AVAILABLE (re-verified 2026-07-16)
- eaverow.com → dns.google NS Status:3 (NXDOMAIN) + A Status:3 (NXDOMAIN) = corroborates available, no live host/parking
- eaverow.io → rdap.identitydigital.services/rdap/domain/eaverow.io HTTP 404 = AVAILABLE (rdap.org returned 000/connection-fail; re-checked against authoritative .io registry)
- eaverow.io → dns.google NS Status:3 (NXDOMAIN) + A Status:3 (NXDOMAIN) = corroborates available

**Collision findings (WebSearch)**
- No exact "Eaverow" in general, software, roofing, construction, or SaaS/app queries. **No company/product named Eaverow in roofing, exteriors, construction, or software/SaaS.**
- Near-namespace only in UNRELATED industries: Eavor (eavor.com) = well-funded geothermal clean-energy firm, phonetically adjacent (EE-vor vs EE-ver-oh), different string/class; Eaver (eaverglobal.com) = thin placeholder, industry undetermined; plus minor unrelated "Eaver" uses (YouTuber, English wrestler "Pastor William Eaver"). Everway/Ever.co/Ewave/DBeaver = distinct, non-confusing.

**Trademark screen — method, findings, limitations**
- WebSearch "Eaverow trademark USPTO" → only generic USPTO portal pages, no "Eaverow" mark; tmsearch JS-rendered, not fetchable = method limitation, counsel clearance still required.
- Positive: "Eaverow" is coined/suggestive at most (evokes "eave(s)"), favors registrability and mark strength; not merely descriptive. Roofing SaaS files Nice classes 9 + 42 (same as AccuLynx) — same-class scrutiny applies. Advisable to check "Eavor" (energy) and "Eaver" as unrelated-class phonetic citations.
- AccuLynx similarity: NONE (EE-ver-oh vs AK-yoo-links; no shared consonant skeleton, length, or meaning).

### R2-2. Gablora — LOW

**Domain checks**
- gablora.com → rdap.verisign.com/com/v1/domain/gablora.com HTTP 404 = AVAILABLE (re-verified 2026-07-16)
- gablora.com → dns.google NS Status:3 (NXDOMAIN, com. SOA authority) + A Status:3 (NXDOMAIN) = unregistered
- gablora.io → rdap.identitydigital.services (authoritative .io) HTTP 404 = AVAILABLE
- gablora.io → dns.google NS Status:3 (NXDOMAIN, io. SOA authority) = unregistered; rdap.org / rdap.nic.io returned 000 (endpoint failure), superseded by Identity Digital RDAP + DNS

**Collision findings (WebSearch)**
- No direct collisions — no company/product/app/SaaS named "Gablora" in general, software/SaaS, or roofing/exteriors/contractor searches. Results = unrelated noise (given name "Gabriella," Polish "gablota" = display case, Gabriella-brand socks code, unrelated "Gabify" healthcare SaaS).
- Contextual note only: name embeds "gable" (generic roofing-architecture term); roofing space has a crowded field of descriptively gable-named firms (Green Gable Roofing & Exteriors, Gaby Roofing, Wildwood gable-roof services) — generic word usage, not the coined mark, so no naming collision.

**Trademark screen — method, findings, limitations**
- WebSearch "Gablora trademark USPTO" → only generic USPTO/TSDR/tmsearch landing pages, no mark. tmsearch JS-heavy SPA not fetchable; uspto.report mirror HTTP 403. Live tmsearch query in 9/42 (plus "gable-" root sweep) still required.
- Distinctiveness caveat: embeds "gable" (generic roofing term) → suggestive/descriptive borderline in-class, coexists with common-law "gable" users; "Gablora" as a whole is a distinctive invented word.
- AccuLynx similarity: LOW/negligible (/ˈækjəlɪŋks/ vs /ɡæbˈlɔːrə/; no shared phonemes, A vs G start, -ynx vs -ora ending).

### R2-3. Battenly — MEDIUM

**Domain checks**
- battenly.com → rdap.verisign.com/com/v1/domain/battenly.com HTTP 404 = AVAILABLE (re-verified 2026-07-16)
- battenly.com → dns.google NS Status:3 (NXDOMAIN, com. SOA) + A Status:3 (NXDOMAIN) = unregistered
- battenly.io → dns.google NS Status:3 (NXDOMAIN, io. SOA) + A Status:3 (NXDOMAIN) = appears available on DNS evidence
- battenly.io → RDAP: rdap.org and rdap.nic.io both HTTP 000 (unreachable through proxy) — RDAP could NOT corroborate; .io availability rests on DNS NXDOMAIN only

**Collision findings (WebSearch)**
- No company/product/app/SaaS named "Battenly" across four queries — only genealogy/surname records (rare Scottish surname, 1881 Lanarkshire), name-meaning pages, and a differently-spelled script FONT "Batteny" (no second n, no l). Non-matching near-strings: "Battly Launcher" (Minecraft) and "Battery Ventures" (VC).
- Namespace note: "batten" is an industry-descriptive roofing/siding term; the Batten-rooted roofing field is moderately crowded with PHYSICAL contractors/suppliers — E K Batten Roofing, Battens Plus, Chris Battaini Roofing, Johns Manville "Membrane Battens," Westlake Royal batten systems. All physical goods/services, NOT software — no direct product collision, but they crowd the near-namespace.

**Trademark screen — method, findings, limitations**
- WebSearch "Battenly trademark USPTO" → only USPTO portal pages, no mark. tmsearch JS-heavy SPA, not directly fetchable = web-visibility screen only. Formal tmsearch query required.
- Descriptiveness flag: "batten" is a recognized roofing/siding component term → "Battenly" reads suggestive-to-descriptive in-industry, may weaken registrability in 9/42 and invite coexistence with the Batten-named field. Coined "-ly" suffix adds distinctiveness; concern moderate, not disqualifying.
- AccuLynx similarity: NONE (BAT-en-lee vs AK-yoo-links; no shared phonemes/prefix/suffix/visual overlap/meaning).

### R2-4. Hewdeck — MEDIUM

**Domain checks**
- hewdeck.com → rdap.verisign.com/com/v1/domain/hewdeck.com HTTP 404 = AVAILABLE
- hewdeck.com → dns.google NS Status:3 (NXDOMAIN, com. SOA authority) = unregistered/available
- hewdeck.io → rdap.org HTTP 000 connection failure = METHOD LIMITATION, RDAP inconclusive
- hewdeck.io → dns.google NS Status:3 (NXDOMAIN, io. SOA authority) = unregistered/available on DNS evidence (registered .io domains carry registry NS delegation)

**Collision findings (WebSearch)**
- No direct company/product collision for "Hewdeck" in any industry — four searches (bare, +software, +roofing, +construction) returned zero businesses on the name; only literal hit is surname "S. Hewdeck" in a 2006 track-meet result. Roofing/construction searches returned only the generic term "roof decking."
- SOFTWARE near-namespace crowding: Hookdeck (established webhook-infra SaaS, hookdeck.com; G2/Capterra/SaaSworthy) = aural/visual near-neighbor (Hew-deck vs Hook-deck, both software brands ending "-deck"); Haiku Deck (presentation SaaS); legacy "HEW" acronyms (Renesas High-performance Embedded Workshop IDE; CMS HIPAA Eligibility Wrapper). None is a roofing/exteriors/construction product = no true in-industry collision.

**Trademark screen — method, findings, limitations**
- WebSearch "Hewdeck trademark USPTO" → only generic USPTO/tmsearch landing pages. WebFetch uspto.report/company/search?q=hewdeck → HTTP 403 Forbidden. tmsearch JS-heavy SPA not fetchable → TM screen limited to WebSearch (preliminary knockout only).
- Coined Hew+deck compound likely registrable (suggestive/fanciful), though "deck" is somewhat descriptive of roof decking, mildly weakening distinctiveness in the roofing field. Both file in 9/42.
- AccuLynx similarity: NONE (Hew-deck, 2 syllables, H-/-deck vs Ac-cu-lynx, 3 syllables, A-/-lynx; different length, letter set, meaning).

### R2-5. Rafterow — MEDIUM

**Domain checks**
- rafterow.com → rdap.verisign.com/com/v1/domain/rafterow.com HTTP 404 = AVAILABLE (re-verified 2026-07-16)
- rafterow.com → dns.google NS Status:3 (NXDOMAIN, com. SOA) + A Status:3 (NXDOMAIN) = not registered, corroborates available
- rafterow.io → rdap.org HTTP 000 (transport/proxy failure, not authoritative)
- rafterow.io → dns.google NS Status:3 (NXDOMAIN, io. SOA) = appears available on DNS evidence

**Collision findings (WebSearch)**
- No exact-match company/product/SaaS named "Rafterow." Only exact-string web hit is Polish Wikipedia "Chata pelna Rafterow" (TV series *Packed to the Rafters*, grammatical inflection of "Rafters") — not a business.
- Crowded/generic near-namespace in target industry: "Rafter" is a standard roof-framing term — "Rapid Rafter" (framing/roofing square tool, rapidrafter.com), a "Rafter estimator for roofing" Android app, and multiple unrelated "Rafter [letter]" ranch/rodeo businesses (Rafter K Rodeo, Rafter W Ranches). None use the compound "Rafterow," but "Rafter" root is descriptive/suggestive and heavily used in roofing/construction.

**Trademark screen — method, findings, limitations**
- WebSearch "Rafterow trademark USPTO" and "'Rafterow' company OR SaaS OR app OR trademark" → no USPTO record; only USPTO portal links. tmsearch JS-heavy, not fetchable = method limitation, formal knockout search still required. No live in-class 9/42 mark evident.
- Distinctiveness caveat: "Rafter" is a descriptive roof-framing term → "Rafterow" may draw suggestive/descriptive scrutiny and face a crowded field of "Rafter"-formative marks.
- AccuLynx similarity: LOW (RAF-ter-oh vs AK-yoo-links; no shared root, syllable structure, phonetics, or meaning).

### R2-6. Trowforge — MEDIUM

**Domain checks**
- trowforge.com → rdap.verisign.com/com/v1/domain/trowforge.com HTTP 404 = AVAILABLE
- trowforge.com → dns.google NS Status:3 (NXDOMAIN) + A Status:3 (NXDOMAIN) = no live host, corroborates available
- trowforge.io → rdap.org 000 (proxy failure, no signal); re-verified rdap.identitydigital.services/rdap/domain/trowforge.io HTTP 404 = AVAILABLE
- trowforge.io → dns.google NS Status:3 (NXDOMAIN) = corroborates .io available

**Collision findings (WebSearch)**
- Minor unrelated-industry collision + crowded in-industry "Forge" namespace. (1) "Trow Forge Technical Sales, LLC" / "Trow Forge Technical Services" (Los Angeles) — supplies hardware and ink to the PACKAGING industry; identical string once the space is removed, different field, rebranding to "TF Technical" (tftechnical.com). (2) Irrelevant: fantasy novel "Trow Forge (Goblin Alley)" (Ryan M. Williams, Amazon), Etsy blacksmith "TRForge." (3) No SaaS/roofing/construction company named "Trowforge."
- "-forge" heavily diluted in the exact target vertical: Forge Construction Group, Forge Roofing Services, Forge & Nail Roofing & Construction, Forge Building Company, Forge Construction.

**Trademark screen — method, findings, limitations**
- WebSearch "Trowforge trademark USPTO" → no "Trowforge" federal mark; only an unrelated "FORGE" application (Forge Life LLC, filed 2025-03-06, electronic/biometric locks, Class 9 — not close, different goods). tmsearch JS-rendered, not fetchable = WebSearch-only screen, not a definitive clearance.
- Caveat: "Trow Forge Technical Sales/Services, LLC" is a prior common-law user of the identical two-word string (unrelated packaging field). "Forge" is a common, weak/crowded TM element generally and in roofing/construction → narrows protectable scope of a "-forge" mark.
- AccuLynx similarity: NONE (TROW-forj vs AK-yoo-links; no shared phonetics/spelling/meaning).

### R2-7. Cladwright — ELEVATED

**Domain checks**
- cladwright.com → rdap.verisign.com/com/v1/domain/cladwright.com HTTP 404 = AVAILABLE (re-verified 2026-07-16)
- cladwright.com → dns.google NS Status:3 (NXDOMAIN, com. SOA authority, no NS delegation) = corroborates available
- cladwright.io → rdap.org/domain/cladwright.io HTTP 404 = AVAILABLE
- cladwright.io → dns.google NS Status:3 (NXDOMAIN, io. SOA authority) = corroborates available

**Collision findings (WebSearch + Companies House)**
- **EXACT-NAME COLLISION IN CONSTRUCTION:** CLADWRIGHT LTD — ACTIVE UK company, Companies House #15028052, incorporated 25 Jul 2023, registered office 2 Buttler Way, Sleaford NG34 7PA, SIC 41201 "Construction of commercial buildings." Confirmed via WebFetch of find-and-update.company-information.service.gov.uk/company/15028052: Status ACTIVE. Exact-name, live, same broad industry. Small/young firm, no discoverable web presence, NOT a software product — but a live same-industry namesake.
- Near-miss social: "@cladright" on X (one letter off, industry unknown).
- Roofing vertical phonetic near-miss: C.L. Wright Roofing Inc. (Midlothian/Richmond VA, since 1986) — "C L Wright" phonetically close, in exact target vertical.
- Crowded namespace: Cladding Corp, Cladify, Cladding Construction Ltd, Cladding Systems → clad+wright is descriptive/suggestive, weakly distinctive.
- Software check: no U.S. software/SaaS product named Cladwright.

**Trademark screen — method, findings, limitations**
- WebSearch "Cladwright trademark USPTO" → only generic USPTO landing/search pages, NO "Cladwright" mark. tmsearch/TESS/TSDR JS/session-based, not fetchable = keyword screen, not cleared. Formal US + UK (UKIPO) clearance required, esp. classes 9/42 and construction/exteriors classes.
- Because "Cladwright" is descriptive/suggestive of the cladding trade AND an active same-name construction company exists, distinctiveness/registrability likely weaker and more contested than an invented mark.
- AccuLynx similarity: LOW (Clad+wright vs Accu+Lynx; no shared root/phonemes; aural/visual/conceptual overlap low).

### R2-8. Forgelay — ELEVATED

**Domain checks**
- forgelay.com → rdap.verisign.com/com/v1/domain/forgelay.com HTTP 404 = AVAILABLE (re-verified 2026-07-16)
- forgelay.com → dns.google NS Status:3 (NXDOMAIN, no NS records) = unregistered/unresolved, corroborates available
- forgelay.io → rdap.org/domain/forgelay.io HTTP 404 = AVAILABLE
- forgelay.io → dns.google NS Status:3 (NXDOMAIN, no NS records) = corroborates available

**Collision findings (WebSearch + WebFetch)**
- No exact "Forgelay" company/product/mark, but meaningful near-namespace collisions. **STRONGEST — "Forgely" (Forge-lee):** a LIVE, actively marketed SaaS in the field-service/home-services vertical — people/talent-management + LMS software (formerly "BackOffice," now under Coalmarch), explicitly built for lawn care, pest control, plumbing, HVAC contractors (the same home-services trades ecosystem as roofing/exteriors). LinkedIn, Capterra (vs Workday HCM, iCIMS), eLearning Industry listing, "Forgely Hire" product. Differs from "Forgelay" by one inserted letter, near-homophone. WebFetch of eLearning Industry Forgely page confirmed: real SaaS, people/team management + LMS, desktop + cloud, xAPI. Same classes 9/42, overlapping trade channels, near-identical mark = genuine likelihood-of-confusion.
- "ForgeLayer" (forgelayer.io) — enterprise blockchain wallet-infra API; "Forgely3D" (forgely3d.com) — 3D-printing filament (same "Forgely" brand family).
- Heavily crowded "Forge-" root in BOTH construction/roofing (Forge & Nail Roofing & Construction, Forge Construction KC/LLC, Forged Construction, Forgen) AND software (Atlassian Forge, Laravel Forge, Autodesk Forge, Forgejo, Forge Software, SaaS Forge).

**Trademark screen — method, findings, limitations**
- USPTO tmsearch POST API → HTTP 405; GET search URL → HTTP 200 but empty JS shell (no parseable records). WebSearch "Forgelay trademark USPTO" → only generic USPTO pages, no "Forgelay" mark. No federal registration for exact "Forgelay" found within these limits.
- **NOT a clean bill:** near-identical senior brand "Forgely" is a live commercial software mark in the same field-service SaaS vertical, likely holds common-law and/or registered rights in-class; full attorney clearance in 9/42 against "Forgely"/"Forge-" formatives warranted. Absence of a fetched record = tooling limitation, not a clear namespace.
- AccuLynx similarity: NONE (Forge-lay vs Ack-yoo-links; no shared phonemes/letters/meaning). The trademark risk comes from "Forgely," not AccuLynx.

---

*End of evidence record. All verdicts are snapshots as of the screen date and decay; re-verify domain availability immediately before purchase, and route all trademark questions through counsel per `docs/runbooks/05-legal-counsel-checklist.md`.*
