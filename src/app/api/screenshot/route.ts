import puppeteer from 'puppeteer';

export async function GET() {
  const url = "https://oshyn.com/"

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({ width: 1280, height: 800 });
    await new Promise(r => setTimeout(r, 1000));

    const screenshotBuffer = await page.screenshot({
      // path: `public/oshyn.png`,
      encoding: "base64"
    });

    await browser.close();

    return Response.json({screenshotBuffer})

  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return Response.json({ error }, {
      status: 500
    })

  }

}