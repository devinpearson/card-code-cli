# Set transaction limit
The code snippet on the top will allow you to update your per-transaction limit on a card (Main.js). You don’t have to do anything in the Main.js section as it is there if you want to copy and make your own snippet.

To update the value, you need to update in the bottom section (Env.js) with the amount you want the limit to be. Simply change "maximumTransactionAmount" : 10000 to whatever amount you want it to be in cents i.e. R100 is 10000

Once published any transaction higher than or equal than the amount will be declined.