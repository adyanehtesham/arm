import { promises as fs } from 'fs'
import { Contact } from 'contacts/contact'
import { calendar_v3 } from 'googleapis'

const contactsDir = 'contacts/'

export const saveContactToFile = async (contact: Contact): Promise<void> => {
  const filePath = `${contactsDir}${contact.name}/info.json`;
  const content = {
    name: contact.name,
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



export async function createTestContact(calendar: calendar_v3.Calendar) {
  // console.log("Let's get some details for this new contact")
  // const name = await askQuestion("What's their name?\n")
  // const company = await askQuestion("What's their company?\n")
  // const role = await askQuestion(`What's their role in ${company}?\n`)
  // const firstMet = new Date(await askQuestion("When did you meet?\n"))

  const name = 'Baseless'
  const company = 'Staples'
  const role = 'Tech Associate'
  const bday = '2002-04-02'
  const firstMet = new Date()
  const followUpDate = new Date()
  followUpDate.setDate(firstMet.getDate() + 30)

  // change it so that the firstMet and followUpDates have an calendar event id as well
  const newContact: Contact = {
    name: name,
    birthday: bday,
    company: company,
    role: role,
    firstMet: firstMet,
    lastInteraction: firstMet,
    notes: [{ title: 'First Meeting', date: firstMet }],
    followUpDate: followUpDate
  }

  await saveContactToFile(newContact)

  console.log("Created new contact")

  // create calendar events for contact
  // const initialEvent = await calendar.events.insert({
  //     calendarId: 'primary',
  //     requestBody: {
  //         summary: `First meeting with ${name}`,
  //         start: { date: firstMet.toISOString().split('T')[0] },
  //         end: { date: firstMet.toISOString().split('T')[0] }
  //     }
  // })
  // console.log(initialEvent.data)

  // const followUpEvent = await calendar.events.insert({
  //     calendarId: 'primary',
  //     requestBody: {
  //         summary: `${name} follow up`,
  //         start: { date: followUpDate.toISOString().split('T')[0] },
  //         end: { date: followUpDate.toISOString().split('T')[0] }
  //     }
  // })
  // console.log(followUpEvent.data)

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