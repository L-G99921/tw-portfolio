import React from 'react';

function Footer() {
  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/leandro-gabriel-8aab31167/', icon: 'fab fa-linkedin-in' },
    { label: 'GitHub', href: 'https://github.com/L-G99921', icon: 'fab fa-github' },
    { label: 'Email', href: 'mailto:lgos99921@gmail.com', icon: 'fas fa-envelope' },
  ];

  return (
    <footer className="footer-simple">
      <div className="footer-simple__container">
        <div className="footer-simple__contact">
          <a href="mailto:lgos99921@gmail.com">lgos99921@gmail.com</a>
          <span className="footer-simple__sep">|</span>
          <span>João Pessoa, Brazil</span>
          <span className="footer-simple__sep">|</span>
          <a
            href="https://www.linkedin.com/in/leandro-gabriel-8aab31167/"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/leandro-gabriel
          </a>
        </div>

        <div className="footer-simple__bottom">
          <span className="footer-simple__copyright">
            © {new Date().getFullYear()} Leandro Gabriel Oliveira de Souza. Built with Docusaurus.
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
