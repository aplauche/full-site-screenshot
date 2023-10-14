const fs = require('fs');
const puppeteer = require("puppeteer");

const wizard = require('./wizard.js');
const filenameBuilder = require('./filenameBuilder.js');
const getPageHeight = require('./getPageHeight.js');
const customActions = require('./customActions.js');

let pdf = false;


function takeScreenshot(url, settings, resolver){
  console.log('Opening: ' + url);

  const fileName = filenameBuilder(url)

   // Check if the output folder exists
   if (!fs.existsSync(settings.outputDir)) {
    // If it doesn't exist, create the folder
    fs.mkdirSync(settings.outputDir);
  }

  // Main script
  puppeteer.launch({headless: "new"}).then(async (browser) => {

    const page = (await browser.pages())[0];

    await page.setViewport({ 
      width: settings.screenWidth, 
      height: settings.screenHeight, 
      deviceScaleFactor: settings.DPR 
    });

    await page.goto(url);

    // Scroll full height to kick in lazy load
    if(settings.loadStrategy === 1) {

      await page.evaluate(() => {
        window.scrollTo(0, window.document.body.scrollHeight);
      });

    }

    // Lazy Load option 2 - Full height viewport - does not work with fixed elements
    if(settings.loadStrategy === 2) {
      let calculatedHeight = await getPageHeight(page)
      await page.setViewport({ 
        width: settings.screenWidth, 
        height: calculatedHeight, 
        deviceScaleFactor: settings.DPR 
      });
    }

    // CUSTOM
    await customActions(page);

    await page.evaluate(async(interactionDelay) => {
      await new Promise(function(resolve) { 
            setTimeout(resolve, interactionDelay)
      });
    }, settings.interactionDelay);

    await page.screenshot({
      path: `${settings.outputDir}/${fileName}.png`,
      fullPage: true,
    });

    await browser.close();
    console.log(`Screenshot Complete: ${fileName}.png`)

    if(pdf){
      var img = pdf.openImage(`./${settings.outputDir}/${fileName}.png`);
      pdf.addPage({size: [img.width, img.height]});
      pdf.image(img, 0, 0);
  
      console.log(`Added to PDF: ${fileName}.png`)
    }

    resolver();

  });
}


(async function init () {

 
  let answers = await wizard();

  if(!answers) return;

  const {targets, ...settings} = answers

  settings.DPR = 2

  if(settings.screenSize < 600){
    settings.DPR = 3
  }

  settings.outputDir = './screencapture-output'


  if(settings.enablePDF) {
    pdf = new (require('pdfkit'))({ autoFirstPage: false });
    pdf.pipe(fs.createWriteStream(`${settings.outputDir}/screenshots.pdf`))
  }

  for (const url of targets) {
    await new Promise((resolve, reject) => {
      takeScreenshot(url, settings, resolve);
    })
  }

  console.log("Capture finished!")

  if(settings.enablePDF) {
    pdf.end();
    console.log("PDF Created!")
  }
  
})()