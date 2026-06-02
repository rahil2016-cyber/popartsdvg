import { Gift, Heart, Smile, Truck } from 'lucide-react';

const features = [
  {
    icon: Gift,
    title: 'Premium Hampers',
    subtitle: 'Curated with love',
  },
  {
    icon: Heart,
    title: 'Cute & Unique Stationery',
    subtitle: 'Fun designs, premium quality',
  },
  {
    icon: Smile,
    title: 'Personalised Gifts',
    subtitle: 'Made just for you',
  },
  {
    icon: Truck,
    title: 'Fast & Safe Delivery',
    subtitle: 'Right to your doorstep',
  },
];

const FeatureBar = () => {
  return (
    <section className="bg-white px-4 py-6 md:py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-4 md:gap-6 scrollbar-hide snap-x">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex w-64 shrink-0 snap-center items-center gap-3 rounded-2xl border border-[#f3e8ff] bg-white px-4 py-3 shadow-sm transition hover:shadow-md md:w-auto md:px-4 md:py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3e8ff] to-[#fff1f2] text-[#7c3aed] md:h-12 md:w-12">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-semibold text-[#1e1b4b] md:text-sm">{feature.title}</h4>
                  <p className="text-[10px] text-[#78716c] md:text-xs">{feature.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureBar;
