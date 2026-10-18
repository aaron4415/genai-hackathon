param([string]$Output)
$ErrorActionPreference = 'Stop'
$demoRoot = $PSScriptRoot
$appRoot = Join-Path $env:LOCALAPPDATA 'Programs/Open Design/resources/app'
$renderer = Join-Path $appRoot 'node_modules/hyperframes/bin/hyperframes.mjs'
if (-not (Test-Path -LiteralPath $renderer)) { throw 'Install the Open Design Windows desktop app first.' }
$node = (Get-Command node -ErrorAction Stop).Source
$env:HYPERFRAMES_NO_TELEMETRY = '1'
$env:HYPERFRAMES_FFMPEG_PATH = Join-Path $appRoot 'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe'
$localProbe = Join-Path $demoRoot '../.sites-local/motion-tools/ffprobe/package/ffprobe.exe'
if (Test-Path -LiteralPath $localProbe) { $env:HYPERFRAMES_FFPROBE_PATH = [IO.Path]::GetFullPath($localProbe) }
elseif (-not $env:HYPERFRAMES_FFPROBE_PATH -and -not (Get-Command ffprobe -ErrorAction SilentlyContinue)) { throw 'FFprobe is required. See README.md for local setup.' }
$browserCandidates = @(
  (Join-Path $env:ProgramFiles 'Google/Chrome/Application/chrome.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Microsoft/Edge/Application/msedge.exe')
)
foreach ($candidate in $browserCandidates) {
  if (Test-Path -LiteralPath $candidate) { $env:HYPERFRAMES_BROWSER_PATH = $candidate; break }
}
if (-not $Output) { $Output = Join-Path $demoRoot '../artifacts/demo-video/Across-ideal-product-demo.mp4' }
$outputFolder = Split-Path -Parent ([IO.Path]::GetFullPath($Output))
New-Item -ItemType Directory -Path $outputFolder -Force | Out-Null
& $node (Join-Path $demoRoot 'verify-data.mjs')
if ($LASTEXITCODE) { throw 'Demo data verification failed.' }
& $node (Join-Path $demoRoot 'build.mjs')
if ($LASTEXITCODE) { throw 'Demo build failed.' }
& $node $renderer lint $demoRoot
if ($LASTEXITCODE) { throw 'Motion lint failed.' }
& $node $renderer render $demoRoot -o $Output --fps 30 --quality high --workers 2
if ($LASTEXITCODE) { throw 'Video render failed.' }
Write-Output "Saved video: $Output"
