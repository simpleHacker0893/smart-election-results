# Tech stack research — primary sources

Date: 2026-09-18
Method: direct fetch of first-party documentation, specifications and RFCs.
Every claim is labelled **Verified** (the source states it), **Inferred**
(reasonable reading, not stated outright) or **Unverified** (could not confirm
from a primary source in this pass).

> Note on provenance: three background research agents were dispatched for this
> and all three stalled without producing output. The findings below were
> gathered directly. Question 4 (React Native vs Kotlin) is consequently thinner
> than the others and is flagged accordingly.

---

## 1. Android hardware-backed keys and key attestation

Sources:
- https://developer.android.com/privacy-and-security/security-key-attestation
- https://source.android.com/docs/security/features/keystore/attestation
- https://source.android.com/docs/core/ota/modular-system/remote-key-provisioning

### Security levels

**Verified.** The AOSP keystore attestation page defines three `SecurityLevel`
values:

- **Software** — "Secure as long as the device's Android system complies with
  the Android Platform Security Model (that is, the device's bootloader is
  locked and the verifiedBootState is Verified)."
- **TrustedEnvironment** — "Secure as long as the TEE is not compromised… TEEs
  are highly resistant to remote compromise and moderately resistant to
  compromise by direct hardware attack."
- **StrongBox** — "Secure as long as StrongBox is not compromised… highly
  resistant to remote compromise and compromise by direct hardware attack."

**Verified.** The developer guidance instructs checking that
`attestationSecurityLevel` "is set to the `TrustedEnvironment` security level or
to the `StrongBox` security level."

### API levels

**Verified.** Hardware-level key attestation requires Android 7.0 (API 24) or
higher. "Note that attestation was not required until Android 8.0 (API level
26)."

### Where attestation fails — the critical finding

**Verified.** Two documented failure cases, quoted from the developer page:

> "Most likely, the device launched with an Android version less than 7.0 and it
> doesn't support hardware attestation. In this case, Android has a software
> implementation of attestation that produces the same sort of attestation
> certificate, but signed with a key hardcoded in Android source code. **Because
> this signing key isn't a secret, the attestation might have been created by an
> attacker pretending to provide secure hardware.**"

> "The other likely reason is that the device isn't a Google Play device. In
> that case, **the device maker is free to create their own root certificate and
> to define the meaning of their attestation data.**"

**Inferred.** This is decisive for a fleet of cheap personal handsets. A valid
attestation chain proves nothing unless it is verified to chain to *Google's*
attestation root specifically. An OEM-rooted chain is, by Google's own wording,
whatever that OEM decided it means. It follows that the Verifier must pin the
Google attestation root and treat any other root as an unattested capture.

### Key description and root of trust

**Verified.** The `KeyDescription` SEQUENCE carries `attestationVersion`,
`attestationSecurityLevel`, `keyMintVersion`, `keyMintSecurityLevel`,
`attestationChallenge`, `uniqueId`, and separate `softwareEnforced` and
`hardwareEnforced` authorization lists. The `RootOfTrust` structure includes
`verifiedBootState` with values Verified, SelfSigned, Unverified or Failed.

**Verified.** The `hardwareEnforced` list "is enforced by the device's Trusted
Execution Environment (TEE) or StrongBox… is not controlled by the platform."

**Unverified.** Neither page documents the full third-party offline chain
verification procedure, nor what the chain roots to in explicit terms. This
needs confirmation before the Verifier is built.

### Remote Key Provisioning

**Verified.** RKP "has been a part of AOSP since Android 12," redesigned in
Android 14 as a Mainline module (`com.android.rkpd`).

**Unverified.** The documentation does not state whether RKP is mandatory for
manufacturers, and does not document implications for offline or long-term
verification of attestation chains. Both matter to us and neither is answered.

---

## 2. Reusable append-only transparency log implementations

Sources:
- https://www.rfc-editor.org/rfc/rfc9162.html
- https://github.com/google/trillian
- https://github.com/transparency-dev/tessera
- https://docs.sigstore.dev/logging/overview/

