import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useI18n } from '../../i18n';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  const { t } = useI18n();

  const productLinks = [
    { label: t.footer.product.features, href: '#features' },
    { label: t.footer.product.plans, href: '#pricing' },
    // { label: t.footer.product.testimonials, href: '#testimonials' },
    { label: t.footer.product.faq, href: '#faq' },
  ];

  const companyLinks = [
    { label: t.footer.company.about, to: '/about' },
    { label: t.footer.company.contact, to: '/contact-us' },
  ];

  const legalLinks = [
    { label: t.footer.legal.privacy, to: '/privacy-policy' },
    { label: t.footer.legal.terms, to: '/terms-and-conditions' },
    { label: t.footer.legal.lgpd, to: '/data-protection' },
  ];

  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="mb-4 flex items-center">
              <img src={logo} alt="Nexus EduCare" className="w-full h-auto object-contain" />
            </a>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors duration-200 hover:bg-slate-700 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Produto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              {t.footer.product.title}
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Empresa */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              {t.footer.company.title}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-white uppercase">
              {t.footer.legal.title}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            &copy; {t.footer.copyright}
          </p>
          <p className="mt-2 text-center text-xs text-slate-600">
            {t.footer.recaptcha.prefix}{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-400"
            >
              {t.footer.recaptcha.privacy}
            </a>{' '}
            {t.footer.recaptcha.and}{' '}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-400"
            >
              {t.footer.recaptcha.terms}
            </a>{' '}
            {t.footer.recaptcha.suffix}
          </p>
        </div>
      </div>
    </footer>
  );
}
