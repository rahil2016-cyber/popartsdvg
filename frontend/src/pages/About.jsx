import { motion } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Gift,
  Users,
  Star,
  TrendingUp,
  Package,
  CheckCircle2,
} from 'lucide-react';

const team = [
  { name: 'Priya', role: 'Founder & Curator', image: '/images/hero-dream-flower.png' },
  { name: 'Arjun', role: 'Design Lead', image: '/images/hero-hamper-toys.png' },
  { name: 'Meera', role: 'Customer Happiness', image: '/images/hero-return-gifts.png' },
];

const milestones = [
  { year: '2021', title: 'Started with a dream', desc: 'POPARTSDVG began in a small Bangalore apartment with a passion for thoughtful gifting.' },
  { year: '2022', title: '1000+ happy customers', desc: 'Expanded our product line and served our first 1000 customers across Bangalore.' },
  { year: '2023', title: 'Corporate partnerships', desc: 'Partnered with 50+ companies for their gifting needs.' },
  { year: '2024', title: 'Your trusted gifting partner', desc: 'Continuing to spread joy, one hamper at a time.' },
];

const values = [
  { icon: Heart, title: 'Made with Love', desc: 'Every hamper is hand-packed with care and attention to detail.' },
  { icon: Sparkles, title: 'Premium Quality', desc: 'We source only the finest products for your special moments.' },
  { icon: Users, title: 'Customer First', desc: 'Your happiness is our top priority — always.' },
  { icon: Gift, title: 'Thoughtful Gifting', desc: 'We believe gifting should be personal, not just transactional.' },
];

const SectionHeading = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10 text-center md:mb-12">
    {eyebrow && (
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#8e44ad]">
        {eyebrow}
      </span>
    )}
    <h2 className="font-playfair text-3xl text-[#1b1842] md:text-4xl">{title}</h2>
    {subtitle && <p className="mx-auto mt-3 max-w-2xl text-[#5a5678]">{subtitle}</p>}
  </div>
);

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#673ab7] to-[#ec407a] py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white" />
          <div className="absolute right-10 bottom-10 h-60 w-60 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl">Our Story</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Spreading joy, one thoughtfully curated hamper at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#8e44ad]">
                Our Mission
              </span>
              <h2 className="mt-4 font-playfair text-3xl text-[#1b1842] md:text-4xl">
                Making gifting personal & memorable
              </h2>
              <p className="mt-6 text-[#5a5678]">
                At POPARTSDVG, we believe that every gift tells a story. Whether it's a baby shower, birthday, wedding, or corporate event — we're here to help you express your love, gratitude, and celebration in the most beautiful way possible.
              </p>
              <p className="mt-4 text-[#5a5678]">
                Founded in Bangalore, we've grown from a small passion project to becoming the city's most loved gifting destination. Our mission is simple: to make every gift feel like it was made just for them.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#673ab7]" />
                  <span className="text-sm text-[#4a4458]">Hand-curated hampers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#673ab7]" />
                  <span className="text-sm text-[#4a4458]">Premium packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#673ab7]" />
                  <span className="text-sm text-[#4a4458]">Fast Bangalore delivery</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square overflow-hidden rounded-3xl">
                <img src="/images/hero-dream-flower.png" alt="Our Story" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#673ab7] to-[#ec407a]">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1b1842]">10,000+</p>
                    <p className="text-sm text-gray-500">Happy Customers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-b from-purple-50/50 to-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our Core Values"
            subtitle="These are the principles that guide everything we do at POPARTSDVG."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-purple-100 bg-white p-6 shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <Icon className="h-7 w-7 text-[#673ab7]" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#1b1842]">{value.title}</h3>
                  <p className="mt-2 text-sm text-[#5a5678]">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Journey"
            title="From Dream to Reality"
            subtitle="A look at how far we've come and where we're going."
          />
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1">
                  <div className={`rounded-2xl border border-purple-100 bg-white p-6 shadow-md ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ec407a]">{milestone.year}</span>
                    <h3 className="mt-2 text-lg font-semibold text-[#1b1842]">{milestone.title}</h3>
                    <p className="mt-2 text-sm text-[#5a5678]">{milestone.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#673ab7] to-[#ec407a]">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  {index < milestones.length - 1 && <div className="w-0.5 flex-1 bg-purple-200" />}
                </div>
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-b from-pink-50/50 to-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Meet the Team"
            title="The People Behind the Magic"
            subtitle="Our small but passionate team dedicated to making your gifting experience special."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-purple-100">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-[#1b1842]">{member.name}</h3>
                <p className="text-sm text-[#5a5678]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1b1842] to-[#4a148c] p-8 text-center text-white md:p-12">
            <Gift className="mx-auto h-12 w-12 text-pink-300" />
            <h2 className="mt-6 font-playfair text-3xl md:text-4xl">Ready to create something special?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/80">
              Let's work together to create the perfect gift for your special occasion.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/products"
                className="rounded-full bg-white px-8 py-3 font-semibold text-[#673ab7] hover:bg-gray-100"
              >
                Shop Now
              </a>
              <a
                href="/contact"
                className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white hover:bg-white/10"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