### RFC 9162 does not solve the problem we are using it for

**Verified.** RFC 9162 defines the Merkle tree, Signed Tree Head, inclusion
proof and consistency proof. A consistency proof demonstrates the append-only
property by proving "that the first m inputs D[0:m] are equal in both trees."

**Verified, and important.** The RFC states plainly:

> "The log auditing mechanisms described in this document can be circumvented by
> a misbehaving log that shows different, inconsistent views of itself to
> different clients. **Therefore, it is necessary to treat each log as a trusted
> third party.**"

It adds that mechanisms addressing this "are outside the scope of this
document."

**Inferred.** A transparency log on its own does **not** defend against a
dishonest insider or a coerced operator — the precise threat we adopted. Split
view is exactly the attack a compelled log operator would mount. Witness
cosigning is therefore structural to this design, not an enhancement.

### Trillian is in maintenance mode

**Verified.** "Trillian is in maintenance mode." It is no longer accepting new
features, and the maintainers recommend that "any new log operators first try
Tessera instead." Storage is MySQL/MariaDB; architecture is a gRPC microservice
plus application-specific "personalities."

### Tessera

**Verified.** Tessera is "a Go library for building tile-based transparency logs
(tlogs)," described as "the logical successor to the approach Trillian v1 takes."
It is a library rather than a microservice, so there are "no additional services
to manage." Storage drivers exist for **GCP, AWS and POSIX filesystem**.
Production ready since the Beta (v0.2.0) release. Reports "broadly similar
write-throughput and write-availability, and potentially far higher
read-throughput and read-availability compared to Trillian v1."

**Verified, and decisive.** Tessera "integrates witnesses via the C2SP Witness
Protocol," letting operators configure policies specifying which witnesses must
cosign checkpoints **before publication**.

**Inferred.** This maps directly onto the Log Witness requirement. The witness
policy is the mechanism that closes the split-view gap RFC 9162 leaves open, and
it is already built rather than something we would design.

### Rekor

**Verified.** Rekor is Sigstore's signature transparency log, self-hostable,
with inclusion proofs and consistency monitoring, and a public instance at a
99.5% availability SLO. Auditing tooling includes Rekor Monitor and
**Omniwitness** (from the Trillian authors).

**Inferred.** Rekor is shaped around software supply-chain artifacts. For a
general-purpose evidence log, Tessera is the better fit; Rekor's value here is
mainly as prior art for verification UX.

---

## 3. Trusted time without a trustworthy device clock

Sources:
- https://www.rfc-editor.org/rfc/rfc3161.html
- https://csrc.nist.gov/projects/interoperable-randomness-beacons
- https://docs.drand.love/developer/http-api/

### RFC 3161 — the not-after bound

**Verified.** A time-stamp token binds a `messageImprint` (hash algorithm OID
plus hash value) to a `genTime`, proving the datum existed before that time.
`TSTInfo` carries version, policy, messageImprint, serialNumber, genTime, and
optional accuracy and nonce.

**Verified.** Independent later verification requires: verifying the TSA
signature, checking certificate validity **at the timestamp date**, validating
the messageImprint, confirming the nonce if one was sent, and checking
certificate revocation status via CRL.

**Verified.** The TSA must use "a trustworthy source of time," include "a unique
integer for each newly generated time-stamp token," and sign with "a key
generated exclusively for this purpose."

