import { fetchContact, handleNewContact, fetchAttribute, createTestContact } from 'utils/manager'
import { google } from 'googleapis'
import { authorize } from 'utils/calendar'
import * as readline from 'readline'

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function main() {
    const auth = await authorize()
    const calendar = google.calendar({ version: 'v3', auth })

    // TODO - Handle CLI arguments, create (-c/new), fetch (just use contact name, or -b, -c,-f for bday/company/firstmetDate) etc.
    switch (process.argv[2]) {
        case 'test':
            await createTestContact(calendar)
            break
        case 'testcal':
            await createTestContact(calendar, true)
        case 'new':
        case '-c':
            await handleNewContact(process.argv[2], calendar)
            break;
        case 'fetch':
            await fetchContact(process.argv[3])
            break;
        default:
            fetchAttribute(process.argv[2])
            break
    }

    rl.close()
}

main().catch(e => {
    console.error(e)
    throw e
})
