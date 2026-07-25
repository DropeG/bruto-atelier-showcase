import { chromium, devices } from 'playwright';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const outputDir = path.resolve(process.cwd(), 'public/demos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function recordOption(optionName) {
  console.log(`[Record] Starting clean recording for ${optionName}...`);
  const tempVideoDir = path.resolve(outputDir, `temp_${optionName}`);
  if (!fs.existsSync(tempVideoDir)) {
    fs.mkdirSync(tempVideoDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required'],
  });

  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    recordVideo: {
      dir: tempVideoDir,
      size: { width: 390, height: 844 },
    },
  });

  const page = await context.newPage();
  await page.goto('http://localhost:8080/?demoMode=true', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  if (optionName === 'opcion1') {
    // 1. Scroll down to VideoSection
    await page.evaluate(() => {
      const container = document.getElementById('coleccion');
      if (container) container.scrollTop = window.innerHeight;
    });
    await page.waitForTimeout(1200);

    // 2. Swipe horizontal carousel from 01 -> 02 -> 03
    for (let swipe = 0; swipe < 2; swipe++) {
      await page.mouse.move(340, 500);
      await page.mouse.down();
      await page.mouse.move(40, 500, { steps: 15 });
      await page.mouse.up();
      await page.waitForTimeout(1500);
    }

    // 3. Scroll down through rest of page (ImageRows & Footer)
    await page.evaluate(async () => {
      const container = document.getElementById('coleccion');
      if (!container) return;

      const startScroll = window.innerHeight;
      const totalScroll = container.scrollHeight - startScroll;
      const steps = 50;
      const stepDistance = totalScroll / steps;

      for (let i = 1; i <= steps; i++) {
        container.scrollTop = startScroll + i * stepDistance;
        await new Promise(r => setTimeout(r, 100));
      }
    });

  } else if (optionName === 'opcion2') {
    // Smooth scroll down the page pausing at intercalated videos
    await page.evaluate(async () => {
      const container = document.getElementById('coleccion');
      if (!container) return;

      const totalScroll = container.scrollHeight - container.clientHeight;
      const steps = 90;
      const stepDistance = totalScroll / steps;

      for (let i = 0; i <= steps; i++) {
        container.scrollTop = i * stepDistance;
        await new Promise(r => setTimeout(r, 120));
      }
    });
  } else {
    // Option 3 and Option 4 smooth scroll
    await page.evaluate(async () => {
      const container = document.getElementById('coleccion');
      if (!container) return;

      const totalScroll = container.scrollHeight - container.clientHeight;
      const steps = 70;
      const stepDistance = totalScroll / steps;

      for (let i = 0; i <= steps; i++) {
        container.scrollTop = i * stepDistance;
        await new Promise(r => setTimeout(r, 100));
      }
    });
  }

  await page.waitForTimeout(1500);

  await context.close();
  await browser.close();

  // Find recorded webm video file
  const videoFiles = fs.readdirSync(tempVideoDir).filter(f => f.endsWith('.webm'));
  if (videoFiles.length > 0) {
    const rawWebm = path.join(tempVideoDir, videoFiles[0]);
    const finalMp4 = path.join(outputDir, `demo_${optionName}.mp4`);
    console.log(`[Record] Converting ${rawWebm} to ${finalMp4}...`);
    try {
      execSync(`ffmpeg -y -i "${rawWebm}" -c:v libx264 -pix_fmt yuv420p "${finalMp4}"`, { stdio: 'ignore' });
      console.log(`[Record] Successfully saved ${finalMp4}`);
    } catch (e) {
      console.error(`[Record] ffmpeg conversion failed:`, e);
      fs.copyFileSync(rawWebm, path.join(outputDir, `demo_${optionName}.webm`));
    }
  }

  fs.rmSync(tempVideoDir, { recursive: true, force: true });
}

const optionArg = process.argv[2] || 'opcion2';
recordOption(optionArg).catch(console.error);
