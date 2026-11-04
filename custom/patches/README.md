# Custom release patches

Put optional Git patches in this directory. Every `*.patch` file is applied in lexical filename order after checkout and before dependency installation in every release build job.

Rules:

- Paths in a patch are relative to the repository root.
- A patch that does not apply cleanly fails the build; the release is not published.
- Keep patches small and independent. Use a numeric prefix when order matters, such as `010-change-default.patch`.
- Do not put tokens, passwords, certificates, or other secrets in this directory. It is committed to the public fork.
- The patch is applied only in the CI workspace. The upstream-sync workflow does not commit patched source back to `master`.

Example generation command:

```bash
git diff --binary upstream/master -- path/to/file > custom/patches/010-change-file.patch
```

An empty directory means the upstream source is built unchanged.
