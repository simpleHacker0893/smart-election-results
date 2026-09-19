# How Kenyan presidential results are actually recorded, reported and litigated

Research date: 2026-09-19
Method: primary sources only. Every claim is labelled **Verified** (the source
states it, quoted), **Inferred** (reasoning from sources) or **Unverified**
(could not confirm from a primary source). Secondary sources are labelled as
such inline.

## Provenance and access notes

- `kenyalaw.org` and `new.kenyalaw.org` HTML return **HTTP 403** to automated
  fetchers. The `new.kenyalaw.org/.../source.pdf` files fetch fine via `curl`
  with a browser user-agent. That is how the Constitution, Elections Act,
  Evidence Act and judgments below were obtained.
- `iebc.or.ke` serves an **incomplete TLS chain**; standard fetchers fail with
  "unable to verify the first certificate". `curl` works.
- The Elections Act subsidiary legislation used here is the **Revised Edition
  2017**. Its amendment markers stop at L.N. 72/2017. Anything enacted after
  2017 is not confirmed from it.

---

## 1. Statutory flow of a presidential result

### At the Polling Station

**Verified.** Constitution Art 86(b): results must be "counted, tabulated and
the results announced promptly by the presiding officer at each polling
station". Art 86(c): results collated "openly and accurately" and announced by
the returning officer.

**Verified**, Elections (General) Regulations 2012 reg 79(2A) — the Presiding
Officer shall:

> "(a) immediately announce the results of the voting at the polling station
> **before communicating** the results to the returning officer;
> (b) request each of the candidates or agents present to append his or her
> signature;
> (c) **provide each political party, candidate, or their agent with a copy** of
> the declaration of the results; and
> (d) **affix a copy** of the declaration of the results **at the public
> entrance** to the polling station or at any place convenient and accessible to
> the public at the polling station."

The Party Agent's copy and the publicly posted copy are therefore **statutory
entitlements**, not local custom. Three distinct physical objects exist: the
original Statutory Form, the Party Agent's copy, and the posted copy.

### Signature is an attestation event, never a validity condition

**Verified**, reg 79(3)–(7). A candidate or agent who refuses or fails to sign
"shall be required to record the reasons"; if they will not, the Presiding
Officer "shall record the fact of their refusal"; absence is likewise recorded.
And:

> "(6) The refusal or failure of a candidate or an agent to sign a declaration
> form … **shall not by itself invalidate the results announced**."
> "(7) The absence of a candidate or an agent … **shall not by itself invalidate
> the results announced**."

**Inferred.** Model the signature as optional, with a *required* annotation of
reason / refusal / absence. A schema that treats agent signatures as mandatory
would misrepresent the law.

### Transmission

**Verified**, reg 82: "The presiding officer shall, **before ferrying** the
actual results … submit to the returning officer the results **in electronic
form**", and those results "shall be **provisional** and subject to confirmation".

**Verified**, Elections Act s.39(1C)(a): results travel from the Polling Station
to **both** the constituency and national tallying centres, **electronically and
physically**.

**Verified**, s.39(1E): where the electronic and physical records differ,
neither channel automatically wins — "the result which is an accurate record of
the results tallied, verified and declared at the respective polling station
shall prevail."

**Verified**, s.39(1F): failure of transmission or publication "shall not
invalidate the result as announced and declared."

**Verified**, s.39(1G): live-streamed results are "for purposes of public
information only and **shall not be the basis for a declaration**."

**Verified, and a correction to a common assumption:** **s.44A is not a results
backup.** Its heading is "Complementary mechanism for **identification of
voters**" (narrowed by Act No. 34 of 2017). The manual/parallel path for
*results* lives in s.39(1C)(a) and 39(1E)–(1F). s.44 establishes the integrated
electronic electoral system.

### Finality — the Maina Kiai ruling

**Verified.** *IEBC v Maina Kiai & 5 others*, Civil Appeal 105 of 2017, [2017]
KECA 477 (KLR), 23 June 2017.

