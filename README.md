So far the "app" creates a contact and stores it in a folder with an "info.json" file that holds information about that contact then, a first met and next interaction calendar event is created to keep track of those events in the users calendar.

I want the interaction to be so that you can enter a command like `ARM new` to create a new contact, and it takes you through steps. `ARM delete "Adyan"` would delete that contact. `ARM "adyan"` would setup a new interaction note or show details about that person. `ARM -r|b|l "adyan"` could show the relationship|bday|last interaction with/of "adyan".

# TODO
- [ ] Integrate with Google Calendar
    - [x] setup google calendar api and all that 2024-10-09
        - [x] setup api/oauth and google cloud
        - [x] test calendar stuff with your own code
        - [x] integrate with typescript
    - [x] When a contact is created add two events, one for the last interaction and one for the next potential one (usually a month later than previous)
- [ ] Make it so that when a file is saved, it is assumed a new interaction has taken place, so contents are read, meeting time is recorded and next potential date is added to the calendar
- [ ] new entry is saved by date
- [ ] create test data, contacts and all that
- [ ] I think I need to fix the Date object logic, so it follows the current timezone, and a format and i can add months/days and all that
- [ ] handle cli arguments

# REALLY LONG TERM TODO, POTENTIAL FEATURES
- add tags
- create relationships between contacts, family, SOs etc.
- full cli, can create, delete, edit contacts, add meetings, set new ones etc. with simple commands
- allow searching contacts, grab quick info e.g email, phone number or bday etc.
- ai generated summaries (because its 2024), so possible things to do/talk about in next interaction
    - the info.md can have links to all the notes (like obsidian) with summaries next to each one for what was talked about
- GUI??
    - could create a timeline view, single contact, whatever has been done overtime, with every contact, who you met when and what near future looks like, see bdays, anniversaries etc.

# 2024-10-08
    - set up project and file structure
    - setup a base "contacts" type
    - wrote code to create a contact and store it in the respective folder

# Examples

## To create a new contact

```
arm new
Name: ___
Company: ___
DoB: ___
First Meeting: ___
Relation: ___
Created <name>, setup next meeting for <first meeting + 1 month>
```
or
` arm new -n "<Name>" -b <bday> -f <first-meeting-date> -r <relationship> -c <company> `

## To fetch information of a contact Contact Card
``` arm <name> <name> <bday> <company> <relation> <firstMet> <nextMeeting> ...<interactions> ```
The birthday
```
arm -b <name>
<name>'s bday is on <bday>
```
The next meeting date
```
arm -n <name>
Next meeting with <name> on <next-meeting-date>
```