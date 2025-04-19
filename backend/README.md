# Backend Documentation

This explains how some of the functionality was implemented. The backend has an Express REST API, and uses Mongo as the database to handle the routes described more below:

Every user of the application has a user record in our database that we use to keep track of the agents they have published or the ones that they are copy trading. In addition every user has their own HCS-10 agent that trades for them.

## People registering their bots

This functionality should allow people to register the bots that they have created on the platform. The following should happen when a user registers their bot:

1. Details should be stored in a database
2. A HCS-10 topic should be created for the bot
3. For every trade the bot makes a message should be sent to the topic

## Following a bot's trades