import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#673ab7] to-[#ec407a] py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-white" />
          <div className="absolute left-10 bottom-10 h-60 w-60 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl">Get in Touch</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Have questions or want to place a custom order? We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-playfair text-3xl text-[#1b1842] md:text-4xl">Contact Information</h2>
              <p className="mt-4 text-[#5a5678]">
                Reach out to us through any of these channels. We're here to help with all your gifting needs!
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <Phone className="h-6 w-6 text-[#673ab7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1b1842]">Phone</h3>
                    <p className="mt-1 text-[#5a5678]">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <Mail className="h-6 w-6 text-[#673ab7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1b1842]">Email</h3>
                    <p className="mt-1 text-[#5a5678]">popartsdvg@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <MapPin className="h-6 w-6 text-[#673ab7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1b1842]">Location</h3>
                    <p className="mt-1 text-[#5a5678]">Bangalore, Karnataka, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <Clock className="h-6 w-6 text-[#673ab7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1b1842]">Working Hours</h3>
                    <p className="mt-1 text-[#5a5678]">Mon - Sat: 10:00 AM - 7:00 PM</p>
                    <p className="text-[#5a5678]">Sunday: By appointment only</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10">
                <h3 className="font-semibold text-[#1b1842]">Follow Us</h3>
                <div className="mt-4 flex gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-[#673ab7] hover:from-[#673ab7] hover:to-[#ec407a] hover:text-white transition"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-[#673ab7] hover:from-[#673ab7] hover:to-[#ec407a] hover:text-white transition"
                  >
                    <Phone className="h-6 w-6" />
                  </a>
                  <a
                    href="mailto:popartsdvg@gmail.com"
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-[#673ab7] hover:from-[#673ab7] hover:to-[#ec407a] hover:text-white transition"
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-10 rounded-2xl border border-purple-100 bg-purple-50 p-6">
                <h3 className="font-semibold text-[#1b1842]">Quick Help</h3>
                <ul className="mt-4 space-y-2 text-sm text-[#5a5678]">
                  <li>• Custom hamper requests</li>
                  <li>• Bulk & corporate orders</li>
                  <li>• Wedding & event gifting</li>
                  <li>• Delivery inquiries</li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-xl md:p-10">
                <h2 className="font-playfair text-2xl text-[#1b1842] md:text-3xl">Send us a Message</h2>
                <p className="mt-2 text-[#5a5678]">
                  Fill out the form below and we'll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#4a4458]">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#673ab7] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#4a4458]">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#673ab7] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#4a4458]">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#673ab7] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[#4a4458]">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#673ab7] focus:outline-none focus:ring-2 focus:ring-purple-100"
                      >
                        <option value="">Select subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Status</option>
                        <option value="custom">Custom Hamper</option>
                        <option value="bulk">Bulk & Corporate Order</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#4a4458]">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#673ab7] focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#673ab7] to-[#ec407a] py-4 font-semibold text-white shadow-lg hover:shadow-xl transition"
                  >
                    Send Message
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-purple-50/50 to-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#8e44ad]">
              FAQ
            </span>
            <h2 className="mt-4 font-playfair text-3xl text-[#1b1842] md:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How long does delivery take in Bangalore?',
                a: 'We offer same-day delivery for orders placed before 2 PM, and next-day delivery for all other orders within Bangalore.',
              },
              {
                q: 'Can I customize my hamper?',
                a: 'Absolutely! We love creating custom hampers. Use our "Build Your Own Hamper" feature or contact us directly for personalized requests.',
              },
              {
                q: 'Do you offer bulk or corporate gifting?',
                a: 'Yes! We specialize in bulk and corporate orders. Contact us for special pricing and customization options.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, UPI, and bank transfers. Cash on delivery is also available within Bangalore.',
              },
              {
                q: 'Can I include a personalized message?',
                a: 'Of course! You can add a personalized message during checkout, and we\'ll include a beautiful handwritten note with your hamper.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-[#1b1842]">{faq.q}</h3>
                <p className="mt-2 text-[#5a5678]">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