> Para 161: "The lowest voting unit and the first level of declaration of
> presidential election results is the polling station. **The declaration form
> containing those results is a primary document and all other forms subsequent
> to it are only tallies of the original and final results recorded at the
> polling station.**"

> Para 160: to say the Chairperson may "alone correct, vary, confirm, alter,
> modify or adjust the results … **is to donate an illegitimate power**."

Para 163 struck down as unconstitutional the provisions describing results as
provisional or subject to confirmation (s.39(2) & (3), reg 87(2)(c), reg 83(2)).

**Inferred, and worth flagging:** reg 82(2) still says electronically submitted
results are "provisional and subject to confirmation", and was not among the
provisions listed as struck down. The tension between reg 82(2) and Maina Kiai
should be treated as live rather than settled.

**Verified**, reg 87(3): at the national tallying centre the Chairperson's only
statutory verbs are *verify against* Forms 34A and 34B, *tally and complete*
Form 34C, *announce*, *sign and date*, and *declare*. No power to alter a figure.

### The petition clock

**Verified**, Art 140: a petition is filed "within **seven days after the date of
the declaration** of the results"; "Within **fourteen days after the filing** of
a petition … the Supreme Court shall hear and determine the petition and its
decision shall be final."

**The 14 days runs from filing, not from declaration.** Total worst case is 21
days from declaration to final judgment.

---

## 2. Form 34A anatomy

**Verified**, Elections (General) Regulations 2012, Schedule, Form 34A
[Reg. 79(2)(a)]. Fields in printed order:

| # | Field | Notes |
|---|---|---|
| 1 | `S/Number` | Serial number |
| 2 | `Name of Polling Station` + `Code` | |
| 3 | `Ward` + `Code` | |
| 4 | `Constituency` + `Code` | |
| 5 | `County` + `Code` | |
| 6 | Candidate table: `Name of Candidate` \| `No. of Valid Votes Obtained` | Repeating rows |
| 7 | `Total number of valid votes cast` | |
| 8 | **Polling Station Counts** 1–5 | see below |
| 8.1 | `Total Number of Registered Voters in the Polling Station` | |
| 8.2 | `Total Number of Rejected Ballot Papers` | |
| 8.3 | `Total Number of Rejection Objected To Ballot Papers` | |
| 8.4 | `Total Number of Disputed Votes` | |
| 8.5 | `Total Number of Valid Votes Cast` | |
| 9 | Disputed votes: `Serial Number of Ballot Paper(s) with disputed vote` \| `Name of Candidate assigned the vote` | |
| 10 | Declaration paragraph | quoted below |
| 11 | `Presiding Officer` + `Signature` + `Date` | |
| 12 | `Deputy Presiding Officer` + `Signature` + `Date` | |
| 13 | Agents table: `No.` \| `Name of Candidate or Agent` \| `ID/Passport No.` \| `Party Name/Independent Candidate` \| `Tel. Contact` \| `Signature` \| `Date` | |
| 14 | `Reasons for Refusal to Sign (if any)` | free text |
| 15 | `Presiding Officer's Comments` | free text |

Declaration text, **Verified** verbatim:

> "We, the undersigned, being present when the results of the count were
> announced, do hereby declare that the results shown above are true and
> accurate count of the ballots in ……… Polling Station ……… Constituency."

**Unverified.** No barcode, QR code, watermark or other security feature appears
in the statutory Schedule. Printed stock carried such features in practice (see
§5), but they are **not** in the legal text. Confirming the printed layout needs
real 2022 forms.

**Inferred — the only on-face arithmetic identity** is
`sum(candidate votes) = Total valid votes cast`. There is no "total votes cast"
field, so turnout must be derived as `(valid + rejected) ÷ registered`.

---

## 3. What a Party Agent is entitled to

**Verified**, reg 62(2): the Presiding Officer "shall admit to the polling
station **not more than one agent for each candidate or political party**."

