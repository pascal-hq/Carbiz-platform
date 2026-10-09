import Link from "next/link";
import Image from "next/image";
import { Search, Car, BadgeDollarSign, FileText, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { getFeaturedVehicles } from "@/modules/vehicles/services/vehicle.service";

export default async function HomePage() {
  const featured = await getFeaturedVehicles();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Find Your Dream Car in Kenya
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Buy, sell, finance, or hire vehicles — all in one trusted platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/vehicles">
                    <Search className="mr-2 h-5 w-5" /> Browse Vehicles
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                >
                  <Link href="/sell-your-car">Sell Your Car</Link>
                </Button>
              </div>
            </div>

            {/* Right: Hero image */}
            <div
  className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
  style={{ minHeight: 400, height: 400 }}
>
              <Image
                src="/images/hero-car.webp"
                alt="Featured vehicle"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">What We Offer</h2>
          <p className="text-center text-gray-600 mb-10">
            Four services. One platform. All your car needs covered.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={<Car className="h-8 w-8" />}
              title="Buy a Car"
              description="Browse new & used vehicles from trusted sellers."
              href="/vehicles"
              cta="View Cars"
            />
            <ServiceCard
              icon={<BadgeDollarSign className="h-8 w-8" />}
              title="Sell Your Car"
              description="Get a free valuation and sell within days."
              href="/sell-your-car"
              cta="Start Selling"
            />
            <ServiceCard
              icon={<FileText className="h-8 w-8" />}
              title="Logbook Loans"
              description="Quick cash against your car logbook."
              href="/logbook-loans"
              cta="Apply Now"
            />
            <ServiceCard
              icon={<Key className="h-8 w-8" />}
              title="Car Hire"
              description="Rent a car for any occasion or trip."
              href="/car-hire"
              cta="Book Now"
            />
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
                <p className="text-gray-600">
                  Hand-picked cars from our collection.
                </p>
              </div>
              <Link
                href="/vehicles"
                className="text-primary font-medium hover:underline hidden md:block"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you want to buy, sell, get a loan, or hire a car — we&apos;re
            here to help.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-lg transition-shadow">
      <div className="bg-blue-50 text-primary w-14 h-14 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Link
        href={href}
        className="text-primary font-medium text-sm hover:underline"
      >
        {cta} →
      </Link>
    </div>
  );
}