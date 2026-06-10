import { motion } from 'framer-motion';
import { Gift, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="overflow-hidden bg-gradient-to-b from-white to-purple-50/35 min-h-[80vh]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#673ab7] to-[#ec407a] py-20 text-white md:py-24">
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
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold">About Us</h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 flex flex-col items-center"
            >
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] aspect-[3/4] overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-white">
                <img
                  src="/images/founder.jpg"
                  alt="Dr Samadnya - Founder of POPARTSDVG"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-playfair text-2xl font-bold text-[#1b1842]">Dr Samadnya</h3>
                <p className="text-sm font-semibold tracking-wider text-purple-600 uppercase mt-1">Founder, POPARTSDVG</p>
              </div>
            </motion.div>

            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
                <Heart className="h-3.5 w-3.5 fill-purple-500 text-purple-500" />
                Our Philosophy
              </div>
              
              <h2 className="font-playfair text-3xl font-bold text-[#1b1842] sm:text-4xl md:text-5xl leading-tight">
                Our Story
              </h2>
              
              <div className="space-y-6 text-[#5a5678] text-base sm:text-lg leading-relaxed">
                <p className="font-medium text-[#1b1842] text-lg sm:text-xl border-l-4 border-purple-500 pl-4 italic">
                  POPARTSDVG is a gifting studio built on one simple belief: every gift should tell a story.
                </p>
                
                <p>
                  We create thoughtfully curated hampers and personalized gifts that celebrate life's special moments and meaningful connections. Designed with love and attention to detail, our gifts are made to leave lasting smiles and unforgettable memories.
                </p>
              </div>

              <div className="pt-6 border-t border-purple-100 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#673ab7] to-[#ec407a] text-white">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1b1842]">Handcrafted with love</h4>
                  <p className="text-xs text-gray-500">Delivering premium gifting experiences</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
