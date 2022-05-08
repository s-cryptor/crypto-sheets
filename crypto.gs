const CMC_IDS = [1, 6636, 11419, 2, 8916, 131] // ids of coins/tokens on coinMarketCap
const X_CMC_PRO_API_KEY = 'you can get it on cmc'
const SHEETS_ID = 'id of sheets'

async function getAndUpdatePrices() {
  const response = await UrlFetchApp
    .fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${CMC_IDS.join(',')}`,
      {
        headers: { 'X-CMC_PRO_API_KEY': X_CMC_PRO_API_KEY }
      }
    )
  const data = JSON.parse(response.getContentText()).data

  let cellIndex = 3
  for (let id of CMC_IDS) {
    const priceRange = Sheets.newValueRange()
    priceRange.values = [[data[String(id)].quote.USD.price]]
    Sheets.Spreadsheets.Values.update(priceRange, SHEETS_ID, `crypto!C${cellIndex}`, { valueInputOption: 'USER_ENTERED' })

    const percentRange = Sheets.newValueRange()
    percentRange.values = [[data[String(id)].quote.USD.percent_change_24h]]
    Sheets.Spreadsheets.Values.update(percentRange, SHEETS_ID, `crypto!D${cellIndex}`, { valueInputOption: 'USER_ENTERED' })

    cellIndex++
  }
}

function onOpen() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu('Crypto')
      .addItem('Refresh', 'getAndUpdatePrices')
      .addToUi()
}
