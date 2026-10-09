import type { Database } from "./database";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
export type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];

export type VehicleImage = Database["public"]["Tables"]["vehicle_images"]["Row"];

export type LogbookLoan = Database["public"]["Tables"]["logbook_loans"]["Row"];
export type HireBooking = Database["public"]["Tables"]["hire_bookings"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
export type InquiryPhoto = Database["public"]["Tables"]["inquiry_photos"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];

export type Feature = Database["public"]["Tables"]["features"]["Row"];
export type VehicleFeature = Database["public"]["Tables"]["vehicle_features"]["Row"];

export type FeatureCategory =
  | "comfort_luxury"
  | "technology"
  | "safety"
  | "performance"
  | "exterior";

export const FEATURE_CATEGORIES: Record<FeatureCategory, string> = {
  comfort_luxury: "Comfort & Luxury",
  technology: "Technology & Infotainment",
  safety: "Safety & Driver Assistance",
  performance: "Performance & Drivetrain",
  exterior: "Exterior & Styling",
};

/**
 * Vehicle joined with its images (used in listings and cards).
 */
export type VehicleWithImages = Vehicle & {
  vehicle_images: VehicleImage[];
};

/**
 * Vehicle joined with images AND features (used on the public detail page).
 */
export type VehicleWithFeatures = VehicleWithImages & {
  vehicle_features?: (VehicleFeature & { features: Feature })[];
  additional_features?: string | null;
};

/**
 * A sell car request (an inquiry with `type = 'sell_car'` and photo attachments).
 */
export type SellCarRequest = Inquiry & {
  inquiry_photos?: InquiryPhoto[];
};

/**
 * Overrides for auto-generated types.
 * Supabase's type generator lags behind DB constraint changes,
 * so we define the authoritative list here.
 */
export type InquiryType =
  | "general"
  | "sell_car"
  | "buy_car"
  | "loan"
  | "hire"
  | "financing"
  | "insurance";

export interface CreateInquiryData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: InquiryType;
}