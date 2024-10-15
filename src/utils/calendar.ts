import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { authenticate } from '@google-cloud/local-auth'
import { calendar_v3, google } from 'googleapis'
type OAuth2ClientType = InstanceType<typeof google.auth.OAuth2>

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 */
async function loadSavedCredentialsIfExist(): Promise<OAuth2ClientType | null> {
    try {
        const content = await fs.readFile(TOKEN_PATH, 'utf-8');
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials) as OAuth2ClientType;
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 */
async function saveCredentials(client: OAuth2ClientType): Promise<void> {
    const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
    console.log('loading credentials if they exist')
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        console.log('exists, so returning')
        return client;
    }
    console.log('no client so authenticating')
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        console.log('saving credentials')
        await saveCredentials(client);
    }
    console.log('returning client hopefully')
    return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 */
async function listEvents(auth: OAuth2ClientType) {
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
        console.log('No upcoming events found.');
        return;
    }
    console.log('Upcoming 10 events:');
    events.map((event, i) => {
        const start = event.start?.dateTime || event.start?.date;
        console.log(`${start} - ${event.summary}`);
    });
}

// authorize().then(listEvents).catch(console.error);

/**
 * Delete event(s)
 */
export async function deleteEvents(events: string[], calendar: calendar_v3.Calendar) {
    events.map(event => {
        calendar.events.delete({
            calendarId: 'primary',
            eventId: event
        })
    })
}


//crewating and deletting examples
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
// deleteEvents(['m1gf43utoqe2g9bdg98j3354d4', 'b5u71shlrhhr4auajgtmdmpc4s', 'htbut72evnus1f3rscuhll79p0', '3clk78shudecij3a35nnv9hsgs'], calendar)