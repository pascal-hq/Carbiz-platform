import { createInquiry, type CreateInquiryData } from "../repositories/inquiry.repository";

export async function submitInquiry(data: CreateInquiryData) {
  return createInquiry(data);
}

import * as repo from "../repositories/inquiry.repository";

export async function getSellCarRequests() {
  return repo.findSellCarRequests();
}

export async function getInquiryWithPhotos(id: string) {
  return repo.findInquiryWithPhotos(id);
}