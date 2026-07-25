## ADDED Requirements

### Requirement: Demo mode URL override
The application SHALL suppress all automatic overlay modals (such as NewsletterModal) when the query parameter `demoMode=true` is present in the URL.

#### Scenario: Navigating with demoMode parameter
- **WHEN** the browser opens `http://localhost:8080/?demoMode=true`
- **THEN** the NewsletterModal does NOT open automatically on load or scroll

### Requirement: Clean mobile video recordings
The automated video recording script SHALL capture all 4 mobile video presentation options without any modal or overlay obstruction.

#### Scenario: Generating demo MP4 videos
- **WHEN** `node scripts/record-demo.mjs <opcion>` is executed
- **THEN** an MP4 video is produced in `public/demos/demo_<opcion>.mp4` showing only the clean mobile webpage layout and playing videos
