import { readFileSync } from 'fs';
import { launch } from 'puppeteer-core'; 

const cv = JSON.parse(readFileSync(new URL('./resume.json', import.meta.url)));

const destDir = 'public'; 

async function generatePDF(html, outputPath) {
  try {
    const browser = await launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 
      timeout: 0 
    });
    const page = await browser.newPage();
    await page.setContent(html, {timeout: 0}); 
    const pdf = await page.pdf({
      format: 'A4',
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      path: outputPath,
    });
    await browser.close();
    console.log('generatePDF completed');
    return pdf;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
}
const html = readFileSync('dist/index.html', 'utf8');

const titleRegex = /<title>(.*)<\/title>/;
const title = html.match(titleRegex)[1];

console.log("call generate pdf");
try {
  generatePDF(html, `${destDir}/resume.pdf`).then(() => {
    console.log('PDF generation succeeded');
  }).catch((error) => {
    console.error('PDF generation failed:', error);
  });
} catch (error) {
  console.error('Unexpected error:', error);
}