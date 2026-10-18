# Across concept demo

An 84-second, 1920 × 1080, 30 fps animated product story. The film is silent with English captions and shows English, Simplified Chinese and Traditional Chinese profile previews.

All candidate, employer, job and outcome data is fictional. This is an ideal product concept; several scenes go beyond the current app. Posting and applying are simulated. No live model, credential or external submission is used.

## Files

- `demo-data.json`: candidate facts, selected job, three profile locales, campaign drafts, chats and storyboard timing.
- `STORYBOARD.md`: scene sequence and narration captions.
- `index.html`, `motion.css`, `motion.js`: editable motion composition. Open `index.html?preview=1` in a browser to use the play, seek and scene controls.
- `build.mjs`: rebuilds HTML and SRT from the dataset and source. Some visual emphasis and animation cues are deliberately authored in the template/timeline; revise those when changing the story.
- `verify-data.mjs`: checks evidence references, continuity, qualified results and review/privacy boundaries.
- `captions.srt`: optional separate subtitle track; captions are also visible in the video.
- `Render-Demo.ps1`: Windows render helper using the installed Open Design HyperFrames renderer, Node 22+, Chrome or Edge and bundled FFmpeg.

## Rebuild

From this folder:

```powershell
node verify-data.mjs
node build.mjs
./Render-Demo.ps1
```

The default MP4 output is `../artifacts/demo-video/Across-ideal-product-demo.mp4`. Large renders and downloaded installers are ignored by Git. The source composition works offline; the renderer may fetch its own fallback font on first use.

Open Design 0.25.0's bundled renderer also requires FFprobe, which the Windows app does not bundle. This PC has an integrity-checked `@ffprobe-installer/win32-x64` 5.1.0 binary under `../.sites-local/motion-tools/ffprobe/package/`. On another PC, supply FFprobe on PATH or set `HYPERFRAMES_FFPROBE_PATH` to an installed binary. The helper prefers the existing local copy. The local binary is not part of the portable source.

The desktop app was installed from the official Open Design 0.25.0 Windows release. The composition uses its bundled HyperFrames 0.8.1 renderer. It can be used independently as editable HTML; importing it into the Open Design editing UI has not been tested.

## Dependency attribution

`vendor/gsap.min.js` is GSAP 3.14.2, copied unchanged from Open Design's bundled dependency. Its copyright and license notice remain in the file header. License: https://gsap.com/standard-license. Local system fonts are referenced by name, not redistributed. No custom Codex skill or agent configuration is installed by this demo.
