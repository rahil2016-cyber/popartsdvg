import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: false,
  });

  useEffect(() => {
    if (!emblaApi) return;

    // Autoplay functionality (rotates every 3 seconds for faster transition)
    const autoplay = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  // Hero images
  const heroImages = [
    '/images/my-hero-image.jpg.png',
    '/images/another-image.jpg.png',
  ];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {heroImages.map((src, index) => (
            <div key={index} className="min-w-0 flex-[0_0_100%] h-[160px] sm:h-[280px] md:h-[350px] lg:h-[400px] xl:h-[450px] overflow-hidden">
              <img
                src={src}
                alt={`Gift hamper ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-all"
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
