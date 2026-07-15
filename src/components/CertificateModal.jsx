import { useEffect, useRef } from 'react';

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);

export default function CertificateModal({ certificate, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!certificate) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [certificate, onClose]);

  if (!certificate) return null;

  const extension = certificate.file.split('.').pop().toLowerCase();
  const isImage = IMAGE_EXTENSIONS.has(extension);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="certificate-modal" role="dialog" aria-modal="true" aria-labelledby="certificate-title">
        <div className="modal-header">
          <div>
            <small>{certificate.issuer} · {certificate.year}</small>
            <h2 id="certificate-title">{certificate.title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close certificate preview">×</button>
        </div>
        <div className="modal-body">
          {isImage ? (
            <img src={certificate.file} alt={`${certificate.title} certificate`} />
          ) : (
            <iframe src={certificate.file} title={`${certificate.title} certificate PDF`} />
          )}
        </div>
        <div className="modal-footer">
          <span>{certificate.badge}</span>
          <a href={certificate.file} target="_blank" rel="noreferrer">Open full certificate ↗</a>
        </div>
      </div>
    </div>
  );
}
