import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/Footer';
import SiteHeader from '../components/SiteHeader';
import CertificateModal from '../components/CertificateModal';
import {
  ACADEMIC_PROFILE,
  CERTIFICATIONS,
  EDUCATION,
  HOME_NAV_ITEMS,
  INTERESTS,
  PROJECTS,
  SKILLS,
} from '../data/content';
import { getAcademicProgress } from '../utils/academicProgress';

function FinancePreview() {
  return (
    <div className="product-preview finance-preview" aria-hidden="true">
      <div className="preview-toolbar">
        <span />
        <span />
        <span />
        <b>Finwise</b>
      </div>
      <div className="finance-layout">
        <div className="mini-sidebar">
          <span className="mini-logo">F</span>
          <i className="is-active" />
          <i />
          <i />
          <i />
        </div>
        <div className="finance-canvas">
          <p>Monthly overview</p>
          <div className="balance-row">
            <div>
              <small>Available balance</small>
              <strong>₹48,240</strong>
            </div>
            <span>+12.4%</span>
          </div>
          <div className="chart-card">
            <div className="chart-heading">
              <small>Cash flow</small>
              <small>Last 6 months</small>
            </div>
            <div className="bars">
              {[44, 62, 52, 76, 66, 90].map((height, index) => (
                <i key={height} style={{ '--bar-height': `${height}%`, '--delay': `${index * 70}ms` }} />
              ))}
            </div>
          </div>
          <div className="finance-bottom-row">
            <div><small>Savings goal</small><strong>72%</strong></div>
            <div><small>AI insight</small><strong>On track ↗</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AwsPreview() {
  return (
    <div className="product-preview aws-preview" aria-hidden="true">
      <div className="preview-toolbar">
        <span />
        <span />
        <span />
        <b>aws × mait</b>
      </div>
      <div className="aws-canvas">
        <div className="aws-nav"><b>aws × mait</b><span>Academy &nbsp; Programs &nbsp; Community</span></div>
        <div className="aws-hero-copy">
          <small>BUILDING CLOUD-READY TALENT</small>
          <strong>Learn. Build.<br />Lead the cloud.</strong>
          <span>Explore programs →</span>
        </div>
        <div className="cloud-orbit">
          <div className="cloud-core"><i className="fas fa-cloud" /></div>
          <i className="orbit-dot dot-one" />
          <i className="orbit-dot dot-two" />
          <i className="orbit-dot dot-three" />
        </div>
        <div className="aws-stat-row"><span><b>12+</b> Cloud labs</span><span><b>3</b> Learning tracks</span></div>
      </div>
    </div>
  );
}

function SectionHeading({ index, eyebrow, title, description, inverse = false }) {
  return (
    <div className={`section-heading${inverse ? ' section-heading--inverse' : ''}`}>
      <div className="section-kicker"><span>{index}</span>{eyebrow}</div>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('#about');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [formValues, setFormValues] = useState({ name: '', email: '', subject: '', message: '' });
  const formStatusRef = useRef(null);

  const academicProgress = useMemo(
    () => getAcademicProgress({ ...ACADEMIC_PROFILE, currentDate: new Date() }),
    [],
  );

  useEffect(() => {
    document.title = 'Yogesh Ahlawat — Software Engineer & Builder';

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [showAllCertificates]);

  useEffect(() => {
    if (!formStatus.type) return undefined;
    const timeout = window.setTimeout(() => setFormStatus({ type: '', message: '' }), 7000);
    return () => window.clearTimeout(timeout);
  }, [formStatus]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const values = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, value.trim()]),
    );

    if (Object.values(values).some((value) => !value)) {
      setFormStatus({ type: 'error', message: 'Please complete all fields before sending.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      const response = await fetch('https://formspree.io/f/mldlegbr', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (!response.ok) throw new Error('Message could not be sent right now.');

      setFormStatus({ type: 'success', message: 'Thanks — your message is on its way.' });
      setFormValues({ name: '', email: '', subject: '', message: '' });
    } catch {
      setFormStatus({
        type: 'error',
        message: 'Something went wrong. You can email me directly at yahlawat1980@gmail.com.',
      });
      window.setTimeout(() => formStatusRef.current?.focus(), 50);
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleCertificates = showAllCertificates ? CERTIFICATIONS : CERTIFICATIONS.slice(0, 6);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader navItems={HOME_NAV_ITEMS} activeHref={activeSection} />

      <main id="main-content">
        <section id="about" className="site-hero">
          <div className="hero-noise" aria-hidden="true" />
          <div className="shell hero-grid">
            <div className="hero-copy" data-reveal>
              <div className="availability-pill">
                <span /> Open to internships &amp; collaborations
              </div>
              <p className="hero-intro">Hi, I&apos;m Yogesh — an ECE student who loves software.</p>
              <h1>I turn ideas into <em>working</em> digital products.</h1>
              <p className="hero-description">
                I combine thoughtful interfaces, practical engineering and AI-first thinking to build
                useful web experiences from Delhi, India.
              </p>
              <div className="hero-actions">
                <a className="button button--primary" href="#projects">Explore my work <span>↘</span></a>
                <a className="text-link" href="mailto:yahlawat1980@gmail.com">Let&apos;s work together <span>↗</span></a>
              </div>
              <dl className="hero-metrics" aria-label="Portfolio highlights">
                <div><dt>{String(PROJECTS.length).padStart(2, '0')}</dt><dd>Featured projects</dd></div>
                <div><dt>{CERTIFICATIONS.length}+</dt><dd>Certifications</dd></div>
                <div><dt>{academicProgress.semesterNumber}<sup>th</sup></dt><dd>Current semester</dd></div>
              </dl>
            </div>

            <div className="hero-portrait-wrap" data-reveal>
              <div className="portrait-backdrop" aria-hidden="true"><span>BUILD<br />LEARN<br />REPEAT</span></div>
              <div className="portrait-card">
                <img src="/profile-pic/profile.jpg" alt="Yogesh Ahlawat smiling" width="460" height="560" />
                <div className="portrait-caption">
                  <div><strong>Yogesh Ahlawat</strong><span>Software engineer in the making</span></div>
                  <span className="caption-arrow">↗</span>
                </div>
              </div>
              <div className="floating-note floating-note--top"><span>Based in</span><strong>Delhi, IN</strong></div>
              <div className="floating-note floating-note--bottom"><i className="fas fa-code" /><span>Currently building<br /><strong>with React + AI</strong></span></div>
            </div>
          </div>
          <div className="hero-ticker" aria-hidden="true">
            <div>WEB DEVELOPMENT <span>✦</span> ARTIFICIAL INTELLIGENCE <span>✦</span> PRODUCT THINKING <span>✦</span> CREATIVE ENGINEERING <span>✦</span></div>
          </div>
        </section>

        <section id="projects" className="section section--work">
          <div className="shell">
            <SectionHeading
              index="01"
              eyebrow="Selected work"
              title="Projects with purpose, not just pixels."
              description="A selection of projects where design decisions meet real engineering problems."
            />
            <div className="project-list">
              {PROJECTS.map((project, index) => (
                <article className={`project-card project-card--${index + 1}`} key={project.title} data-reveal>
                  <div className="project-visual">
                    {index === 0 ? <FinancePreview /> : <AwsPreview />}
                    <span className="project-index">0{index + 1}</span>
                  </div>
                  <div className="project-content">
                    <div className="project-meta"><span>Featured project</span><time>{project.year}</time></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <ul className="project-highlights">
                      {project.features.slice(0, 3).map((feature) => (
                        <li key={feature}>{feature.split(' - ')[0]}</li>
                      ))}
                    </ul>
                    <div className="tech-list">
                      {project.tech.map((tech) => <span key={tech}>{tech}</span>)}
                    </div>
                    <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                      View live project <span>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="section section--dark">
          <div className="shell">
            <SectionHeading
              index="02"
              eyebrow="Capabilities"
              title="A practical toolkit for turning concepts into products."
              description="I am early in my journey, but I learn fast, build often and care about the details."
              inverse
            />
            <div className="skills-layout">
              {SKILLS.map((skill, index) => (
                <article className="skill-card" key={skill.title} data-reveal>
                  <div className="skill-icon"><i className={skill.icon} /></div>
                  <span className="skill-number">0{index + 1}</span>
                  <h3>{skill.title}</h3>
                  <div className="skill-tags">
                    {skill.description.split(', ').map((item) => <span key={item}>{item}</span>)}
                  </div>
                </article>
              ))}
            </div>
            <div className="learning-strip" data-reveal>
              <span>Always exploring</span>
              {INTERESTS.map((interest) => <strong key={interest.label}>{interest.label}</strong>)}
            </div>
          </div>
        </section>

        <section id="journey" className="section section--journey">
          <div className="shell">
            <SectionHeading
              index="03"
              eyebrow="My journey"
              title="Learning by doing — one build at a time."
              description="My academic foundation and the path I am taking toward a career in software engineering."
            />
            <div className="journey-grid">
              <div className="journey-intro" data-reveal>
                <span className="journey-quote">“</span>
                <p>Engineering gave me the fundamentals. Building for the web taught me how to turn them into experiences people can actually use.</p>
                <div className="journey-signature">Yogesh <span>— curious by default</span></div>
              </div>
              <div className="timeline">
                {EDUCATION.map((item, index) => (
                  <article className="timeline-item" key={item.title} data-reveal>
                    <span className="timeline-marker">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <time>{item.date}</time>
                      <h3>{item.title}</h3>
                      <p className="timeline-place">{item.location}</p>
                      <p>{item.title === 'B.Tech in ECE' ? academicProgress.educationLine : item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="certifications" className="section section--certificates">
          <div className="shell">
            <SectionHeading
              index="04"
              eyebrow="Proof of learning"
              title="Certificates are milestones, not the finish line."
              description="Focused learning across AI, web development and modern productivity tools."
            />
            <div className="certificate-grid">
              {visibleCertificates.map((certificate, index) => (
                <button
                  type="button"
                  className="certificate-card"
                  key={certificate.title}
                  onClick={() => setSelectedCertificate(certificate)}
                  data-reveal
                >
                  <span className="certificate-icon"><i className={certificate.icon} /></span>
                  <span className="certificate-copy">
                    <small>{certificate.issuer} · {certificate.year}</small>
                    <strong>{certificate.title}</strong>
                    <em>{certificate.badge}</em>
                  </span>
                  <span className="certificate-open" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            {CERTIFICATIONS.length > 6 ? (
              <button
                className="button button--outline certificate-toggle"
                type="button"
                onClick={() => setShowAllCertificates((value) => !value)}
                aria-expanded={showAllCertificates}
              >
                {showAllCertificates ? 'Show fewer certificates' : `View all ${CERTIFICATIONS.length} certificates`}
                <span>{showAllCertificates ? '↑' : '↓'}</span>
              </button>
            ) : null}
          </div>
        </section>

        <section id="contact" className="section section--contact">
          <div className="shell contact-shell">
            <div className="contact-copy" data-reveal>
              <div className="section-kicker section-kicker--light"><span>05</span>Start a conversation</div>
              <h2>Have an idea?<br /><em>Let&apos;s build it.</em></h2>
              <p>I&apos;m open to internships, collaborations and interesting projects. Tell me what you&apos;re working on.</p>
              <a href="mailto:yahlawat1980@gmail.com" className="contact-email">yahlawat1980@gmail.com <span>↗</span></a>
              <div className="contact-socials">
                <a href="https://github.com/yogesh001-gif" target="_blank" rel="noreferrer">GitHub ↗</a>
                <a href="https://www.linkedin.com/in/yogeshahlawat/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit} data-reveal>
              <div className="form-row">
                <label><span>Your name</span><input name="name" value={formValues.name} onChange={handleInputChange} placeholder="Jane Smith" autoComplete="name" required /></label>
                <label><span>Your email</span><input type="email" name="email" value={formValues.email} onChange={handleInputChange} placeholder="jane@company.com" autoComplete="email" required /></label>
              </div>
              <label><span>What&apos;s this about?</span><input name="subject" value={formValues.subject} onChange={handleInputChange} placeholder="Internship, project or just saying hello" required /></label>
              <label><span>Tell me a little more</span><textarea name="message" rows="4" value={formValues.message} onChange={handleInputChange} placeholder="A few details about your idea..." required /></label>
              <button className="button button--lime" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending message…' : 'Send message'} <span>↗</span>
              </button>
              <p
                className={`form-status${formStatus.type ? ` form-status--${formStatus.type}` : ''}`}
                ref={formStatusRef}
                tabIndex="-1"
                role="status"
                aria-live="polite"
              >
                {formStatus.message}
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <CertificateModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />
    </>
  );
}
