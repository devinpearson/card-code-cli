# Limit your card to a specific merchant

The code snippet on the top will allow you to lock your card down to a specified list of merchants. You don’t have to do anything in the Main.js section as it is there if you want to copy and make your own snippet.

To update your list of merchants you are allowing the card to work on you will need to update the names of the merchants after "merchantNames" in the bottom section (Env.js). You can have one or many merchants as long as they all follow the format in the inverted commas as indicated i.e. They need to be inside double quotes and have the pipe symbol "|" between them.

To get your merchant’s name to lock down you can look at your transaction history on Investec Online or in the Investec App. So, for example, if you want your card to only work on Uber Eats, you need to find the value you get when you do a transaction with Uber Eats, for example, "UBER EATS Johannesburg ZA". You only need the first part of the description i.e. UBER EATS, you can ignore the rest.

Once published any transaction that doesn’t contain the merchant names will be declined.