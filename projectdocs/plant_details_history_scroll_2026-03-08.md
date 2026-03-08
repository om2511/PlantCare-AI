# Plant Details History Scroll Update (2026-03-08)

## Objective
Prevent Plant Details page from becoming too long by making Care History and Disease History lists scroll inside their containers when item count increases.

## Changes Applied
- Added conditional scroll flags in `PlantDetails.js`:
  - `careHistoryScrollable` when care logs > 5
  - `diseaseHistoryScrollable` when disease scans > 4
- Applied internal scroll container styles for list blocks:
  - `max-h-[24rem] overflow-y-auto`
- Reduced history item padding slightly for denser display:
  - care cards from `p-4` to `p-3`
  - disease cards from `p-3` to `p-2.5`

## Expected Result
- Short histories render normally.
- Longer histories remain fully accessible through internal scrolling.
- Overall page length stays more controlled.
