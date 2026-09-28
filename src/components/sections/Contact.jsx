import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../Icon';
import { Reveal, SplitReveal, EASE } from '../motion';
import { SOCIAL_LINKS } from '../../data/content';
import { emit } from '../../lib/store';

const EMPTY = { name: '', email: '', message: '', company: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');
  const startedAt = useRef(Date.now());

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not send your message. Please try again.');
      setStatus('success');
      setForm(EMPTY);
      emit('contact-sent');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <section id="contact" data-station className="section contact">
      <div className="container">
        <div className="contact-card panel pe">
          <p className="eyebrow">06 — Contact</p>
          <SplitReveal as="h2" className="h2 xl" text="Let’s build something." />
          <Reveal as="p" className="body muted" delay={0.1}>
            Internship, collaboration or just a hello — my inbox is open. I usually reply within a day or two.
          </Reveal>

          <Reveal className="contact-links" delay={0.15}>
            {SOCIAL_LINKS.email && (
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="contact-link">
                <Icon name="mail" /> {SOCIAL_LINKS.email}
              </a>
            )}
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Icon name="linkedin" /> LinkedIn <Icon name="arrowUpRight" size={14} />
            </a>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="contact-link">
              <Icon name="github" /> GitHub <Icon name="arrowUpRight" size={14} />
            </a>
          </Reveal>

          <Reveal as="form" className="form" onSubmit={submit} delay={0.2} noValidate={false}>
            <div className="form-row">
              <label className="field">
                <span>Name</span>
                <input name="name" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={update} placeholder="Your name" />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" required maxLength={200} autoComplete="email" value={form.email} onChange={update} placeholder="you@example.com" />
              </label>
            </div>
            <label className="field">
              <span>Message</span>
              <textarea name="message" required minLength={10} maxLength={5000} rows={5} value={form.message} onChange={update} placeholder="Tell me about your idea…" />
            </label>
            {/* Honeypot: hidden from people, bots fill it in */}
            <label className="hp" aria-hidden="true">
              Company
              <input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={update} />
            </label>
            <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <Icon name="loader" className="spin" size={16} /> Sending…
                </>
              ) : (
                <>
                  Send message <Icon name="send" size={16} />
                </>
              )}
            </button>
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.p key="ok" className="toast toast--ok" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ease: EASE }}>
                  <Icon name="check" size={16} /> Message sent — thank you! I’ll get back to you soon.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p key="err" className="toast toast--err" role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ease: EASE }}>
                  <Icon name="alert" size={16} /> {error}
                </motion.p>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
