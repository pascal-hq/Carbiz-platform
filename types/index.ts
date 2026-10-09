import type { Database } from "./database";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type VehicleInsert = Database["public"]["Tables"]["vehicles"]["Insert"];
export type VehicleUpdate = Database["public"]["Tables"]["vehicles"]["Update"];

export type VehicleImage = Database["public"]["Tables"]["vehicle_images"]["Row"];

export type LogbookLoan = Database["public"]["Tables"]["logbook_loans"]["Row"];
export type HireBooking = Database["public"]["Tables"]["hire_bookings"]["Row"];
export type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];
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

export type VehicleWithImages = Vehicle & {
  vehicle_images: VehicleImage[];
};

export type VehicleWithFeatures = VehicleWithImages & {
  vehicle_features?: (VehicleFeature & { features: Feature })[];
  additional_features?: string | null;
};

export type InquiryPhoto = Database["public"]["Tables"]["inquiry_photos"]["Row"];

export interface SellCarRequest extends Inquiry {
  inquiry_photos?: InquiryPhoto[];
}