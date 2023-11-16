async function notifyOnTelegram(authorization) {
  var strAdd = authorization.merchant.name.toLowerCase().includes('zebru')
    ? '%0A%F0%9F%A6%93 Enjoy your coffee %E2%98%95 and say "Hi" to Martin and Jenny!'
    : '';
  var strAdd1 =
    authorization.merchant.name.toLowerCase().includes('caltex') ||
    authorization.merchant.name.toLowerCase().includes('motors')
      ? '%0A%E2%9B%BD Woohoo! Full tank of gas!'
      : '';
  var strAdd2 =
    authorization.merchant.name.toLowerCase().includes('spar') ||
    authorization.merchant.name.toLowerCase().includes('wool') ||
    authorization.merchant.name.toLowerCase().includes('checker')
      ? '%0A%F0%9F%9B%92 Grocery shopping done. Hope you contained your spending to that which was necessary? %F0%9F%91%80'
      : '';

  const response = await fetch(
    process.env.telegramURL +
      process.env.apiKey +
      '/sendMessage?chat_id=-' +
      process.env.chatID +
      '&parse_mode=Markdown&text=%F0%9F%92%B3 The following Investec card transaction has taken place:%0A' +
      'Cardholder: Russell' +
      '%0AMerchant: ' +
      authorization.merchant.name.replace(/\*/g, '') +
      '%0AAmount: ' +
      authorization.currencyCode.toUpperCase() +
      ' *' +
      investec.helpers.format.decimal(authorization.centsAmount / 100, 100) +
      '*%0ACategory: ' +
      authorization.merchant.category.name +
      '%0AReference: ' +
      authorization.reference +
      '%0ALocation: ' +
      authorization.merchant.city +
      strAdd +
      strAdd1 +
      strAdd2,
    { method: 'POST' }
  );
}

// This function runs before a transaction.
const beforeTransaction = async (authorization) => {
  console.log(authorization);

  return true; // Authorise the transaction
};
// This function runs after a transaction was successful.
const afterTransaction = async (transaction) => {
  await notifyOnTelegram(transaction);
  console.log(transaction);
};