**Verified.** On long-term trust: "any token signed by the TSA SHOULD be
time-stamped again (if authentic copies of old CRLs are available) or notarized
(if they aren't) at a later date to renew the trust that exists in the TSA's
signature."

**Inferred.** CRL availability years later is a real operational burden. Archived
CRLs must be retained alongside Evidence, or verification degrades over time.

### NIST Randomness Beacon — a not-before candidate

**Verified.** Publishes pulses "e.g., once a minute," each with "a fresh 512-bit
random string, cryptographically combining entropy from at least two separate
random number generators." Each pulse carries an index, timestamp, signature,
and forms a hash chain. "Any past pulse is publicly accessible." "Far-apart
pulses can be efficiently verified via a short chain (skiplist)."

**Verified warning.** "WARNING: Do NOT use Beacon generated values as
cryptographic secret keys!"

**Inferred.** That warning does not apply to our use, which treats the value as
a public commitment, not key material.

**Verified.** No availability SLA is documented; the page notes that maintaining
a high-availability public interface is "challenging."

### drand — the other not-before candidate

**Verified.** Public League of Entropy mainnet relays: `api.drand.sh`,
`api2.drand.sh`, `api3.drand.sh`, `drand.cloudflare.com`, and
`api.drand.secureweb3.com:6875`. A round response contains `round`,
`randomness`, `signature` and `previous_signature`. Only the `drand.sh` relays
support the v2 API; all support v1. Past rounds are fetchable by number, e.g.
`/v2/beacons/quicknet/rounds/42`.

**Unverified.** Round period for mainnet and quicknet, the chain hash and public
key retrieval via `/info`, the signature scheme, and whether a past round can be
verified fully offline given cached chain info. The concepts page 404'd and the
HTTP API page does not cover `/info`. **This needs a second pass before drand is
chosen over the NIST beacon.**

---

## 4. React Native vs native Kotlin

**Not researched against primary sources.** The background agent assigned to
this stalled and it was deprioritised behind questions 1–3.

**Inferred** from the attestation findings: key generation with an attestation
challenge, reading the resulting certificate chain, and pinning the Google
attestation root are all Android Keystore operations with no JavaScript surface,
so a native module is unavoidable regardless of framework. Given that the
security-critical path, the camera path and the BLE co-signing path would all be
native modules, the case for React Native is weak here.

**Open.** APK size and memory behaviour on Android Go, and CameraX/WorkManager
behaviour under React Native, are unconfirmed.

---

## 5. Resumable upload

Source: https://tus.io/protocols/resumable-upload

**Verified.** Core operations are HEAD (returns `Upload-Offset` for progress),
PATCH (resumes from offset, `Content-Type: application/offset+octet-stream`),
and POST (creates the upload via the Creation extension). The client must
persist **the upload URL and the current byte offset**. An offset mismatch
returns `409 Conflict`, preventing corruption from concurrent requests.

**Verified.** Extensions: Creation, Checksum (mismatch returns `460 Checksum
Mismatch` and discards the chunk), Concatenation (parallel partial uploads), and
Expiration (`Upload-Expires`).

**Verified.** On unstable connections the spec is modest: both parties "SHOULD
attempt to detect and handle network errors predictably."

**Inferred.** The Checksum extension matters to us specifically — it detects a
corrupted chunk at upload time rather than leaving a silently damaged Original
to fail verification later.

---

## 6. On-device image legibility assessment

Sources:
- https://developers.google.com/ml-kit/vision/doc-scanner
- https://developers.google.com/ml-kit/vision/doc-scanner/android
- https://developers.google.com/ml-kit/vision/text-recognition/v2/android
- https://developer.android.com/ndk/guides/neuralnetworks/migration-guide
- https://docs.opencv.org/4.x/ (Android tutorials, imgproc, core)
- https://developer.android.com/reference/android/hardware/camera2/ (see provenance note)

> **Provenance.** Most of this section comes from a delegated research pass. The
> claims marked *confirmed directly* were re-fetched and verified independently.
> The Camera2 metadata claims are marked *reported* — the Android API reference
> pages render client-side and could not be re-fetched, so they must be
> confirmed on a device or in Android Studio before being relied on. They are
> cheap to confirm and load-bearing, so confirm them.

### ML Kit Document Scanner is disqualified — on four independent grounds

**Verified, confirmed directly.** "It also requires a minimal device total RAM
of **1.7GB**. If lower, it returns an `MlKitException` with error code
`UNSUPPORTED`." Android Go handsets routinely ship with 1GB or 2GB. On a
meaningful slice of the target fleet this API simply fails.

**Verified, confirmed directly.** Minimum API level 21; "~300KB download size
increase."

**Verified, confirmed directly.** There is no documented API returning the
original unmodified camera frame. `GmsDocumentScanningResult` exposes only
`getPages()` and `getPdf()`, and pages are the *processed* output — the
overview's own gallery captions them as "Scanned document with perspective
corrected, wrinkle removed and grayscale filter applied."

**Verified (reported).** "No camera permission is required — the document
scanner leverages the Google Play services' camera permission." Your app never
touches the sensor, so it cannot capture or hash a raw frame at all. Separately,
"users are in control of which files to share back with your app," and
`setGalleryImportAllowed()` can admit arbitrary gallery files — a provenance
hole in an evidence system.

**Verified (reported).** Delivery is Play-services-only: the installation-path
matrix lists Document Scanner under *Unbundled* alone, with no bundled option.
"Until the download is completed, inference requests will fail." So first use
requires connectivity, on a product designed for agents who may have none.

**Verdict.** It is a user-facing scanning product, not a quality-assessment
library, and it is incompatible with an original-bytes evidence chain. Not
usable, not even as a fallback.

### The cheapest credible gate is the Android platform itself

**Reported, needs confirmation.** Camera2 exposes categorical 3A state that
costs nothing and ships everywhere:

- `CONTROL_AF_STATE` — "if AF state becomes FOCUSED, then the image data
  associated with this result should be sharp," reportedly available **on all
  devices including LEGACY**. `FOCUSED_LOCKED` is the shutter gate;
  `NOT_FOCUSED_LOCKED` is the documented "retake, it's blurry" trigger.
- `CONTROL_AE_STATE` — "if AE state becomes CONVERGED, then the image data
  associated with this result should be good to use," reportedly LIMITED+ only.
  `FLASH_REQUIRED` is a documented "too dark" signal.
- `LENS_INFO_MINIMUM_FOCUS_DISTANCE` — reportedly 0 for fixed-focus cameras.
  Check at startup: on a fixed-focus handset, AF gating is meaningless and the
  gate must fall back to pixel analysis.

**Reported, and a useful mitigating fact.** "Devices that initially shipped with
Android version Q or newer will not include any LEGACY-level devices." Anything
shipped from 2019 onward is LIMITED or better, so `CONTROL_AE_STATE` is
available on most of the realistic fleet.

**Reported, important.** The string `SHARPNESS` appears nowhere in
`CaptureResult` or `CameraCharacteristics`. There is no numeric image-quality
field in Camera2 at all. The only platform focus signal is the categorical
`CONTROL_AF_STATE`; any numeric sharpness measure must be computed from pixels.

### A concrete legibility floor, from ML Kit's own input guidance

**Verified (reported), and the most directly useful number found.** Google's
Text Recognition v2 input guidance: "Ideally, each character should be at least
16x16 pixels… no accuracy benefit for characters to be larger than 24x24
pixels… To scan a document printed on letter-sized paper, a 720x1280 pixel image
might be required." And: "Poor image focus can affect text recognition accuracy.
If you aren't getting acceptable results, try asking the user to recapture the
image."

**Inferred.** This gives the Legibility Check a defensible, externally-sourced
resolution requirement rather than an invented threshold — useful in itself when
justifying the gate to a court.

**Verified (reported).** Text Recognition v2 supports **both** bundled and
unbundled delivery, unlike the Document Scanner, so it can ship inside the APK
and run with no network and no model download. Bundled cost: "About 4 MB size
increase per script per architecture." Minimum API 23. (Note: the page's own
auto-generated summary box says API 21, contradicting its body text. Trust 23.)

