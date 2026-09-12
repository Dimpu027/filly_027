# Care Payroll plugin brief

## Identity

- **Backend package:** `care_payroll`
- **Frontend federation package:** `care_payroll_fe`
- **Settings prefix:** `PAYROLL_`
- **i18n prefix:** `payroll__`
- **Frontend preview port:** `4173`
- **Workspace:** this repository; the generated plugin repositories can be moved into
  their corresponding CARE checkouts when integration work begins.

## Product scope

Care Payroll manages staff compensation for a facility or organisation. It stores salary
structures, recurring allowances, recurring deductions, and a period-specific payroll
calculation that can be reviewed before it is finalised. Payroll records must preserve
the inputs used for a calculation so historical payslips do not change when a salary
structure is edited later.

The first vertical slice should support:

1. Defining a salary structure for a staff member, including base salary, allowances,
   and deductions.
2. Creating a monthly payroll run for a facility and calculating gross pay, total
   deductions, and net pay.
3. Reviewing and finalising a run, with a read-only history of finalised results.

Payroll amounts are stored as decimal currency values with an explicit currency code.
The plugin does not process bank transfers, tax filing, or payslip delivery in the first
release.

## Domain and lifecycle

The plugin owns new domain models rather than adding columns to CARE core:

- `SalaryStructure`: staff reference, effective dates, base salary, and component lines.
- `PayrollRun`: facility, pay period, status, and aggregate totals.
- `PayrollEntry`: an immutable calculation snapshot for one staff member in a run.

`PayrollRun` states are `draft`, `under_review`, `finalised`, and `cancelled`.

- Payroll administrators can create runs, calculate entries, request review, finalise,
  or cancel them.
- Facility managers can review runs and request corrections, but cannot finalise them.
- Other authenticated staff have no payroll-management capability.

Finalisation is one-way. Corrections are made by cancelling the affected run and creating
a replacement run; finalised entries are never silently recalculated.

## UI and API decisions

- The frontend is a standalone manifest route at `/payroll`, with a payroll navigation
  item and a run review page. No new CARE core extension point is required for the first
  slice.
- All API routes are namespaced below `/api/care_payroll/`.
- The initial API surface will expose salary structures, payroll runs, run calculation,
  review/finalisation actions, and read-only finalised entries.
- Querysets and actions are scoped by the authenticated user's facility permissions.
- The patient portal is out of scope; payroll is staff-only and does not use OTP
  authentication.
- No third-party service is required. Export and payment integrations can be added later
  behind plugin-owned settings and tasks.

## Core-change policy

No CARE or `care_fe` source changes are planned. The backend will be registered through
`plug_config.py`, and the frontend through `REACT_ENABLED_APPS`. Any future extension
point must remain generic and be justified against the existing manifest route support.

## Verification plan

- Backend unit tests cover salary totals, deductions, run state transitions, immutable
  finalised snapshots, and facility scoping.
- API tests cover authenticated access and forbidden cross-facility access.
- Frontend checks include `npm run build` and a manual review of the `/payroll` route.
- Integration verification will be performed after the plugin is placed in CARE checkouts;
  this scaffold repository does not contain the CARE backend or frontend.
