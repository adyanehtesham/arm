import { promises as fs } from 'fs'
import { Contact } from 'contacts/contact'
import { calendar_v3 } from 'googleapis'
import { rl } from 'index'

const contactsDir = 'contacts/'

export const saveContactToFile = async (contact: Contact): Promise<void> => {
  const filePath = `${contactsDir}${contact.name}/info.json`;
  const content = {
    name: contact.name,
    birthday: contact.birthday,
    company: contact.company,
    role: contact.role,
    firstMet: contact.firstMet,
    lastInteraction: contact.lastInteraction,
    followUpDate: contact.followUpDate,
    notes: contact.notes.map((note) => ({ title: note.title, date: note.date }))
  }

  try {

    const dirPath = `${contactsDir}${contact.name}`
    await fs.mkdir(dirPath, { recursive: false })

    await fs.writeFile(filePath, JSON.stringify(content, null, 2))
    console.log('File created successfully')

  } catch (error) {

  }

}

const askQuestion = async (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve))
}

export async function handleNewContact(argument: string, calendar: calendar_v3.Calendar) {
  let name: string
  let bday: string = ''
  let company: string = ''
  let role: string = ''
  let firstMet: Date = new Date()
  let followUpDate: Date = new Date()
  followUpDate.setDate(firstMet.getDate() + 30)
  let firstMetString = firstMet.toISOString().split('T')[0]
  let followUpDateString = followUpDate.toISOString().split('T')[0]

  if (argument == 'new') {
    // start asking questions
    console.log("Let's get some details for this new contact")
    name = await askQuestion("Name: ")
    bday = await askQuestion("Birthday: ")
    company = await askQuestion("Company: ")
    role = await askQuestion(`Role: `)
    firstMet = new Date(await askQuestion("First meeting: "))
    firstMetString = firstMet.toISOString().split('T')[0]
    followUpDate.setDate(firstMet.getDate() + 30)
    followUpDateString = followUpDate.toISOString().split('T')[0]


  } else {
    // get all arguments provided and create contact
    const cliArguments: string[] = process.argv.slice(2)
    for (let i = 0; i < cliArguments.length; i += 2) {
      switch (cliArguments[i]) {
        case '-c':
          name = cliArguments[i + 1]
          break
        case '-b':
          bday = cliArguments[i + 1]
          break
        case '-c':
          company = cliArguments[i + 1]
          break
        case '-r':
          role = cliArguments[i + 1]
          break
        case '-f':
          firstMet = new Date(cliArguments[i + 1])
          followUpDate.setDate(firstMet.getDate() + 30)
          break
      }
    }
  }

  // create calendar events for contact
  const initialEvent = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: `First meeting with ${name!}`,
      start: { date: firstMetString },
      end: { date: firstMetString }
    }
  })
  const initialEventId = initialEvent.data.id

  const followUpEvent = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: `${name!} follow up`,
      start: { date: followUpDateString },
      end: { date: followUpDateString }
    }
  })
  const followUpEventId = followUpEvent.data.id

  // change it so that the firstMet and followUpDates have an calendar event id as well
  if (initialEventId && followUpEventId) {
    const newContact: Contact = {
      name: name!,
      birthday: bday,
      company,
      role,
      firstMet: { date: firstMetString, eventId: initialEventId },
      lastInteraction: { date: firstMetString, eventId: initialEventId },
      notes: [{ title: 'First Meeting', date: firstMet }],
      followUpDate: { date: followUpDateString, eventId: followUpEventId },
    }

    await saveContactToFile(newContact)

    console.log("Created new contact")

  }

}

export async function createTestContact(calendar: calendar_v3.Calendar, testcal: Boolean = false) {
  const name = 'Baseless'
  const company = 'Staples'
  const role = 'Tech Associate'
  const bday = '2002-04-02'
  const firstMet = new Date()
  const firstMetString = firstMet.toISOString().split('T')[0]
  const followUpDate = new Date()
  followUpDate.setDate(firstMet.getDate() + 30)
  const followUpDateString = followUpDate.toISOString().split('T')[0]
  let initialEventId: string | null | undefined = 'initialEventId'
  let followUpEventId: string | null | undefined = 'followUpEventId'

  if (testcal) {
    // create calendar events for contact
    const initialEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `First meeting with ${name}`,
        start: { date: firstMetString },
        end: { date: firstMetString }
      }
    })
    initialEventId = initialEvent.data.id
    const followUpEvent = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `${name} follow up`,
        start: { date: followUpDateString },
        end: { date: followUpDateString }
      }
    })
    followUpEventId = followUpEvent.data.id

  }

  if (initialEventId && followUpEventId) {
    const newContact: Contact = {
      name: name,
      birthday: bday,
      company: company,
      role: role,
      firstMet: { date: firstMetString, eventId: initialEventId },
      lastInteraction: { date: firstMetString, eventId: initialEventId },
      notes: [{ title: 'First Meeting', date: firstMet }],
      followUpDate: { date: followUpDateString, eventId: followUpEventId },
    }

    await saveContactToFile(newContact)

    console.log("Created new contact")

  }

}

export const fetchContact = async (contactName: string): Promise<void> => {

  const filePath = `${contactsDir}${contactName}/info.json`
  console.log('Trying to read', filePath)

  try {
    const content: Contact = JSON.parse(await fs.readFile(filePath, 'utf-8'))
    console.log(content)

  } catch (error) {
    console.error(error)
  }

}

export const fetchAttribute = async (attribute: string): Promise<void> => {

  const contactDetails: Contact = JSON.parse(await fs.readFile(`${contactsDir}${process.argv[3]}/info.json`, 'utf-8'))

  switch (attribute) {
    case '-b':
      console.log(`${process.argv[3]}'s bday is on ${contactDetails.birthday}`)
      break
    case '-l':
      console.log(`Last interaction with ${process.argv[3]} was on ${contactDetails.lastInteraction.date}`)
      break
    case '-n':
      console.log(`Next interaction with ${process.argv[3]} is on ${contactDetails.followUpDate.date}`)
      break
    default:
      break
  }

}