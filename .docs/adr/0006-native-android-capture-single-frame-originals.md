# Native Android capture, with single-frame Originals

The Capture app is native Android, not React Native and not a PWA, and the
evidentiary Original is a genuine single-frame capture with Night mode excluded.

## Why not a PWA or React Native

Web crypto cannot reach Android Keystore, so a PWA can do neither hardware-backed
signing nor attestation. Key generation with an attestation challenge, reading the
resulting certificate chain, camera control and BLE co-signing are all native
surfaces, so under React Native every security-critical path would be a native
module anyway. The Candidate's read-only dashboard may still be a PWA, as it holds
no key material.

This deviates from the source PRD, which specifies React Native with Expo in its
stack table (while its architecture section specifies native Swift and Kotlin —
the PRD contradicts itself here).

## Why Night mode is excluded from the Original

Android documents the Night extension as "taking several photos at various
exposure values and merging them." That output is a computational composite of
several frames, not a photograph of a moment. Opposing counsel could accurately
state that the image was synthesised from multiple exposures and depicts no single
instant. A Night-mode frame may be captured additionally as an aid to human
reading, but it is stored as a derived artifact and never as the Original.

## Consequences

iOS is out of scope for Capture. The fleet is Android, and a second native client
is cost without coverage.
