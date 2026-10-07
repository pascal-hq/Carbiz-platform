import { Vehicle } from "@/types";

export const vehicles: Vehicle[] = [
  {
    id: "1",
    slug: "toyota-harrier-2020",
    make: "Toyota",
    model: "Harrier",
    year: 2020,
    price: 4500000,
    mileage: 25000,
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    condition: "Used",
    description:
      "Well maintained Toyota Harrier with full service history. Accident free, one owner, keyless entry, reverse camera, leather seats.",
    images: [
      "https://picsum.photos/seed/car1/800/600",
      "https://picsum.photos/seed/car1b/800/600",
      "https://picsum.photos/seed/car1c/800/600",
    ],
    featured: true,
    status: "available",
  },
  {
    id: "2",
    slug: "honda-crv-2021",
    make: "Honda",
    model: "CR-V",
    year: 2021,
    price: 3800000,
    mileage: 18000,
    fuelType: "Petrol",
    transmission: "CVT",
    bodyType: "SUV",
    condition: "Used",
    description:
      "Excellent condition Honda CR-V, one owner, full service history, sunroof, alloy rims, reverse camera.",
    images: [
      "https://picsum.photos/seed/car2/800/600",
      "https://picsum.photos/seed/car2b/800/600",
    ],
    featured: true,
    status: "available",
  },
  {
    id: "3",
    slug: "mazda-cx5-2022",
    make: "Mazda",
    model: "CX-5",
    year: 2022,
    price: 4200000,
    mileage: 12000,
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    condition: "Used",
    description:
      "Like new Mazda CX-5. Low mileage, leather interior, BOSE sound system, adaptive cruise control.",
    images: [
      "https://picsum.photos/seed/car3/800/600",
      "https://picsum.photos/seed/car3b/800/600",
    ],
    featured: true,
    status: "available",
  },
  {
    id: "4",
    slug: "nissan-navara-2023",
    make: "Nissan",
    model: "Navara",
    year: 2023,
    price: 5200000,
    mileage: 5000,
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "Truck",
    condition: "New",
    description:
      "Brand new Nissan Navara double cab. 4WD, leather seats, tow bar, ready for any terrain.",
    images: [
      "https://picsum.photos/seed/car4/800/600",
      "https://picsum.photos/seed/car4b/800/600",
    ],
    status: "available",
  },
  {
    id: "5",
    slug: "subaru-outback-2021",
    make: "Subaru",
    model: "Outback",
    year: 2021,
    price: 3600000,
    mileage: 32000,
    fuelType: "Petrol",
    transmission: "CVT",
    bodyType: "SUV",
    condition: "Used",
    description:
      "Reliable Subaru Outback AWD. Perfect family car with excellent safety features and spacious interior.",
    images: [
      "https://picsum.photos/seed/car5/800/600",
      "https://picsum.photos/seed/car5b/800/600",
    ],
    status: "available",
  },
  {
    id: "6",
    slug: "mercedes-c200-2022",
    make: "Mercedes-Benz",
    model: "C200",
    year: 2022,
    price: 7500000,
    mileage: 8000,
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "Luxury",
    condition: "Used",
    description:
      "Luxury Mercedes C200 AMG line. Panoramic roof, ambient lighting, premium sound, sports package.",
    images: [
      "https://picsum.photos/seed/car6/800/600",
      "https://picsum.photos/seed/car6b/800/600",
    ],
    featured: true,
    status: "available",
  },
];

export const getFeaturedVehicles = () => vehicles.filter((v) => v.featured);
export const getVehicleBySlug = (slug: string) =>
  vehicles.find((v) => v.slug === slug);