import fs from 'node:fs'

const workflowPath = '.github/workflows/build-and-release.yml'
const patchCommand = 'bash .github/scripts/apply-custom-patches.sh'
const upstreamReleaseBase = 'https://github.com/docmirror/dev-sidecar/releases/download/v'
const forkReleaseBase = 'https://github.com/${{ github.repository }}/releases/download/v'
const patchStep = [
  '      - name: "Apply custom patches"',
  '        shell: bash',
  `        run: ${patchCommand}`,
  '',
].join('\n')

let workflow = fs.readFileSync(workflowPath, 'utf8')
let changed = false

if (!workflow.includes(patchCommand)) {
  const setupMarker = '      - name: "Setup pnpm"\n'
  const setupIndex = workflow.indexOf(setupMarker)
  if (setupIndex === -1) {
    throw new Error(`Cannot find the Checkout/Setup pnpm boundary in ${workflowPath}`)
  }
  workflow = `${workflow.slice(0, setupIndex)}${patchStep}${workflow.slice(setupIndex)}`
  changed = true
}

if (workflow.includes(upstreamReleaseBase)) {
  workflow = workflow.replaceAll(upstreamReleaseBase, forkReleaseBase)
  changed = true
}

const publishUrlLines = [...workflow.matchAll(/^\s*VUE_APP_PUBLISH_URL:\s*(.+)$/gm)]
if (publishUrlLines.length === 0) {
  throw new Error(`Cannot find VUE_APP_PUBLISH_URL in ${workflowPath}`)
}
if (publishUrlLines.some((match) => !match[1].includes('${{ github.repository }}'))) {
  throw new Error(`At least one VUE_APP_PUBLISH_URL is not repository-relative in ${workflowPath}`)
}

if (changed) {
  fs.writeFileSync(workflowPath, workflow)
  console.log(`Prepared ${workflowPath} for fork releases.`)
} else {
  console.log(`${workflowPath} already contains the fork release hooks.`)
}
