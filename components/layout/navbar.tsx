"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "Sell Your Car", href: "/sell-your-car" },
  { label: "Logbook Loans", href: "/logbook-loans" },
  { label: "Car Hire", href: "/car-hire" },
  { label: "Financing", href: "/financing-calculator" },
  { label: "Insurance", href: "/insurance-calculator" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold text-primary">CarBiz</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <Link href="/vehicles">Browse Cars</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t py-3 px-4 flex flex-col space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild className="w-full">
            <Link href="/vehicles" onClick={() => setIsOpen(false)}>
              Browse Cars
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
}