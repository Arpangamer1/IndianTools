import React, { useEffect, useRef } from 'react';

export default function AdSlot({ id = 'default-slot', className = 'my-12' }) {
  const adRef = useRef(null);
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000';

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.debug('AdSense load note:', e);
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto ad-slot-container p-4 ${className}`}>
      <div className="w-full text-center">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium block mb-1">
          Advertisement
        </span>
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={clientId}
          data-ad-slot={id}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}
