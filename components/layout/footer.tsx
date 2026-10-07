import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-white">CarBiz</span>
          </div>
          <p className="text-sm leading-relaxed">
            Kenya&apos;s trusted platform for buying, selling, financing, and
            hiring vehicles.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/vehicles" className="hover:text-primary">Buy a Car</Link></li>
            <li><Link href="/sell-your-car" className="hover:text-primary">Sell Your Car</Link></li>
            <li><Link href="/logbook-loans" className="hover:text-primary">Logbook Loans</Link></li>
            <li><Link href="/car-hire" className="hover:text-primary">Car Hire</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +254 700 000 000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> info@carbiz.co.ke
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Nairobi, Kenya
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CarBiz. All rights reserved.
      </div>
    </footer>
  );
}