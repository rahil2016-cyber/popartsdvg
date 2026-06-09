import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToHash = () => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
      scrollToHash();
      setTimeout(scrollToHash, 100);
      setTimeout(scrollToHash, 300);
    } else {
      // Force scroll to top on all scrolling elements after a short delay
      const scrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };
      
      scrollToTop();
      setTimeout(scrollToTop, 10);
      setTimeout(scrollToTop, 100);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
