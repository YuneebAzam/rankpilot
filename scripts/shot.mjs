import puppeteer from "puppeteer-core";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = process.argv[2] || path.join(__dirname, "..", "index.html");
const out = process.argv[3] || path.join(__dirname, "..", "shot.png");
const width = Number(process.argv[4] || 1280);

const url = target.startsWith("http")
  ? target
  : pathToFileURL(target).href;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "load", timeout: 60000 });
// give the Tailwind CDN JIT + web fonts time to apply
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("saved", out);
