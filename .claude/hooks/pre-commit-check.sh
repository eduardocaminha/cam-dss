#!/bin/bash
# Pre-commit quality gate - blocks commit if checks fail (exit 2)
# Triggered by: PreToolUse hook on "git commit"
#
# No `set -e` here: a bare failing command on its own line would trigger
# errexit before the explicit `if [ $? -ne 0 ]` check below it ever runs,
# so tsc's own exit code (not necessarily 2) would propagate instead of
# the intended blocking exit 2. Each step checks its own exit status.

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

# Step 1: TypeScript type check
echo "Checking types..."
npx tsc --noEmit --pretty 2>&1
if [ $? -ne 0 ]; then
  echo -e "${RED}Type errors found. Fix before committing.${NC}"
  exit 2
fi

# Step 2: ESLint on staged files
echo "Linting staged files..."
STAGED=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -E '\.(ts|tsx|mjs)$' || true)
if [ -n "$STAGED" ]; then
  npx eslint $STAGED --quiet 2>&1
  if [ $? -ne 0 ]; then
    echo -e "${RED}Lint errors. Fix before committing.${NC}"
    exit 2
  fi
fi

# Step 3: registry.json validity
echo "Validating registry.json..."
npx shadcn@latest registry validate 2>&1
if [ $? -ne 0 ]; then
  echo -e "${RED}registry.json is invalid. Fix before committing.${NC}"
  exit 2
fi

echo -e "${GREEN}All checks passed.${NC}"
exit 0
