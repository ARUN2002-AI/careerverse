/**
 * Career plug-in manifest.
 *
 * This is the ONLY place a career is registered. Adding a career to CareerVerse is exactly:
 *   1. Create `my-career.career.json` next to this file (copy `_template.career.json`).
 *   2. Import it below and add it to `CAREER_SOURCES`.
 *
 * Nothing else in the app changes. The engine, screens, navigation, and state are all
 * career-agnostic — they consume whatever the registry validates and hands back.
 *
 * Sources are typed `unknown`: the registry validates each against `careerDefinitionSchema`
 * at load, so a malformed career fails loudly here rather than corrupting the runtime.
 */

import template from './_template.career.json';

/** Every career the app ships with. Order defines catalogue order until sorted elsewhere. */
export const CAREER_SOURCES: unknown[] = [
  template,
  // Add new careers here, e.g.:
  // softwareDeveloper,
  // uiUxDesigner,
  // dataAnalyst,
];
