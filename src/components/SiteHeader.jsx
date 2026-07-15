import { useEffect, useState } from 'react';

export default function SiteHeader({ navItems, activeHref }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.classList.toggle('menu-open', menuOpen);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#about" onClick={() => setMenuOpen(false)} aria-label="Yogesh Ahlawat — back to top">
          <span className="brand-mark">YA<span>.</span></span>
          <span className="brand-copy">Yogesh Ahlawat<small>Engineer &amp; builder</small></span>
        </a>

        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span /><span />
        </button>

        <nav id="site-navigation" className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Primary navigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={item.href === activeHref ? 'is-active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.index}</span>{item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="nav-cta" href="mailto:yahlawat1980@gmail.com">Let&apos;s talk <span>↗</span></a>
        </nav>
      </div>
    </header>
  );
}
