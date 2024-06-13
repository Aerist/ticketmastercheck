# ticket-master-bot

# Requirements
Create a developer account on: https://developer.ticketmaster.com/  
Use and set the api-key for env variable: ```ticketMasterApiKey```

Create a app password for your gmail: https://support.google.com/mail/answer/185833?hl=en  
Use and set the app password for env variable: ```emailToken```

Optional: if you want to receive whatsapp messages as well.

Create a Twilio account and setup a sandbox after registration: https://twilio.com/

You have to register your private number(and in case you want to send to others, they have to register as welll) in order to receive whatsapp messages.

Set your account sid and token: ```accountSid```, ```authToken```  
Set 1 or more phone numbers you want to receive messages on: ```phoneNumbers```  

# Ticketmaster  
Before starting the bot, lookup the event id from ticketmaster. This can be done with a GET request to:
https://app.ticketmaster.com/discovery/v2/events.json?keyword=EVENT_KEYWORD&apikey=apikey  
Lookup the event from the list, and set the event id to: ```ticketMasterEventId```



Install Node.js 20.4.0


Create a .env file and set the correct values in the .env file for:

```
accountSid=twilio-account-sid
authToken=twilio-auth-token
ticketMasterApiKey=ticketmaster-api-key
emailList="email@gmail.com"
emailLink=ticket-master-event-url
ticketMasterEventId="eventid"
emailFrom=your-own-email
emailToken=your-email-token
phoneNumbers=your-phone-number
twilioNumber=twilio-sandbox-phone-number
```

Then:
Run `node app.js`

