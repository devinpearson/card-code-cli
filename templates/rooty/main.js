async function notifyOnSlack(authorization) {
  const response = await fetch(process.env.slackUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Hello World! I just simulated a transaction with ${
        authorization.merchant.name
      } for an amount of ${authorization.currencyCode} ${
        (authorization.centsAmount / 100, 100)
      }. It's a great day to be alive. Love, <@${process.env.slackID}>`,
    }),
  });
}
// This function runs before a transaction.
const beforeTransaction = async (authorization) => {
  console.log(authorization);
  // This is an example of how to decline a transaction based on the transaction payload.
  if (authorization.merchant.name == 'Fish and Chips Junction') {
    return false; // Decline the transaction
  } else {
    return true; // Authorise the transaction
  }
};
// This function runs after a transaction was successful.
const afterTransaction = async (transaction) => {
  await notifyOnSlack(transaction);
  console.log(transaction);
};