### OpenCV carries a real size tax, and does not document what everyone assumes

**Artifact-measured (reported), not documented.** OpenCV publishes no APK size
statement anywhere. Measured from official release binaries: the Maven Central
AAR is ~118MB, of which `armeabi-v7a` is 14.9MB uncompressed / **7.4MB
compressed** and `arm64-v8a` is 22.4MB / **8.9MB compressed**. So a naive
dependency adds roughly 7–9MB compressed per ARM ABI.

**Verified (reported), and worth knowing.** Variance-of-Laplacian is **not** an
OpenCV-documented technique. It appears in no OpenCV documentation; it comes
from the academic literature and third-party tutorials. OpenCV documents only
the primitives you compose yourself — `Laplacian`, `meanStdDev`, and
`sqrBoxFilter` (documented as "useful in computing local image statistics such
as the local variance and standard deviation around the neighborhood of a
pixel," which is the route to "one corner is out of focus").

**Inferred.** At this scale OpenCV buys convenience, not capability. A
Laplacian-variance and mean/stddev pass over a 320×240 grayscale buffer is a
small amount of hand-written code. Taking an 7–9MB per-ABI hit on an Android Go
handset to avoid writing it is a poor trade.

### Acceleration: do not plan on it

**Verified, confirmed directly.** "The Neural Networks API (NNAPI)… was
introduced in Android 8.1… and **deprecated in Android 15**." Migration path is
TensorFlow Lite in Google Play Services, optionally the TFLite GPU delegate.

**Verified (reported).** LiteRT's only published Android benchmarks are Pixel 3
and Pixel 4, CPU at 4 threads "with CPU affinity set to use big cores to reduce
variance." Many Android Go SoCs have no big cores, so those figures do not
transfer. Google publishes no benchmark for any Android Go or sub-$80 device,
and no latency figure for any ML Kit API on any named device.

**Verified (reported).** Google publishes no first-party mobile blur or
image-quality model. The only Google image-quality model found is MUSIQ on
Kaggle — an *aesthetic* scorer trained on AVA, TensorFlow 2 only with no
LiteRT variant, and a full transformer over full-resolution input. Unsuitable.

---

## 7. Camera control for low-light capture

Source: https://developer.android.com/media/camera/camera-extensions

**Verified.** Night extension "brightens photos in low-light situations by
taking several photos at various exposure values and merging them," and "can
take several seconds, requiring the user to hold the phone still." Auto may
switch to Night in low light. HDR widens exposure range.

**Verified.** "Not all devices support extensions, and even if a device has
extensions support, it does not support all extensions." Extensions are
available for preview and image capture only, not video.

**Inferred, and an evidentiary problem nobody would catch later.** Night mode
output is a **computational composite of several frames**, not a photograph of a
moment. For evidence, that is a liability: opposing counsel can accurately say
the image was synthesised by merging multiple exposures, and no single instant
is depicted. The evidentiary Original should be a genuine single-frame capture.
A Night-mode frame may be captured *additionally*, as an aid to human reading,
but must be stored as a separate derived artifact and never as the Original.

---

## 8. Data residency and infrastructure in Africa

Sources:
- https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html
- https://aws.amazon.com/about-aws/global-infrastructure/localzones/locations/

**Verified.** The complete AWS region table lists exactly **one** African region:

| Code | Name | AZs | Geography | Opt-in status |
|---|---|---|---|---|
| af-south-1 | Africa (Cape Town) | 3 | South Africa | Required |

There is **no AWS Region in Kenya**. `af-south-1` is also disabled by default
and must be explicitly enabled on the account.

**Verified.** AWS Local Zones list Nairobi under **Announced**, not generally
available:

> "Nairobi, Kenya. Zone Name: af-south-1-nbo-1a Parent Region: Africa (Cape
> Town)"