**Verified**, reg 62(3): "The absence of agents shall not invalidate the
proceedings at a polling station."

**Verified**, reg 62(4): every agent "shall at all times during the performance
of the duties … **display the official badge supplied by the Commission**."

**Verified**, reg 80: any candidate or agent present when counting completes may
require a recount; not more than twice.

**Verified**, reg 79(2A)(c): entitled to a **copy** of the declaration.

**Verified**, reg 57: every political party shall, **at least fourteen days**
before the election, submit to the Commission the names of **one national chief
agent and forty-seven county chief agents**. Independent presidential candidates
likewise.

**Verified:** reg 58 — which previously governed appointment of polling-station
agents — was **deleted by L.N. 72/2017, r. 26**.

**Unverified.** The current mechanism and timing for accrediting an individual
*polling-station* Party Agent (as distinct from chief agents) is not established
by these sources. Elections Act s.43 ("Accreditation of observers, agents,
reporters, etc.") is the likely home and should be read before design section 9
is written.

---

## 4. 2022 transmission and the ingest load curve

### KIEMS transmitted an image and nothing else

**Verified**, EU EOM Kenya 2022 Final Report, p.14. IEBC modified transmission

> "so as to fully base it on the originals of the results forms, and to require
> **only scanned results form (34A) images to be transmitted instead of sending
> them together with manual KIEMS results entries**."

**Verified**, p.17, the explicit contrast with 2017:

> "compared with that of 2017, **when besides the image the results were typed in
> and electronically transmitted**."

**Inferred, and important.** In 2022 the official transmission carried **zero
structured result data**. Nothing tallied itself; the official count came
entirely off paper. Every parallel tally — media, party, observer — had to OCR
or hand-key the images.

**Verified**, Supreme Court [2022] KESC 56 para 20(f): "The RTS was configured on
a Virtual Platform Network (VPN) and the SIM cards **locked to a specific polling
station**. The server was also configured to accept results only from authorized
and properly mapped KIEMS kit."

**Verified**, para 20(b)/(e): the artefact was a **PDF converted on the kit at
the polling station** — "uniform PDF conversions at the polling stations".

**Unverified:** image resolution, file size, carrier/APN, satellite provider.

### The portal

**Verified**, EU EOM p.39: forms were accessible "in real time as they were being
uploaded" — a live feed, not a batch. **Images only**; no machine-readable data
was published alongside. URL `forms.iebc.or.ke`. Current accessibility: **not
tested**.

### The curve — replaces the flat five-hour assumption

Poll close 17:00 EAT, Tuesday 9 August 2022. Denominator 46,229.

| h after close | Wall clock | Cumulative Forms 34A | % | Source |
|---|---|---|---|---|
| 0 | Tue 17:00 | 0 | 0% | statutory |
| ~2–5 | Tue 19:00–22:00 | first forms | — | **Unverified** — no source timestamps first arrival |
| **7** | Wed 00:00 | **>36,983** | **>80%** | EU EOM p.17 |
| **<24** | Wed <17:00 | ~45,170 | **97.71%** | Carter Center p.4 |
| 24 | Wed 17:00 | ~45,767+ | **>99%** | EU EOM p.17 |
| ~96 | Sat 13 Aug | ~46,000 | 99.5% | Carter Center p.29 |
| ~142 | Mon 15 Aug (declaration) | 46,201 | 99.94% | EU EOM p.40 |

**Verified**, EU EOM p.17: "more than 80 percent of the images transmitted by
midnight and exceeding the 99 per cent publication rate 24 hours after closing
the polls".

**Verified**, EU EOM p.40: "At the time of announcement, **28 polling station
results forms (34A) were still not uploaded** on the IEBC public portal and
results of **27 constituencies (forms 34B) had not been publicly announced**".

The T+24h figures from the two observer missions conflict (97.71% vs >99%).
**Treat T+24h as a 97.7–99%+ band.**

**Inferred shape:** near zero for two hours, a steep ramp to >80% by hour seven,
a decaying tail to ~98% at 24 hours, ~0.5% straggling over the following five
days, and **never closing** — 28 forms were still missing at declaration.

**Do not use** the widely-repeated "11,000 forms uploaded in eight minutes on 11
August" figure. It was a petitioner allegation the Supreme Court found **not
proved** ([2022] KESC 54, paras 18, 20(a)).

### The paper curve is much slower — do not conflate the two

**Verified**, EU EOM p.39 and p.40: the first *original* Forms 34A reached the
National Tallying Centre on 11 August (T+~40h), and by the afternoon of 13
August **only 29.92%** of polling station results had been physically verified,
with 124 returning officers still queuing to hand over forms.

### Network coverage

**Verified**, EU EOM p.14: "In compliance with regulation 21 of the Election
Technology Regulation, the IEBC published the list of polling stations without
3G/4G connectivity and took steps to address this problem in the **1,272 polling
stations** across the country identified, via the use of **satellite modems**".

**Seed fact corrected.** The figure 1,111 refers to polling **centres** (IEBC CEO,
June 2022 — *secondary source*). The polling **station** figure is **1,272**,
= 2.75% of stations. The two reconcile: a centre with more than 700 voters hosts
multiple stations.

**Unverified:** any 2022 practice of Presiding Officers travelling to find
coverage. Satellite modems at the station were the documented answer.

---

## 5. What the Supreme Court compared, and what Kenyan law requires of
electronic records

### Evidence Act (Cap. 80) — the certificate

**Verified**, s.106A: "The contents of electronic records may be proved in
accordance with the provisions of section 106B."

**Verified**, s.106B(4) verbatim:

> "In any proceedings where it is desired to give a statement in evidence by
> virtue of this section, a certificate doing any of the following—
> (a) identifying the electronic record containing the statement and describing
> the manner in which it was produced;
> (b) giving such particulars of any device involved in the production of that
> electronic record as may be appropriate for the purpose of showing that the
> electronic record was produced by a computer;
> (c) dealing with any matters to which conditions mentioned in subsection (2)
> relate; and
> (d) **purporting to be signed by a person occupying a responsible position in
> relation to the operation of the relevant device or the management of the
> relevant activities** (whichever is appropriate),
> shall be evidence of any matter stated in the certificate …"

The s.106B(2) conditions the certificate must address: regular use by a person
**having lawful control**; information regularly fed in **in the ordinary
course**; the computer **operating properly** throughout, or malfunction not
affecting accuracy; and output that **reproduces or is derived from** what was
fed in. s.106B(3): successive or combined computers count as **one computer**, so
a multi-hop pipeline certifies as a single system.

### The highest-leverage finding in this document

**Verified**, s.106G verbatim:

> "(1) In any proceedings involving a secure electronic record, the court shall
> presume, unless the contrary is proved, that the secure electronic record **has
> not been altered** since the specific point of time the secure electronic
> signature was affixed.
> …
> (3) **Except in the case of a secure electronic or secure digital signature,
> nothing in this section shall create any presumption relating to authenticity
> and integrity** of the electronic record or any digital signature."

**Inferred.** Kenyan law offers a statutory presumption of integrity, and it is
gated entirely on the signature qualifying as a **"secure electronic signature"**.
If our Seal qualifies, the Envelope arrives in court with a rebuttable
presumption that it has not been altered. If it does not, **no presumption of
authenticity or integrity arises at all** and every element must be proved from
first principles under the petition clock.

**Unverified, and now the single most important open question in the project:**
"secure electronic signature" is defined in the Kenya Information and
Communications Act, not the Evidence Act. That definition has not been read. It
must be, before the Seal format is fixed.

**Verified**, s.78A(2): a court "shall not deny admissibility … only on the
ground that it is not in its original form." s.78A(3) weight test: reliability of
generation, storage and communication; **integrity maintenance**; **originator
identification**. s.78A(4) provides a second route for ordinary-course-of-business
records certified correct "by a person in the service of" the generator.

**Verified.** The Evidence Act **never uses the word "hash"**. There is no
statutory hash requirement. Hashing is how we satisfy 78A(3) integrity and
support the 106G presumption; it is not itself a legal requirement.

### 2017 — what nullified the election

**Verified**, [2017] KESC 42. Scrutiny examined **291 Forms 34B** and **4,299
Forms 34A**. Among the 34Bs: 56 without watermark, 31 without serial number, 5
unsigned by the returning officer, 32 unsigned by agents, 189 handover and 287
takeover sections blank. Among the 34As: 481 signed carbons, 157 unsigned
carbons, 269 unsigned originals, 58 photocopies (46 of them unsigned), 11 without
watermark. Form 34C itself bore "neither a watermark, nor serial number".

Operative holding (para 300): the declaration was made before all Forms 34A were
received and "**solely, on the basis of Forms 34B, some of which were of dubious
authenticity**", in breach of s.39(1C).

**Verified, and a subtle point (para 72):** security features were **not** a
statutory requirement. The damage came from the forms being **inconsistent with
IEBC's own sworn description of them**.

**Verified**: IEBC's refusal to open its servers, and its production of
"pre-downloaded logs in a hard disk whose source it refused to disclose", drew an
express **adverse inference** (para 280).

### 2022 — what the Court rejected, and why

**Verified**, [2022] KESC 56. The failure modes, in order of importance to us:

- **Para 150 — expert evidence destroyed by bad specimens:** "having found that
  the Forms submitted to the experts were not authentic, we find that **the
  forensic reports cannot be used as evidence**." The examiner had been given
  copies, not originals.
- **Para 135 — advocates' affidavits inadmissible:** the forms attached were
  "significantly different from the originals, certified copies and those on the
  Public Portal", and "**none of the agents on whose behalf the Forms were being
  presented swore any affidavit**". The evidence was "not only inadmissible, but
  was also unacceptable".
- **Paras 140–144 — server logs with no provenance:** shown "not genuinely
  sourced from the server" and matching logs tweeted during the **2017**
  petition; held "double hearsay, and incapable of being proved at each layer."
  The dependent expert analysis fell with them.

**Verified, and decisive for this product: the Court did *not* hold portal images
unreliable.** It upheld them because of

> "consistent attributes such as **unique time stamps, uniform PDF conversions at
> the polling stations, correct polling station mapping and consistent KIEMS
> reporting from verification to transmission**"

and because "IEBC demonstrated how KIEMS captured and transmitted the image of
Form 34A". Para 154 found no difference between the portal copies, the National
Tallying Centre copies and the agents' copies.

**Inferred.** That sentence is a specification. A Kenyan court has already told
us what makes image evidence of a Statutory Form credible: consistent
timestamps, a uniform conversion pipeline applied at the point of capture,
correct station mapping, and a demonstrable end-to-end account of how the image
was captured and moved.

### Derived: what an export bundle must contain

**Inferred throughout.** Reasoning from the above, a bundle usable in a
presidential petition needs:

1. **A s.106B(4) certificate**, addressing all four limbs and the s.106B(2)
   conditions, **signed by a named person occupying a responsible position in
   relation to the operation of the system** — not by counsel.
2. **A parallel s.78A(4) correctness certification** by a person in the service
   of the generator.
3. **A secure electronic signature** over the bundle, to obtain the s.106G(1)
   presumption — subject to the KICA definition question above.
4. **The bit-exact Original**, plus every derived version shipped *alongside* it
   with its own hash and a reproducible record of tool, version and
   transformation. Never a derived image in place of the Original.
5. **A per-artefact custody log**: who, what, when, under what authority, hash
   before and after.
6. **A per-Party-Agent sworn attestation.** Para 135 is unambiguous: forms
   presented without an affidavit from the agent who obtained them were
   inadmissible. A company certificate alone will not carry Evidence captured by
   Party Agents.
7. **Relational structure, not a pile of images**: per Polling Station, the 34A
   linked to the 34B row that carries it and the 34C line, with reconciliation
   shown — **including the negative space**: stations with no 34A, 34Bs whose
   34As are missing, gazetted stations unaccounted for.
8. **Per-form integrity attributes** — watermark, serial number, stamp, Presiding
   Officer signature, agent signatures, handover/takeover blocks, and whether the
   subject is an original, a carbon, a photocopy or a scan. This is verbatim the
   checklist the Registrars applied in both petitions.
9. **A cross-check against the gazetted station list.**
10. **Continuous capture during the declaration window**, with the certificate
    pre-drafted and its signatory pre-identified. Seven days to file makes
    after-the-fact assembly impossible.

---

## 6. Forms 34B and 34C

**Verified.** Form 34B is headed "**COLLATION OF PRESIDENTIAL ELECTION RESULTS AT
THE CONSTITUENCY TALLYING CENTRE**" [Reg. 87(1)(a)]. It is a per-station matrix —
reg 83(1)(e) and 87(2)(b) require votes per candidate **in each polling station**
and rejected votes per polling station, plus aggregates.

**Verified, and directly useful:** Form 34B carries a *"Handing Over – Taking Over
at the National Presidential Tallying Centre"* block with

> `Number of FORM 34 A submitted:` … `Number of FORM 34 A received:`

signed by the Constituency Returning Officer and the Commission Chairperson.
**This is the statutory "how many stations are missing" field.**

**Verified.** Form 34C is headed "DECLARATION OF RESULTS FOR ELECTION OF THE
PRESIDENT OF THE REPUBLIC OF KENYA AT THE NATIONAL TALLYING CENTRE"
[Reg. 87(3)(b)]. Form 34D is the "CERTIFICATE OF THE PRESIDENT-ELECT"
[Reg. 87(3)(f)].

**Verified**, reg 87(1)(b): the constituency returning officer delivers "to the
National tallying centre all the Form 34B". **The presidential chain skips the
county entirely**: Polling Station → constituency → national.

---

## 7. Form levels for all six elective positions — the PRD is wrong

**Verified** from each form's own printed title in the Schedule. Independently
reproduced by two separate passes over the same source.

| Position | A — Polling Station | B — **Constituency** Tallying Centre | C | D |
|---|---|---|---|---|
| President | 34A | 34B — Collation | 34C — Declaration, **National** Tallying Centre | 34D — Certificate of President-Elect |
| National Assembly (MP) | 35A | 35B — **Declaration** | 35C — **Certificate** of election | — none — |
| County Assembly (MCA) | 36A | 36B — **Declaration** | 36C — **Certificate** of election | — none — |
| County Governor | 37A | 37B — Collation | 37C — Declaration, **County** Tallying Centre | 37D — Certificate |
| Senator | 38A | 38B — Collation | 38C — Declaration, **County** Tallying Centre | 38D — Certificate |
| County Woman Representative | 39A | 39B — Collation | 39C — Declaration, **County** Tallying Centre | 39D — Certificate |

The PRD (v1.0, §2) is wrong in four ways:

1. **It labels every B form a "County Form". Every B form is produced at the
   constituency tallying centre**, for all six positions.
2. **MP and MCA have no D form**, and their C form is a *certificate of election
   issued by the Constituency Returning Officer* — not a "National Declaration".
3. **Only the President has a national-level form.** Governor, Senator and Woman
   Representative declare at **county** level.
4. The suffix letter is **not semantically stable**: "C" means *declaration* for
   President, Governor, Senator and Woman Rep, but *certificate* for MP and MCA.

**Inferred — three different aggregation depths exist:**
- MP and MCA stop at the constituency.
- Governor, Senator, Woman Rep: Polling Station → constituency → county.
- President: Polling Station → constituency → **national**, skipping the county.

And: **the MCA's electoral area is a Ward, but its B form is completed at the
constituency tallying centre.** Tallying level ≠ electoral area. Any schema
keying aggregation to the electoral area will break on MCA.

---

## 8. What has changed for 2027

**Unverified against primary sources — all of the following is press reporting**
and must be confirmed before it is relied on.

- IEBC reportedly plans to gazette **55,393 polling stations**, up from 46,229 in
  2022 ([Nation](https://nation.africa/kenya/news/iebc-unveils-2027-elections-roadmap-5508144)).
  **If true, design section 5's 46,000-station sizing is ~20% low.**
- The register reportedly stood at ~23.4M in April 2026 against 22.12M in 2022,
  with IEBC projecting ~28.5M by 2027.
- IEBC has floated a tender reported at ~KSh 7bn to replace ageing KIEMS kits,
  retaining ~14,000 units from 2022.
- The **Elections (Amendment) Bill 2024** reportedly sat undebated in Parliament
  for 17 months as of August 2026. If so, the statutory framework is
  substantially as described in §1.
- Gazette Notice No. 13497 of 20 August 2026 reportedly brought the Electoral
  Code of Conduct into force for the 2027 cycle.

**Unverified:** the boundary review status, when the polling station list is
gazetted, and whether 2027 transmission will carry structured data or remain
image-only. The last of these materially affects §4 and should be treated as the
key watch item.

---

## Seed facts — verification results

| Seed fact | Result |
|---|---|
| 46,229 polling stations in 2022 | **Verified** — EU EOM p.35 and Carter Center p.23. 2017 comparator: 40,883 |
| 45,931 in the CitizenGuide CSV; explain the 298 gap | **Unverified** — the dataset has not been retrieved. Deferred to Phase B |
| 700-voter cap per station | **Verified, and the citation located: Elections Act s.38A** — "For the purposes of providing efficient and effective conduct of elections, the number of voters per polling station **shall not exceed seven hundred**." [Act No. 36 of 2016, s.13; Act No. 1 of 2017, s.16]. Note the Revised Edition 2016 contents page misnumbers this as s.39; the body reads 38A. The figure appears **nowhere** in the Elections (General) Regulations |
| 1,111 stations without 3G/4G in 2022 | **Corrected.** 1,111 is polling **centres** (secondary source). The polling **station** figure is **1,272** — EU EOM p.14, citing reg 21 of the Election Technology Regulations |
| Petition: 7 days to file, 14 days to decide | **Verified**, Art 140 — but **the 14 days runs from filing, not declaration**. Worst case 21 days end to end |

---

## Proposed changes

Each item cites the finding that forces it. **Nothing in the design or spec has
been edited yet.**

### P1 — A confirm path for a form that is wrong on its face
*Forced by:* reg 83(1)(b)–(c), which require a returning officer to **disregard**
a station where valid votes exceed registered voters, or total votes exceed
turnout; and by [2022] KESC 56 para 150, where inauthentic specimens destroyed
expert evidence.

A Statutory Form that is arithmetically impossible **as printed** is a different
thing from a Claim that mis-transcribes a sound form. The first is a finding
about the world and is itself evidence; the second is our error. Spec story 8
currently warns the Party Agent when typed counts do not add up, which silently
assumes the second. It needs a path for "I have checked, and the form really does
say this" that records the discrepancy as an attribute of the Capture rather than
blocking it.

### P2 — Registry-driven statutory checks
*Forced by:* reg 83(1)(b)–(c) and Elections Act s.38A.

The Anomaly service should implement the two statutory disregard rules verbatim,
plus the 700-voter cap, because a station tripping them is **legally
disregardable** rather than merely suspicious. All three require registered-voter
counts per Polling Station, which the design does not currently carry. This is
what Phase B's registry is for.

### P3 — Capture-subject metadata and Legibility Check regions
*Forced by:* the §2 field list; the 2017 scrutiny checklist; [2022] KESC 56
para 135.

Every Capture must record **which of the three physical objects it depicts** —
the original Statutory Form, the Party Agent's copy, or the posted copy. The 2017
Registrar's report distinguishes originals, signed carbons, unsigned carbons and
photocopies as materially different evidence; a bundle that cannot say which it
holds is weaker for it.

The Legibility Check's region list should follow the §2 field order, with
priority on the blocks the Registrars actually examined: serial number, the
candidate votes table, the five Polling Station Counts, the Presiding Officer
signature block, the agents' signature table, and the reasons-for-refusal field.

### P4 — A portal reconciliation seam
*Forced by:* [2022] KESC 56, which **upheld** portal images on "unique time
stamps, uniform PDF conversions at the polling stations, correct polling station
mapping"; and EU EOM p.39, real-time publication at `forms.iebc.or.ke`.

The IEBC portal image is the single most authoritative comparison available, and
the Court has already blessed it. The design needs a seam that fetches the portal
image for a Polling Station and compares it against our Capture. Note this object
is **neither Evidence nor a Claim** in our current vocabulary — Phase C must name
it.

### P5 — Form 34B capture
*Forced by:* 2017's nullification turning on Forms 34B "of dubious authenticity";
and Form 34B's statutory `Number of FORM 34A submitted / received` block.

Capturing only Form 34A leaves us unable to reproduce the comparison the Court
actually performs. Form 34B additionally carries the official count of how many
34As a constituency submitted and how many were received — the authoritative
answer to "what is missing". Capture at the constituency tallying centre should
enter the roadmap.

### P6 — Registry versioning bound into the Envelope
*Forced by:* the reported 46,229 → 55,393 change; and the 2022 scrutiny finding
of a form for a station that "did not exist".

A Station Code is meaningless without the registry version it resolves against.
The Envelope should commit to a registry version identifier, so that a Capture
made under the 2027 gazetted list is still interpretable years later. This is
cheap now and impossible to retrofit.

### P7 — Export bundle contents, against the petition clock
*Forced by:* Evidence Act ss.106B(4), 106G, 78A; Art 140; [2022] KESC 56 para 135.

Adopt the ten-item list in §5. Two items change the product, not just the export:
- **A named human must sign the s.106B(4) certificate.** That person must exist,
  be identified in advance, and be reachable within seven days of declaration.
  Under ADR-0002 they are also a coercion target, which should be said out loud.
- **Party Agents must be able to swear to their own Captures.** Para 135 rejected
  forms presented without an affidavit from the agent who obtained them. A
  company certificate is not a substitute. This is a feature, not paperwork.

### P8 — An ingest load curve replacing the flat five-hour assumption
*Forced by:* §4.

Design section 5 assumes 300–400GB arriving evenly over ~5 hours. The real 2022
shape was **>80% within 7 hours**, 97.7–99% by 24 hours, 99.5% by day four, and a
tail that never closed. Capacity planning should target the **hour-3-to-hour-7
peak**, not a flat average, and the system must stay up for **days**, not hours.
Design section 5 should be rewritten against the table in §4.

### P9 — The Seal must qualify as a "secure electronic signature"
*Forced by:* Evidence Act s.106G(1) and (3).

This is the highest-leverage open item in the project. If the Seal meets the
statutory definition, every Envelope carries a rebuttable presumption of
integrity. If it does not, **no presumption arises at all**. The KICA definition
must be read before the Seal format is fixed, and an ADR should record the
outcome either way.

### P10 — The Tally must never be presented as a declaration
*Forced by:* Elections Act s.39(1G) — live-streamed results are "for purposes of
public information only and shall not be the basis for a declaration"; and
Maina Kiai para 161, under which the Polling Station form is the primary
document and all later forms are "only tallies".

CONTEXT.md already separates **Tally** from **Declared Result**. The candidate
dashboard must carry that distinction visibly, not merely in the glossary.

### P11 — Scale
*Forced by:* §8, on secondary sources only.

If 55,393 stations is confirmed, every capacity number in the design and spec is
~20% low. Confirm against the gazette before re-sizing.
