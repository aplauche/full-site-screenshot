module.exports = function filenameBuilder(url){
  // Modify url to be compliant file name
  let fileName = url.replace('https://', '')
  fileName = fileName.replace('www.', '')
  fileName = fileName.replace('.com', '')
  fileName = fileName.replace('.org', '')
  fileName = fileName.replace('.pantheonsite.io', '')
  fileName = fileName.replace(/[\/|\\:*?"<.>]/g, "-")


  if(fileName === ''){
    fileName = 'index'
  }

  return fileName

}