Johannesburg is likewise Announced only.

**Inferred.** Three consequences. The PRD's claim that "all data stored in
Kenya (AWS Africa region)" is false as written. Even once the Nairobi Local Zone
ships, its parent region is Cape Town, so a Local Zone does not by itself deliver
Kenyan data residency. And South African hosting places the data under South
African jurisdiction, which is a different legal exposure — worth noting that
this partially *satisfies* the jurisdictional-separation requirement while
contradicting the residency claim. Those two goals remain in genuine tension.

---

## Recommendations

| Area | Recommendation | Basis |
|---|---|---|
| Transparency log | **Tessera**, not Trillian, not Rekor | Trillian is in maintenance mode and its maintainers point new operators at Tessera; Tessera ships AWS/GCP/POSIX drivers and is a library, not a service to operate |
| Witnessing | **C2SP Witness Protocol** via Tessera's cosign policy | RFC 9162 explicitly leaves split-view unsolved and says a log must be treated as a trusted third party; witness cosigning before publication is what closes it |
| Not-after time | **RFC 3161 TSA**, with archived CRLs retained alongside Evidence | Verification requires cert validity at timestamp date plus CRL status; without archived CRLs the proof decays |
| Not-before time | **NIST Beacon confirmed; drand pending** | NIST's structure, cadence and past-pulse verification are documented; drand's period and offline verification could not be confirmed and need a second pass |
| Capture app | **Native Kotlin** | Keystore, attestation, camera and BLE are all native surfaces; the case for a JS layer is weak (note: inferred, not researched) |
| Evidentiary frame | **Single-frame capture; Night mode excluded from the Original** | Night mode is a documented multi-exposure composite, which is attackable in cross-examination |
| Legibility gate, tier 1 | **Camera2 `CONTROL_AF_STATE` / `CONTROL_AE_STATE` gating** | Free, categorical, reportedly available on all devices; the only focus signal the platform guarantees |
| Legibility gate, tier 2 | **Hand-written Laplacian variance + histogram on a downscaled copy**, after the Original is written and hashed | No numeric sharpness field exists in Camera2; OpenCV costs 7–9MB per ABI for primitives worth a few dozen lines |
| Legibility gate, tier 3 | **ML Kit Text Recognition v2, bundled**, as legibility confirmation only | The only ML option that ships inside the APK and runs with no network; use it to confirm the form header and digits are readable, not to detect blur |
| ML Kit Document Scanner | **Excluded entirely** | 1.7GB RAM floor fails on Android Go; returns only processed pages, never the original; the app never touches the camera; unbundled-only so first use needs network |
| ML acceleration | **Assume CPU; do not design for NNAPI or GPU** | NNAPI deprecated in Android 15; no documented low-end GPU availability floor; no published benchmark for any Go-class device |
| Upload | **tus, with the Checksum extension** | Client state is just URL plus offset; checksum catches corruption at upload rather than at verification |
| Hosting | **af-south-1 (Cape Town)**, and drop the Kenya residency claim | It is the only African region; Nairobi is an announced Local Zone whose parent region is Cape Town |

