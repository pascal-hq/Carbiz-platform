export const metadata = {
  title: "Privacy Policy - CarBiz",
  description: "Learn how CarBiz collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
          <p>
            CarBiz (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy and is
            committed to protecting your personal data. This privacy policy
            explains how we collect, use, and safeguard your information when
            you use our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Personal identification:</strong> Name, email address,
              phone number when you fill out forms on our site.
            </li>
            <li>
              <strong>Vehicle details:</strong> Make, model, year, mileage, and
              other information when you list a car or apply for a loan.
            </li>
            <li>
              <strong>Usage data:</strong> Pages visited, IP address, browser
              type, and device information.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Facilitate car sales, logbook loans, and hire bookings.</li>
            <li>Contact you regarding your inquiries and applications.</li>
            <li>Improve our services and user experience.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Data Sharing</h2>
          <p>
            We do not sell your personal data to third parties. We may share
            your information with trusted partners who help us operate our
            platform (such as payment processors), only as necessary to provide
            our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            data from unauthorized access, alteration, or disclosure. All
            sensitive information is transmitted over encrypted connections.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the personal information we hold about you.</li>
            <li>Request corrections to inaccurate data.</li>
            <li>Request deletion of your data (subject to legal requirements).</li>
            <li>Opt out of marketing communications at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing
            experience, analyze usage, and deliver personalized content. You
            can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Contact Us</h2>
          <p>
            If you have questions about this privacy policy or how we handle
            your data, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> info@carbiz.co.ke
            <br />
            <strong>Phone:</strong> +254706432620
            <br />
            <strong>Address:</strong> Kimathi Street, Nairobi CBD, Nairobi, Kenya
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>
        </section>
      </div>
    </div>
  );
}