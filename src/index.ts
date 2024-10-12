import { saveContactToFile } from 'utils/fileManager'
import { Contact } from 'contacts/contact'
import * as readline from 'readline'
import { calendar_v3, google } from 'googleapis'
import { authorize, deleteEvents } from 'utils/calendar'
type OAuth2ClientType = InstanceType<typeof google.auth.OAuth2>

const API_KEY = 'IzaSyD8vxO_XWPCV83Kztl0ThxEFgZnk-2s2R4'


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const askQuestion = (query: string): Promise<string> => {
    return new Promise(resolve => rl.question(query, resolve))
}

async function createContact(calendar: calendar_v3.Calendar) {
    // console.log("Let's get some details for this new contact")
    // const name = await askQuestion("What's their name?\n")
    // const company = await askQuestion("What's their company?\n")
    // const role = await askQuestion(`What's their role in ${company}?\n`)
    // const firstMet = new Date(await askQuestion("When did you meet?\n"))

    const name = 'Baseless'
    const company = 'Staples'
    const role = 'Tech Associate'
    const firstMet = new Date()
    const followUpDate = new Date()
    followUpDate.setDate(firstMet.getDate() + 30)

    // change it so that the firstMet and followUpDates have an calendar event id as well
    const newContact: Contact = {
        name: name,
        company: company,
        role: role,
        firstMet: firstMet,
        lastInteraction: firstMet,
        notes: [{ title: 'First Meeting', date: firstMet }],
        followUpDate: followUpDate
    }

    saveContactToFile(newContact)

    console.log("Created new contact")

    // create calendar events for contact
    const initialEvent = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: `First meeting with ${name}`,
            start: { date: firstMet.toISOString().split('T')[0] },
            end: { date: firstMet.toISOString().split('T')[0] }
        }
    })
    console.log(initialEvent.data)

    const followUpEvent = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            summary: `${name} follow up`,
            start: { date: followUpDate.toISOString().split('T')[0] },
            end: { date: followUpDate.toISOString().split('T')[0] }
        }
    })
    console.log(followUpEvent.data)

}

authorize().then(async auth => {
    const calendar = google.calendar({ version: 'v3', auth })
    // const res = await calendar.events.insert({
    //     calendarId: 'primary',
    //     requestBody: {
    //         summary: 'All-Day Event Title',
    //         location: 'Event Location',
    //         description: 'Event Description',
    //         start: {
    //             date: '2024-10-10', // YYYY-MM-DD format
    //         }, end: {
    //             date: '2024-10-10', // Same as start date for a single-day event
    //         },
    //     }
    // })
    // console.log(res.data)
    // createContact(calendar);
    deleteEvents(['m1gf43utoqe2g9bdg98j3354d4', 'b5u71shlrhhr4auajgtmdmpc4s', 'htbut72evnus1f3rscuhll79p0', '3clk78shudecij3a35nnv9hsgs'], calendar)
})

rl.close();



// figure out this way of doing auth in the future, looks neater
// async function main() {
//     const auth = new google.auth.GoogleAuth({
//         // Scopes can be specified either as an array or as a single, space-delimited string.
//         scopes: [
//             'https://www.googleapis.com/auth/calendar',
//             'https://www.googleapis.com/auth/calendar.events',
//         ],
//     });
//     // Acquire an auth client, and bind it to all future calls
//     const authClient = await auth.getClient() as OAuth2ClientType;
//     google.options({ auth: authClient });
// }
// main().catch(e => {
//     console.error(e)
//     throw e
// })


