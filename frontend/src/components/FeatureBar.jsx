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
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-2xl border border-[#f3e8ff] bg-white px-4 py-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3e8ff] to-[#fff1f2] text-[#7c3aed]">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-[#1e1b4b]">{feature.title}</h4>
                  <p className="text-xs text-[#78716c]">{feature.subtitle}</p>
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
