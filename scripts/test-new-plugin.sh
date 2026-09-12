#!/usr/bin/env bash
#
# Focused smoke test for the plugin materializer.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

"$ROOT/scripts/new-plugin.sh" \
  --name payroll \
  --title "Care Payroll" \
  --description "Payroll smoke test" \
  --out "$TMP" \
  --port 4199 >/dev/null

test -d "$TMP/care_payroll"
test -d "$TMP/care_payroll_fe"
! grep -R --include='*' -E '__PLUGIN_|__I18N_PREFIX__' \
  "$TMP/care_payroll" "$TMP/care_payroll_fe"
grep -q 'PAYROLL_ENABLED' "$TMP/care_payroll/care_payroll/settings.py"
grep -q 'payroll__page_title' "$TMP/care_payroll_fe/public/locale/en.json"
grep -q '4199' "$TMP/care_payroll_fe/vite.config.ts"

echo "new-plugin smoke test passed"
