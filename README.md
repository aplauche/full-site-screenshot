# Full Site Screenshot

This small utility package provides a cli for automating the capture of screenshots for multiple pages across a website using puppeteer full page screenshots.

It will output all captures individually and optionally create a PDF with all of them as well.

## Installation 

You can install the package globally with 

`npm install -g full-site-screenshot`

Or you can simple run directly using npx instead

`npx full-site-screenshot`

## Usage

The capture cli has three modes for selecting the target web pages:

- Sitemap - This allows you to point to a sitemap and it will extract the pages automatically and capture all of them
- CSV File - Point to a local csv file with all the page URLs you want to capture
- Single - paste in the web address you want to capture

Once you select your targets you can pick a loading strategy to make sure lazy loaded images and other content is captured:

- Pre Scroll - emulates scrolling down the full page and is usually the best strategy
- Full Height - sometimes animated elements will still not show up with emulated scrolling. In this case we can set the viewport height to the full page height and trick the element into believing it is in view. This can create issues with any dom elements using "vh" sizing units.

The cli will then walk you through some options like the desired viewport width for the capture and whether you want to create a PDF in addition to individual images.

You will also be prompted to choose an "interaction delay" this is to allow assets to load and for any intro animations to complete. The default is 5 seconds. You can reduce to speed up captures, but if elements are missing try increasing this value to make sure everything is loaded properly.

All outputted images and the pdf will be placed into a screencapture-output directory created within the working directory when the package is called.

## Custom Instances

For some sites you may need additional logic like closing cookie banners, clicking on modals or accordions, etc. 

This package is intentionally slim and does not handle these cases. Instead, you can download the soruce files for this package from github where there is a branch called "custom-actions". This gives you an entry point to add additional logic when the page loads. You can fork this or simply download and use as you see fit.