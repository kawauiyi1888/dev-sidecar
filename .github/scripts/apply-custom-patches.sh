#!/usr/bin/env bash
set -euo pipefail

cd "${GITHUB_WORKSPACE:-.}"
patch_dir="custom/patches"

if [[ ! -d "$patch_dir" ]]; then
  echo "No custom patch directory; using the upstream source unchanged."
  exit 0
fi

patches=()
while IFS= read -r patch; do
  [[ -n "$patch" ]] && patches+=("$patch")
done < <(find "$patch_dir" -maxdepth 1 -type f -name '*.patch' -print | LC_ALL=C sort)
if (( ${#patches[@]} == 0 )); then
  echo "No custom patches; using the upstream source unchanged."
  exit 0
fi

for patch in "${patches[@]}"; do
  echo "::group::Applying custom patch ${patch}"
  git apply --check --whitespace=error "$patch"
  git apply --whitespace=error "$patch"
  echo "::endgroup::"
done

git diff --check
echo "Applied ${#patches[@]} custom patch(es)."
