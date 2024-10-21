/**
 * All date formats are 'yyyy-mm-dd'
 */
export type Contact = {
	name: string
	birthday?: string
	company?: string
	role?: string
	firstMet: {
		date: string
		eventId?: string | null
	}
	lastInteraction: {
		date: string
		eventId: string | null
	}
	followUpDate: {
		date: string
		eventId: string | null
	}
	notes: { title: string, date: Date }[]
};
