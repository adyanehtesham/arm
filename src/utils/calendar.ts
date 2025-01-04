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

