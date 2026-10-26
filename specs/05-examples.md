# Acceptance examples — v0.6

All numbers, foods, courses, and titles are illustrative. These examples do not verify the existence of any certification or catalog; they validate software capabilities.

| Example | Activities | Records | Indicators |
| --- | --- | --- | --- |
| Gym | Dated task, exercises as subtasks | Optional notes | Weekly completed-parent-task count |
| Food/weight | Optional activities | Meal: description, date/time, kcal; weight: date/time, kg | Independent daily kcal sum and weight series/latest value |
| Certification | Courses, modules as subtasks, optional exam/certificate milestones | Notes and resource links | Completed courses and required milestone progress |

## E-00 — Journal without goals

Open a day, write a note, create a task, and record an event without further configuration. Later create an “Ideas” collection and link the note. Find it through the index, open the same original from the daily log, and save reflection without an indicator. Keep the pending task without automatic migration.

Traceability: RF-02, RF-13 through RF-16; AC-51, AC-55 through AC-58, AC-61, AC-66 through AC-68.

## E-01 — Gym (illustrative)

Configure a goal, five selected tasks, and a weekly count with target 5. Completing two gives 2/5. Completing exercises under another task without closing its parent does not increase that count. No date, duration, or frequency in this example is mandatory for other goals.

Traceability: RF-08, RF-09; AC-27, AC-28, AC-34, AC-35.

## E-02 — Meals and weight

Create a “Weight tracking” collection without a goal, routine, or mandatory checklist. A goal can be added later. Add a Meal record type with description/kcal and a Weight type with kg. Capturing two meals of 400 and 600 kcal produces 1,000 kcal that day. Recording 80 kg and later 78 kg shows a series and latest value 78, never 158. A day without meals does not appear as zero consumption.

An explicit weight target/baseline may be configured; a calorie target is not mandatory. Correcting the second meal to 500 produces 900 kcal without affecting weight. Calories are entered by the user rather than inferred from the description.

Traceability: RF-01, RF-03, RF-06, RF-09, RF-12; AC-08, AC-11, AC-20, AC-22, AC-32, AC-33, AC-54.

## E-03 — Certification

Create a “Certification preparation” collection and optionally a goal titled “Obtain a Claude certification,” chosen by the user. Record four courses with optional links and modules as subtasks. Select those four courses as training milestones; completing two yields 50%. Discarding another does not increase the percentage. Changing the training plan creates a new set revision.

Training progress is separate from a possible exam-pass or certificate milestone. Courses are not fetched automatically and credentials are not externally validated.

Traceability: RF-08, RF-09, RF-12; AC-26, AC-37, AC-38, AC-39, AC-51.

## E-04 — Composition without templates

A collection can start with notes, incorporate tasks, then add records, indicators, and an optional goal. No single category prevents combining them. Opening each example on mobile and desktop with the same account displays its own data/forms without mandatory gym fields.

Traceability: RF-10, RF-11, RF-12; AC-41, AC-43, AC-51, AC-53.
