import { Gift, Package, Truck, Heart, Sparkles } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { icon: Sparkles, text: '10,000+ Happy Customers' },
    { icon: Package, text: 'Premium Packaging' },
    { icon: Truck, text: 'Fast Delivery' },
    { icon: Heart, text: 'Personalised Gifting' },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 text-[#673ab7]">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">{badge.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
