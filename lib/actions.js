module.exports = async function actions(page){

  const xpathResult = await page.$x("//button[contains(., 'Accept')]"); // <- evaluate the xpath expression
  if (xpathResult.length > 0) {
    await xpathResult[0].click(); // <- clicking on the button
  }

  return

}