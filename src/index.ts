import { google } from 'googleapis'
import { authorize } from 'utils/calendar'
import * as readline from 'readline'

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function parseTime(timeInput: string): number[] {

    let hour = 0
    let minute = 0
    let ampm24: 'am' | 'pm' | 24 = 24
    let lastChar = timeInput.slice(-1)

    switch (lastChar) {
        case 'a':
            ampm24 = 'am'
            break
        case 'p':
            ampm24 = 'pm'
            break
        default:
            break
    }

    const time = typeof (lastChar) == 'string' ? timeInput.slice(0, -1) : timeInput

    if (time.indexOf('.') > -1) {

        hour = Number(time.split('.')[0])
        minute = Number(time.split('.')[1])

    } else {

        hour = Number(time)

    }

    if (ampm24 === 'pm' && hour !== 12) { hour += 12 }

    if (ampm24 === 'am' && hour === 12) { hour = 0 }

    return [hour, minute]

}

async function main() {
    const auth = await authorize()
    const calendar = google.calendar({ version: 'v3', auth })

    // read argument and create event

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    const [startTimeHour, startTimeMinute] = parseTime(process.argv[3])
    const [endTimeHour, endTimeMinute] = parseTime(process.argv[4])

    const date = Number(process.argv[2])
    const begin = new Date(year, month, date, startTimeHour, startTimeMinute)
    const end = new Date(year, month, date, endTimeHour, endTimeMinute)

    try {
        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: 'Work',
                start: {
                    dateTime: begin.toISOString(),
                    timeZone
                },
                end: {
                    dateTime: end.toISOString(),
                    timeZone
                },
            }
        })
        console.log(res.data)
    } catch (error) {
        console.error(error)
    }

    rl.close()
}

main().catch(e => {
    console.error(e)
    throw e
})
