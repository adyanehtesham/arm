import { fetchContact, createTestContact } from 'utils/manager'
import * as readline from 'readline'
import { google } from 'googleapis'
import { authorize } from 'utils/calendar'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const askQuestion = (query: string): Promise<string> => {
    return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
    const auth = await authorize()
    const calendar = google.calendar({ version: 'v3', auth })

    try {

        // await createTestContact(calendar)

        const name = process.argv[2]
        console.log('now fetching contact')
        await fetchContact(name)

    } catch (error) {
        console.log(error)
    }
    await createTestContact(calendar)

    rl.close();
}

main().catch(e => {
    console.error(e)
    throw e
})
