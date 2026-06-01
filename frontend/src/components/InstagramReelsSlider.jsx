
import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const getFullMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : API_BASE_URL + url;
};

const InstagramReelsSlider = ({ posts }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: false,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {posts.map((post, index) => (
            <div key={index} className="min-w-0 flex-[0_0_80%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] pl-4 first:pl-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[9/16] overflow-hidden rounded-3xl shadow-xl"
              >
                <a
                  href="https://www.instagram.com/popartsdvg?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.media_type === 'video' ? (
                    <video
                      src={getFullMediaUrl(post.media_url)}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={getFullMediaUrl(post.media_url)}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  )}
                  {/* Reel/Post Indicator */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      {post.media_type === 'video' ? (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-sm font-semibold">Reel</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaInstagram className="h-4 w-4" />
                          <span className="text-sm font-semibold">Post</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100 duration-300">
                    <div className="flex items-center gap-6 text-white">
                      <div className="flex items-center gap-2">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="font-semibold">2.4k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <span className="font-semibold">340</span>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white/90 rounded-full shadow-xl flex items-center justify-center text-[#673ab7] hover:bg-white hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white/90 rounded-full shadow-xl flex items-center justify-center text-[#673ab7] hover:bg-white hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default InstagramReelsSlider;
