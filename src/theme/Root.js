import React, { useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Root({ children }) {
  const swUrl = useBaseUrl('/api-sandbox-sw.js');
  const scope = useBaseUrl('/');

  // API sandbox: answers "Send API Request" calls in the browser (static/api-sandbox-sw.js).
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swUrl, { scope }).catch(() => {});
    }
  }, [swUrl, scope]);

  useEffect(() => {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.id = 'image-lightbox';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <img src="" alt="Zoomed image" />
        <button class="lightbox-close">&times;</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Close lightbox function
    const closeLightbox = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Open lightbox function
    const openLightbox = (src, alt) => {
      const img = overlay.querySelector('img');
      img.src = src;
      img.alt = alt || 'Zoomed image';
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    // Event delegation for image clicks
    const handleClick = (e) => {
      const target = e.target;
      if (target.tagName === 'IMG' && target.closest('.markdown, article')) {
        // Don't zoom small icons or logos
        if (target.width > 100 && target.height > 100) {
          e.preventDefault();
          openLightbox(target.src, target.alt);
        }
      }
    };

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
        closeLightbox();
      }
    });

    // Close on escape key
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
      overlay.remove();
    };
  }, []);

  return <>{children}</>;
}

export default Root;
