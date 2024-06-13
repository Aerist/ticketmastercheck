
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();
const mailer = require("./mailer")
const emailList = process.env.emailList;
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);


async function getTicketmasterResults() {
    try {
        const result = await fetch(`https://app.ticketmaster.com/inventory-status/v1/availability?events=${process.env.ticketMasterEventId}&apikey=${process.env.ticketMasterApiKey}`, {
            method: "POST"
        });
        return await result.json();
    } catch (error) {
        const errorBody = `An error has occured: ${JSON.stringify(error)}`;
        mailer.sendMail({
            from: `"Ticketvriendje" <${process.env.emailFrom}>`, // sender address
            to: emailList, // list of receivers
            text: errorBody, // plain text body
            html: errorBody, // html body
        }).then(info => {
            // console.log({info});
            console.log("Error email sent")
        }).catch(console.error);
    }
};
async function sendEmailAndTextMessage(result) {
    try {
        const link = process.env.emailLink;
        const body = `<b>It's the nicest ticket friend with ticket updates: Jeeeej!</b><br/><br/>
                Er is een ticket beschikbaar
                Klik op deze link om naar de ticket verkoop te gaan: 
            <a href=${link}>Ticket link</a>`;
        const email = await mailer.sendMail({
            from: `"Ticketvriendje" <${process.env.emailFrom}>`, // sender address
            to: emailList, // list of receivers
            text: JSON.stringify(result), // plain text body
            html: body, // html body
        })
        const numbers = [process.env.phoneNumbers.split(",")];
        numbers.forEach(async (number) => {
            await client.messages
                .create({
                    body: `Nieuw ticket beschikbaar. link: ${link}`,
                    from: process.env.twilioNumber,
                    to: number
                })
        });

        if (email) {
            return email;
        }
    } catch (error) {
        const errorBody = `An error has occured: ${JSON.stringify(error)}`;
        mailer.sendMail({
            from: `"Ticketvriendje" <${process.env.emailFrom}>`, // sender address
            to: emailList, // list of receivers
            text: errorBody, // plain text body
            html: errorBody, // html body
        }).then(info => {
            // console.log({info});
            console.log("Email sent")
        }).catch(console.error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function periodicallyFetchResults() {
    let fetchedWithOffers = 0;
    const MAX_TRIES = 500;
    console.log("starting app")
    let isEmailSent = false;
    let sentEmail;
    while (fetchedWithOffers < MAX_TRIES) {
        let result = await getTicketmasterResults();
        console.log(result)
        if (sentEmail === undefined && !isEmailSent && result[0] && result[0].resaleStatus === "TICKETS_AVAILABLE") {
            fetchedWithOffers++;
            isEmailSent = true;
            console.log("sending email");
            sentEmail = await sendEmailAndTextMessage(result);
            console.log("email and text sent");
            console.log("entering sleep for 5 minutes");
            await sleep(5 * 60 * 1000);
        } else {
            console.log("No tickets found...")
            isEmailSent = false;
            sentEmail = undefined;
        }
        const sleepTime = 18 * 1000;
        console.log(`Sleeping for ${sleepTime / 1000} seconds`)

        await sleep(sleepTime);
    }
}
periodicallyFetchResults();
