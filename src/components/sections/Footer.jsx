import Icon from '../Icon';
import { PROFILE, SOCIAL_LINKS } from '../../data/content';
import { scrollToId } from '../../lib/store';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner pe">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}. Designed &amp; built with React, Three.js and a lot of coffee.
        </p>
        <div className="footer-actions">
          <a className="icon-btn" href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Icon name="github" />
          </a>
          <a className="icon-btn" href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Icon name="linkedin" />
          </a>
          {SOCIAL_LINKS.email && (
            <a className="icon-btn" href={`mailto:${SOCIAL_LINKS.email}`} aria-label="Email">
              <Icon name="mail" />
            </a>
          )}
          <button type="button" className="btn btn--small btn--ghost" onClick={() => scrollToId('hero')}>
            Back to top <Icon name="arrowUp" size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
