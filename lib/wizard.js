const fs = require('fs');
const inquirer = require('inquirer');
const cheerio = require('cheerio')
const axios = require('axios');
const path = require('path');

function extractUrls(xml) {
  const urls = []
  const $ = cheerio.load(xml, { xmlMode: true })

  $('loc').each(function() {
    const url = $(this).text()

    if (!urls.includes(url)) {
      urls.push(url)
    }
  })

  return urls
}

module.exports = async function wizard(){
  var targets;

  // Interactive wizard
  const {mode} = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Capture mode:',
      choices: ['XML Sitemap' ,'CSV File', 'Single Page'],
    },
  ])

  switch(mode){
    case "XML Sitemap":
      const { sitemapUrl } = await inquirer.prompt([
        {
          name: 'sitemapUrl',
          message: 'Enter the full url to the sitemap:',
        },
      ])
      try {
        let {data} = await axios.get(sitemapUrl);
        targets = extractUrls(data)
        console.log("Discovered the following pages:")
        console.log(targets)
  
      } catch(e){
        console.log('Error with your sitemap')
        return false
      }
  
      let { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Ready to go?:',
        },
      ])
  
      if(!proceed){
        console.log('exiting...'); 
        return false
      } 
    break;
    case "CSV File":
      const { csvName } = await inquirer.prompt([
        {
          name: 'csvName',
          message: 'Enter the path to the csv file:',
          default: './pages.csv'
        },
      ])

      try {
        const csvString = fs.readFileSync(`${csvName}`, 'utf8')
        targets = csvString.split(',')
        console.log("Parsed the following pages:")
        console.log(targets)
      } catch(e){
        console.log('Error with your csv file')
        return false
      }

      let { csvproceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'csvproceed',
          message: 'Ready to go?:',
        },
      ])
  
      if(!csvproceed){
        console.log('exiting...'); 
        return false
      } 
    break;
    case "Single Page":
      const { page } = await inquirer.prompt([
        {
          name: 'page',
          message: 'Enter the url:',
        },
      ])
      targets = [page]
    break;
    default:
      console.log('Mode selection failed...')
      return false
  }


  const { screenWidth } = await inquirer.prompt([
    {
      type: 'number',
      name: 'screenWidth',
      message: 'Screen Width (pixels):',
      default: 1440,
      validate: (input) => {
        if(Number.isInteger(input) && input <= 3000 && input >= 100){
          return true;
        }
        return "Please choose a whole number between 100 and 3000";
      }
    },
  ])

  const { screenHeight } = await inquirer.prompt([
    {
      type: 'number',
      name: 'screenHeight',
      message: 'Screen Height (pixels):',
      default: 900,
      validate: (input) => {
        if(Number.isInteger(input) && input <= 3000 && input >= 100){
          return true;
        }
        return "Please choose a whole number between 100 and 3000";
      }
    },
  ])

  const { interactionDelay } = await inquirer.prompt([
    {
      type: 'number',
      name: 'interactionDelay',
      message: 'Interaction delay in milliseconds (adjust if page has loading interactions):',
      default: 5000,
      validate: (input) => {
        if(Number.isInteger(input) && input <= 20000 && input >= 0){
          return true;
        }
        return "Please choose a whole number between 0 and 20000";
      }
    },
  ])

  const { enablePDF } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'enablePDF',
      message: 'Create a PDF?',
    },
  ])

  return {targets, screenWidth, screenHeight, enablePDF, interactionDelay}

}