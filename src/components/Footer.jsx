export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <a className="footer-brand" href="#about">YA<span>.</span></a>
        <p>Designed &amp; built with curiosity by Yogesh Ahlawat.</p>
        <p>© {new Date().getFullYear()} · Delhi, India <span className="footer-status"><i /> Available</span></p>
      </div>
    </footer>
  );
}
