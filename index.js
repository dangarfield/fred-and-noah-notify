const puppeteer = require('puppeteer')
const Push = require('pushover-notifications')
require('dotenv').config()

const init = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  let found = false
  while (!found) {
    found = await scrape(page)
    if (!found) {
      await sleep(5 * 1000)
    } else {
      console.log('FOUND!!!')
      await sendNotification()
    }
  }
  await browser.close()
  console.log('closing')
}
const sendNotification = async () => {
  var p = new Push({
    user: process.env.PUSHOVER_USER,
    token: process.env.PUSHOVER_TOKEN
  })
  var msg = {
    message: 'Check the site - https://fredandnoah.com/search?q=midnight',
    title: 'Midnight Gang is out!!!',
    sound: 'magic',
    device: 'Caroline,Dan',
    priority: 1
  }

  p.send(msg, function (err, result) {
    if (err) {
      throw err
    }
    console.log(result)
  })
}
const sleep = async (ms) => {
//   console.log('sleep', ms)
  return new Promise(resolve => setTimeout(resolve, ms))
}
const scrape = async (page) => {
  await page.goto('https://fredandnoah.com/search?q=midnight')
  //   await page.screenshot({path: 's/s.png'})
  const productCount = await page.$$('.products .product')
  console.log(new Date(), 'productCount', productCount.length)
  if (productCount.length === 6) {
    return false
  } else {
    return true
  }
}
init()
