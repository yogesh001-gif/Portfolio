import React from 'react';
import { motion } from 'framer-motion';
import { SOCIAL_LINKS } from '../data/content';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialItems = [
    { href: SOCIAL_LINKS.github, icon: 'fab fa-github', label: 'GitHub' },
    { href: SOCIAL_LINKS.linkedin, icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
    { href: SOCIAL_LINKS.email, icon: 'fas fa-envelope', label: 'Email' },
  ];

  return (
    <footer
      className="py-12 section-padding"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-primary)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-text-secondary text-sm"
          >
            © {currentYear}{' '}
            <span className="font-heading font-semibold text-text-primary">
              Yogesh Ahlawat
            </span>
            . Built with passion.
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            {socialItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={item.label}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-accent transition-all duration-300"
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                }}
                id={`footer-${item.label.toLowerCase()}`}
              >
                <i className={item.icon} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
