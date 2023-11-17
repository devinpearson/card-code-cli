# 🦓 Telegram Bot

This example sends telegram messages when you swipe your card. It uses the [Telegram Bot API](https://core.telegram.org/bots/api) to send messages to a telegram channel.

Information on how to create a bot [https://core.telegram.org/bots#6-botfather](https://core.telegram.org/bots#6-botfather)

Initiate a the botfather to create a new bot [https://core.telegram.org/bots#6-botfather](https://core.telegram.org/bots#6-botfather). Once you have created the bot, you will be given a token. This token is used to authenticate your bot. You will also need to create a channel and add your bot to the channel. You can then send messages to the channel using the bot.

Send a message to the bot to get the chat id of the channel. You can do this by sending a message to the bot and then running the following command: `curl https://api.telegram.org/bot<token>/getUpdates`. The chat id will be in the response.

```
This code was created by Russell Knight
```
