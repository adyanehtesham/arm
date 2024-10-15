export type Contact = {
	name: string;
	birthday: string;
	company: string;
	role: string;
	firstMet: Date;
	lastInteraction: Date;
	notes: { title: string, date: Date }[];
	followUpDate: Date;
};
