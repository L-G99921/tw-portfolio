import React from 'react';

function Footer() {
  const socialLinks = [
    { label: 'YouTube', href: 'https://www.youtube.com/@EnergyGrid', icon: 'fab fa-youtube' },
    { label: 'X', href: 'https://x.com/EnergyGrid', icon: 'fab fa-x-twitter' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/energygrid/', icon: 'fab fa-linkedin-in' },
  ];

  return (
    <footer className="footer-simple">
      <div className="footer-simple__container">
        <div className="footer-simple__contact">
          <a href="mailto:info@energygrid.com">info@energygrid.com</a>
          <span className="footer-simple__sep">|</span>
          <a href="tel:+10000000000">+1 (000) 000-0000</a>
          <span className="footer-simple__sep">|</span>
          <span>123 Lorem St, Suite 000 Ipsum City, ST 00000</span>
        </div>

        <div className="footer-simple__bottom">
          <span className="footer-simple__copyright">
            © 2026 EnergyGrid Inc. All rights reserved.
          </span>

          <div className="footer-simple__social">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
