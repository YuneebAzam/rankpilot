import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 90000 });

const sel = 'button[aria-label="Open the live demo dashboard"]';
await page.waitForSelector(sel, { timeout: 15000 });
console.log("mockup button found:", true);

await page.click(sel);

// poll the URL until the demo sign-in redirects us to /dashboard
let finalUrl = page.url();
for (let i = 0; i < 40; i++) {
  finalUrl = page.url();
  if (finalUrl.includes("/dashboard")) break;
  await new Promise((r) => setTimeout(r, 1000));
}
console.log("final URL:", finalUrl);
console.log("reached dashboard:", finalUrl.includes("/dashboard"));

await page.screenshot({ path: "d:\\project\\shot-demo-dashboard.png", fullPage: true });
console.log("saved shot-demo-dashboard.png");

await browser.close();
