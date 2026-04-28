# Cloud Memory — Permanent Instructions

## QA Gate Documentation (CRITICAL)

**RULE:** Every time @qa executes `*gate` or `*review` on a story:

1. **ALWAYS create a gate file** in `docs/qa/gates/` with naming convention:
   ```
   {storyId}-{story-slug-title}.yml
   ```
   Example: `1.1-static-wallpaper-selection-application.yml`

2. **Gate file MUST include:**
   - YAML header: `schema`, `story`, `gate`, `status_reason`, `reviewer`, `updated`, `top_issues`, `waiver`
   - Full "Quality Gate Results" section with verdict
   - All 7 quality checks breakdown (Code Review, Unit Tests, AC, Regressions, Performance, Security, Documentation)
   - File List validation
   - Known deferrals table
   - Next steps
   - References section

3. **NEVER leave the gate info only in the story file** — that's not a proper gate. The story file QA Results section is a SUMMARY. The gate file is the OFFICIAL RECORD.

4. **Story status update (MANDATORY):**
   - After gate PASS: Update story status to `InReview` (not Done — Done is for after @devops pushes)
   - Add Change Log entry: `"✅ QA GATE PASS - {date} - Approved by @qa (Quinn)"`

5. **Gate file storage:** Always `docs/qa/gates/` — this is where all gate records live

## Why This Matters

- Gate files are the audit trail for code quality decisions
- They prove to stakeholders what was verified before merge
- They're referenceable in reviews, retrospectives, and incident analysis
- Story file QA sections are summaries; gate files are the detailed source of truth

---

**Created:** 2026-04-28  
**Context:** User requested formal gate documentation for Story 1.1 to prevent rework
