import { useEffect, useState } from 'react';
import { Container, Section } from '@/components/layout';
import { Button, Card, Input } from '@/components/common';
import {type ReactNode } from 'react';


const faqs: { question: string; answer: ReactNode }[] = [
  {
    question: 'What are your shipping times?',
    answer:
      'We ship orders within 1-2 business days. Delivery typically takes 3-5 business days depending on your location. Free shipping on orders above ₹500.',
  },
  {
    question: 'Is your Mishri really 100% natural?',
    answer:
      'Yes! Our Mishri is made from pure sugarcane juice with absolutely no additives, preservatives, or artificial ingredients. We follow traditional methods that have been used for centuries.',
  },
  {
    question: 'Do you offer bulk orders for businesses?',
    answer: (
      <>
        Absolutely! We work with restaurants, cafes, and retailers. Contact us at{' '}
        <a href="mailto:hello@tulsimishrika.com" className="text-gold hover:underline">
          hello@tulsimishrika.com
        </a>{' '}
        for bulk pricing and customization options.
      </>
    ),
  },
  {
    question: "What's your return policy?",
    answer:
      "We offer easy returns within 7 days of delivery if you're not satisfied. Simply contact our support team and we'll arrange a pickup.",
  },
];

export default function Contact() {
    useEffect(() => {
    if (window.location.hash === '#faq') {
      const faqSection = document.getElementById('faq');

      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      delete next.form;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const invalidFields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        ':invalid'
      )
    );

    if (invalidFields.length > 0) {
      const nextErrors: Record<string, string> = {};

      invalidFields.forEach((field) => {
        nextErrors[field.name] = field.validity.valueMissing
          ? 'This field is required'
          : field.validity.typeMismatch
            ? 'Please enter a valid email address'
            : 'Please enter a valid value';
      });

      setErrors(nextErrors);

      const firstInvalid = invalidFields[0];
      const header = document.querySelector('header');
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const fieldTop =
        firstInvalid.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, fieldTop - headerHeight - 24),
        behavior: 'smooth',
      });

      window.setTimeout(() => {
        firstInvalid.focus({ preventScroll: true });
      }, 350);

      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/send-contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});

const responseText = await response.text();

let result: any = {};

try {
  result = JSON.parse(responseText);
} catch {
  throw new Error(responseText || 'The server returned an invalid response.');
}

if (!response.ok) {
  throw new Error(result.error || 'Failed to send message');
}


      setSubmitted(true);

      window.setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setSubmitted(false);
        setErrors({});
      }, 3000);
      } catch (error) {
  setErrors({
    form: error instanceof Error
      ? error.message
      : 'Something went wrong. Please try again.',
  });
    } finally {
      setLoading(false);
    }
  };

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Header */}
      <Section background="cream-light" className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-brown-dark mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-brown-medium leading-relaxed">
              We'd love to hear from you. Whether you have a question about our products, 
              need assistance, or just want to say hello—we're here for you.
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section background="white" className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              {/* Address */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-dark mb-2">Visit Us</h3>
                    <p className="text-sm text-brown-medium leading-relaxed">
                      123 Mishri Lane,<br />
                      Traditional Market,<br />
                      Varanasi, Uttar Pradesh<br />
                      221001, India
                    </p>
                  </div>
                </div>
              </Card>

              {/* Phone */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-dark mb-2">Call Us</h3>
                    <p className="text-sm text-brown-medium">
                      <a href="tel:+919876543210" className="hover:text-gold transition-colors">
                        +91 98765 43210
                      </a>
                    </p>
                    <p className="text-sm text-brown-medium mt-1">
                      Mon-Sat: 9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>
              </Card>

              {/* Email */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-dark mb-2">Email Us</h3>
                    <p className="text-sm text-brown-medium">
                      <a href="mailto:hello@tulsimishrika.com" className="hover:text-gold transition-colors">
                        hello@tulsimishrika.com
                      </a>
                    </p>
                    <p className="text-sm text-brown-medium mt-1">
                      <a href="mailto:support@tulsimishrika.com" className="hover:text-gold transition-colors">
                        support@tulsimishrika.com
                      </a>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-dark mb-2">Follow Us</h3>
                    <div className="flex gap-3 mt-2">
                      <a href="#" className="text-brown-medium hover:text-gold transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                      <a href="#" className="text-brown-medium hover:text-gold transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a href="#" className="text-brown-medium hover:text-gold transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-3xl font-serif font-bold text-brown-dark mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-brown-dark mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-brown-medium">
                      Thank you for reaching out. We'll get back to you within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Name */}
                    <div>
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600" role="alert">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Input
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number (optional)"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600" role="alert">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-medium text-brown-dark mb-1"
                      >
                        Subject <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                        className="w-full px-4 py-2 border border-brown-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="product">Product Inquiry</option>
                        <option value="order">Order Support</option>
                        <option value="bulk">Bulk Orders</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && (
                        <p id="contact-subject-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-brown-dark mb-1"
                      >
                        Message <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                        className="w-full px-4 py-2 border border-brown-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                      {errors.message && (
                        <p id="contact-message-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {errors.form && (
                      <p className="text-sm text-red-600" role="alert">
                        {errors.form}
                      </p>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                      loading={loading}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="text-sm text-brown-medium text-center">
                      We typically respond within 24-48 hours during business days.
                    </p>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" background="cream-light" className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-brown-dark mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <Card key={faq.question} className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left"
                    >
                      <span className="text-lg font-semibold text-brown-dark">
                        {faq.question}
                      </span>
                      <svg
                        className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 8l5 5 5-5" />
                      </svg>
                    </button>

                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-brown-medium">{faq.answer}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
