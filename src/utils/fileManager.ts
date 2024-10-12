import * as fs from 'fs-extra'
import { Contact } from 'contacts/contact'

const contactsDir = 'contacts/'

export const saveContactToFile = (contact: Contact): void => {
  const filePath = `${contactsDir}${contact.name}/info.md`;
  const content = `
  # ${contact.name}
  - **Company**: ${contact.company}
  - **Role**: ${contact.role}
  - **First Met**: ${contact.firstMet}
  - **Last Interaction**: ${contact.lastInteraction}

  ## Notes
  ${contact.notes.map(note => `- ${note.date}: ${note.title}`).join('\n')}

  ## Follow-Up
  - **Next Meeting Date**: ${contact.followUpDate}
  `;

  fs.outputFile(filePath, content, err => {
    console.error(err) // => null
  });

}
