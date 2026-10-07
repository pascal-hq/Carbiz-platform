import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the primary image URL from a vehicle, with fallback.
 */
export function getPrimaryImage(
  images:
    | { url: string; is_primary: boolean; display_order: number }[]
    | undefined
    | null
): string {
  if (!images || images.length === 0) {
    return "https://picsum.photos/seed/placeholder/800/600";
  }
  const primary = images.find((img) => img.is_primary);
  if (primary) return primary.url;
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  return sorted[0].url;
}

/**
 * Format price in KES.
 */
export function formatPrice(amount: number): string {
  return `KES ${amount.toLocaleString()}`;
}