## Questions primary sources could not answer

These need a spike or field testing, not more reading.

1. **What fraction of the actual target fleet produces a Google-rooted
   attestation chain?** No documentation can answer this. It requires buying a
   representative sample of the handsets Kenyan agents actually carry and
   measuring. This is the single highest-value spike in the project — it
   determines what proportion of Evidence carries the strong guarantee.
2. **Does the attestation chain verify offline, years later, and against what
   root?** Not documented on either Android page. Must be established
   empirically before the Verifier is specified.
3. **Is RKP mandatory, and what does it do to long-term chain verification?**
   Undocumented and directly relevant to evidence that must outlive the device.
4. **drand round period and offline verifiability.** Second research pass.
5. **Confirm the Camera2 metadata claims on a device.** `CONTROL_AF_STATE`
   availability on all devices including LEGACY, `CONTROL_AE_STATE` being
   LIMITED+, and the absence of any `SHARPNESS` key could not be re-verified
   because the Android API reference renders client-side. The entire tier-1
   legibility gate rests on these, and they are confirmable in Android Studio in
   minutes. Do it before building on them.
6. **Real legibility failure rates** for Form 34A under actual polling-station
   lighting on actual handsets. Needs a photographed corpus, not a spec.
7. **Does bundled ML Kit run on a device with no Google Play services at all?**
   Google frames the bundled-vs-unbundled choice as network-vs-no-network and
   never addresses non-GMS devices. Given the fleet, this needs physical
   testing, not a documentation answer.
8. **Behaviour of tus at the counting-night spike profile** — roughly 46,000
   concurrent clients on poor links. Needs a load test.
