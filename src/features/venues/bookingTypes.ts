/**
 * Minimal representation of an existing booking on a venue,
 * as needed by the BookingForm.
 */
export type ExistingBooking = {
  /** Check-in date (inclusive) in ISO format YYYY-MM-DD */
  dateFrom: string;
  /** Check-out date (exclusive) in ISO format YYYY-MM-DD */
  dateTo: string;
  /** Optional name of the customer who made the booking */
  customerName?: string;
};