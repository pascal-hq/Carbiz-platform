import { Car, Shield, Users, Zap, Target, Heart } from "lucide-react";

export const metadata = {
  title: "About Us - CarBiz",
  description: "Learn about CarBiz - Kenya's trusted automotive marketplace.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About CarBiz</h1>
        <p className="text-lg text-gray-600">
          Kenya&apos;s trusted automotive marketplace — connecting buyers, sellers,
          and everyone in between.
        </p>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <div className="prose prose-lg text-gray-700 space-y-4">
          <p>
            CarBiz was founded with a simple mission: make car transactions in
            Kenya seamless, transparent, and trustworthy. Whether you&apos;re
            buying your first car, selling a vehicle you&apos;ve outgrown, need
            quick cash against your logbook, or want a reliable rental for a
            trip — we&apos;ve got you covered.
          </p>
          <p>
            We combine modern technology with deep local expertise to serve
            customers across the country. Every vehicle listed on our platform
            is verified, and every transaction is handled with the care and
            professionalism you deserve.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature
            icon={<Car className="h-8 w-8" />}
            title="Buy & Sell Cars"
            description="New and used vehicles from trusted sellers across Kenya."
          />
          <Feature
            icon={<Zap className="h-8 w-8" />}
            title="Logbook Loans"
            description="Quick cash against your vehicle logbook with fair rates."
          />
          <Feature
            icon={<Users className="h-8 w-8" />}
            title="Car Hire"
            description="Flexible daily, weekly, and monthly car rental options."
          />
          <Feature
            icon={<Shield className="h-8 w-8" />}
            title="Trusted & Secure"
            description="Verified listings, secure data handling, and honest service."
          />
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <ValueCard
            icon={<Target className="h-6 w-6" />}
            title="Transparency"
            description="No hidden fees, no misleading listings. What you see is what you get."
          />
          <ValueCard
            icon={<Heart className="h-6 w-6" />}
            title="Customer First"
            description="Every decision we make starts with what's best for our customers."
          />
          <ValueCard
            icon={<Shield className="h-6 w-6" />}
            title="Integrity"
            description="We do the right thing — even when no one is watching."
          />
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          Browse our inventory or reach out to our team today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/vehicles"
            className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Browse Vehicles
          </a>
          <a
            href="/contact"
            className="border border-primary text-primary px-8 py-3 rounded-lg font-medium hover:bg-primary/5 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition text-center">
      <div className="bg-blue-50 text-primary w-14 h-14 rounded-lg flex items-center justify-center mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="bg-white text-primary w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto border">
        {icon}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}