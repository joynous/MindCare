export type Event = {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  totalSeats: number;
  bookedSeats: number;
  description: string;
  speakers?: Array<{
    name: string;
    role: string;
    photo?: string;
  }>;
  eventImage: string;
};