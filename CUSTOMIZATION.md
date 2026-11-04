# Fork automation

This fork is configured to poll `docmirror/dev-sidecar` for the newest stable GitHub Release and build that release in `kawauiyi1888/dev-sidecar`.

## Monitoring and publishing

- `.github/workflows/sync-upstream-release.yml` polls every five minutes, which is GitHub-hosted Actions' shortest supported scheduled interval. Schedules can still be delayed by GitHub load.
- A new upstream release is merged into `master`, the fork release hooks are re-applied, and the same `v*` tag is pushed to this fork.
- The workflow explicitly dispatches `.github/workflows/build-and-release.yml` after pushing the tag. This is required because pushes made with `GITHUB_TOKEN` do not start another workflow automatically.
- The existing build matrix produces Windows, macOS, and Linux artifacts. Its update URL is repository-relative, so fork builds point at this fork rather than the upstream repository.
- The inherited `v2.3.5` tag already existed when the fork was created. Run the sync workflow manually once with `release_tag=v2.3.5` and `rebuild_existing=true` to build that version with the fork hooks.

## Optional custom code

Add one or more unified-diff files under `custom/patches/`. They are applied after checkout and before the build on every platform. If no patch exists, the upstream source is used unchanged. A failed or stale patch stops the build instead of silently publishing an unmodified package.

Keep custom behavior in patches rather than editing upstream files directly. The sync workflow preserves fork commits and stops on unresolvable source conflicts; patch files make the intended customization explicit and repeatable.

## Manual operation

Use **Actions → Sync Upstream Release → Run workflow**:

- Leave `release_tag` empty to process the newest stable upstream release.
- Set `release_tag` to a specific `v*` tag to rebuild that release.
- Set `rebuild_existing` only when intentionally replacing an existing fork tag.

The PAT used during setup is not stored in the repository or workflow. Runtime pushes and workflow dispatches use the repository-scoped `GITHUB_TOKEN`.
