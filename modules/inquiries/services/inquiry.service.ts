import { createInquiry, type CreateInquiryData } from "../repositories/inquiry.repository";

export async function submitInquiry(data: CreateInquiryData) {
  return createInquiry(data);
}