# Experience — Video Task (To Be Added Later)

## What this is
A deferred feature for the Creator Recruitment Form.
The video task section was intentionally removed on **2026-04-06** and will be re-added when ready.

---

## What needs to be built

### Section: "The Task" 🎬
Insert this as a new step **right after Section 04 — Experience Level**.

**Step title:** The Task.
**Step subtitle:** This is where the magic happens. Don't overthink it — just go.

### Mission box (dark card)
Display a black card with lime heading "⚡ YOUR MISSION" and these bullet points:
- Record a short video (10–20 seconds)
- Speak directly to the camera
- Pick ANY product near you (coffee, phone, notebook…)
- Try to "promote" it — make it fun & natural

### Upload / Link field (required)
- Label: "Upload your video link *"
- Upload zone: tap to upload (accepts video/*)
  - Supported: Google Drive · Dropbox · iCloud · any shareable link
- OR divider
- URL input: `id="video-link"` placeholder `https://drive.google.com/...`
- Hint: "Make sure the link is accessible to anyone."
- Error: "Please provide a video link or upload."

---

## How to re-add it

1. Increment `totalSteps` from **6 → 7** in the `<script>`.
2. Add a 7th `<div class="step-dot">` to the steps-nav.
3. Insert the new section pane **between step-3 (Experience) and step-4 (Availability)** with `id="step-4"`.
4. Shift the current step-4 (Availability) → `id="step-5"` and step-5 (Final) → `id="step-6"`.
5. Update section numbers accordingly (currently 05/06 → 06/07, 06/06 → 07/07).
6. Add the video validation block back to `validateStep()` for `step === 4`.
7. Update `submitForm()` to call `validateStep(6)`.
8. Re-add the `handleFileUpload()` function if removed.

---

## Conditional blocks on Experience step (optional enhancement)
When the user selects **Yes** → show a block asking them to share 1–3 links to their best videos.
When the user selects **No** → show a message: *"No worries! You'll be asked to complete a short test task in the next section."*
