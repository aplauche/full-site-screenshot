module.exports = async function getPageHeight(page){
  // calculate the page height - only needed to deal with fixed elements
  // this logic comes from stack overflow and is fancy recursion 
  let calculatedHeight = await page.evaluate(()=>{
    var pageHeight = 0;

    function findHighestNode(nodesList) {
        for (var i = nodesList.length - 1; i >= 0; i--) {
            if (nodesList[i].scrollHeight && nodesList[i].clientHeight) {
                var elHeight = Math.max(nodesList[i].scrollHeight, nodesList[i].clientHeight);
                pageHeight = Math.max(elHeight, pageHeight);
            }
            if (nodesList[i].childNodes.length) findHighestNode(nodesList[i].childNodes);
        }
    }

    findHighestNode(document.documentElement.childNodes);
    return pageHeight;
  })
  return calculatedHeight;
}