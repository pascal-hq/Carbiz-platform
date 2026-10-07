import { createHireBooking, type CreateHireBookingData } from "../repositories/booking.repository";

export async function submitHireBooking(data: CreateHireBookingData) {
  return createHireBooking(data);
}