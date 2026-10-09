import { ContactForm } from "@/components/forms/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us - CarBiz",
  description: "Get in touch with our team for any inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600">
            Have a question? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <Phone className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-gray-600 text-sm">+254706432620</p>
              <p className="text-gray-600 text-sm">Mon-Fri, 8am-6pm</p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-gray-600 text-sm">info@carbiz.co.ke</p>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <MapPin className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Office</h3>
              <p className="text-gray-600 text-sm">
                Kimathi Street, Nairobi CBD<br />
                Nairobi, Kenya
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-lg border shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}