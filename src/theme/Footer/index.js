import React from 'react';

// Inline icons instead of Font Awesome: three icons don't justify a 100 KB stylesheet.
const icons = {
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.55 4.78 5.87v5.58h-4v-4.95c0-1.18-.02-2.7-1.7-2.7-1.7 0-1.95 1.28-1.95 2.6v5.05H9.5v-11Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M3 6h18v12H3z M3 7l9 6 9-6" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  ),
};

const links = [
  {label: 'LinkedIn', href: 'https://www.linkedin.com/in/leandro-gabriel-8aab31167/', icon: 'linkedin'},
  {label: 'GitHub', href: 'https://github.com/L-G99921', icon: 'github'},
  {label: 'lgos99921@gmail.com', href: 'mailto:lgos99921@gmail.com', icon: 'mail'},
  {label: 'Websites for small businesses', href: 'https://leandrogabriel.vercel.app/', icon: 'globe'},
];

function Footer() {
  return (
    <footer className="lg-footer">
      <div className="container lg-footer__inner">
        <div>
          <span className="lg-footer__name">Leandro Gabriel Oliveira de Souza</span>
          <br />
          Senior Technical Writer · João Pessoa, Brazil · © {new Date().getFullYear()}
        </div>
        <nav className="lg-footer__links" aria-label="Contact">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.href.startsWith('http') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
              {icons[link.icon]}
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
