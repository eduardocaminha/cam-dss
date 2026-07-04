#!/bin/bash
# Pre-commit quality gate template for cam-dss consumer projects.
# Triggered by: PreToolUse hook on "git commit" (register in .claude/settings.json).
#
# Unlike this repo's own .claude/hooks/pre-commit-check.sh, there is no
# registry validate step here - consumer projects consume cam-dss's
# registry, they don't own one. Adjust the STAGED grep / commands below
# to match the consumer project's actual file extensions and package
# manager if it differs from pnpm.
#
# No `set -e`: a bare failing command on its own line would trigger
# errexit before the explicit `if [ $? -ne 0 ]` check below it ever runs,
# so the underlying command's own exit code (not necessarily 2) would
# propagate instead of the intended blocking exit 2.

RED="\033[0;31m"
GREEN="\033[0;32m"
NC="\033[0m"

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
  echo -e "${RED}pre-commit-check: not inside a git repo.${NC}" >&2
  exit 2
fi

cd "$REPO_ROOT" || {
  echo -e "${RED}pre-commit-check: cannot cd to $REPO_ROOT${NC}" >&2
  exit 2
}

echo "Checking types..."
npx tsc --noEmit --pretty 2>&1
if [ $? -ne 0 ]; then
  echo -e "${RED}Type errors found. Fix before committing.${NC}"
  exit 2
fi

echo "Linting staged files..."
STAGED=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -E '\.(ts|tsx)$' || true)
if [ -n "$STAGED" ]; then
  npx eslint $STAGED --quiet 2>&1
  if [ $? -ne 0 ]; then
    echo -e "${RED}Lint errors. Fix before committing.${NC}"
    exit 2
  fi
fi

echo -e "${GREEN}All checks passed.${NC}"
exit 0
