import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClasses =
    'w-full px-5 py-3.5 rounded-xl text-sm outline-none transition-all duration-300 placeholder:text-text-muted/60';

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
  };

  const focusHandler = (e) => {
    e.target.style.borderColor = 'rgba(167, 139, 250, 0.4)';
    e.target.style.boxShadow = '0 0 20px rgba(167, 139, 250, 0.08)';
  };

  const blurHandler = (e) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <section id="contact" className="py-24 lg:py-32 section-padding relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}>
            Get in Touch
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
            Contact<span className="text-accent">.</span>
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Have a project in mind or just want to say hello? Drop me a message.
          </p>
        </motion.div>

        {/* Glassmorphism Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-8 lg:p-10"
          style={{
            background: 'rgba(15, 15, 26, 0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 0 60px rgba(167, 139, 250, 0.06), 0 4px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name"
                  className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Name
                </label>
                <input
                  type="text" id="contact-name" name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="Your name"
                  className={inputClasses}
                  style={inputStyle}
                  onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>
              <div>
                <label htmlFor="contact-email"
                  className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email" id="contact-email" name="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClasses}
                  style={inputStyle}
                  onFocus={focusHandler} onBlur={blurHandler}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message"
                className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                id="contact-message" name="message" required rows={5}
                value={formData.message} onChange={handleChange}
                placeholder="Tell me about your project..."
                className={`${inputClasses} resize-none`}
                style={inputStyle}
                onFocus={focusHandler} onBlur={blurHandler}
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center text-sm py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              id="contact-submit"
            >
              {status === 'sending' ? (
                <><i className="fas fa-spinner fa-spin" />Sending...</>
              ) : (
                <><i className="fas fa-paper-plane" />Send Message</>
              )}
            </motion.button>
          </form>

          {/* Status toasts */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 p-4 rounded-xl text-sm font-medium text-center"
                style={{
                  background: 'rgba(34,197,94,0.08)',
                  color: '#4ade80',
                  border: '1px solid rgba(34,197,94,0.15)',
                }}>
                <i className="fas fa-check-circle mr-2" />Message sent! I'll reply soon.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 p-4 rounded-xl text-sm font-medium text-center"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.15)',
                }}>
                <i className="fas fa-exclamation-circle mr-2" />
                {errorMsg || 'Something went wrong. Try again.'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
