import React, { useEffect } from 'react';

// TypeScript declarations for Smartsupp API
declare global {
  interface Window {
    _smartsupp?: any;
    smartsupp?: any;
  }
}

const LiveChat: React.FC = () => {
  useEffect(() => {
    // Remove any existing Tawk.to script to avoid conflicts
    const existingTawk = document.querySelector('script[src*="tawk.to"]');
    if (existingTawk) {
      existingTawk.remove();
    }

    // Load Smartsupp script
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = '9e17251528827e3eaa5741eb1ac9cd3f47368b02';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://www.smartsuppchat.com/loader.js?';

    // Smartsupp initialization function
    window.smartsupp || (function (d) {
      var s, c, o = window.smartsupp = function () { o._.push(arguments) }; o._ = [];
      s = d.getElementsByTagName('script')[0]; c = d.createElement('script');
      c.type = 'text/javascript'; c.charset = 'utf-8'; c.async = true;
      c.src = 'https://www.smartsuppchat.com/loader.js?'; s.parentNode.insertBefore(c, s);
    })(document);

    // Cleanup function
    return () => {
      const existingSmartsupp = document.querySelector('script[src*="smartsuppchat.com"]');
      if (existingSmartsupp) {
        existingSmartsupp.remove();
      }
      // Hide the widget if possible on unmount (Smartsupp doesn't have a simple remove, but removing script helps)
    };
  }, []);

  return (
    <noscript>
      Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a>
    </noscript>
  );
};

export default LiveChat;
