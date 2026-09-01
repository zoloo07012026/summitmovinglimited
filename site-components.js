const PHONE = '(847) 370-5754';
const PHONE_HREF = 'tel:8473705754';
const ADDRESS = '10350 Dearlove Rd, Glenview, IL 60025';

const iconPhone = '<svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const iconChevron = '<svg class="chevron" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const iconMenu = '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const iconClose = '<svg viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

function homeHref(anchor) {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  return path === 'index.html' || path === '' ? anchor : `index.html${anchor}`;
}

class SummitHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || '';
    const isActive = name => active === name ? ' active' : '';
    const quoteHref = homeHref('#quote');
    const aboutHref = homeHref('#about');
    const guideHref = homeHref('#how');
    const contactHref = homeHref('#contact');

    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        /* The host stays in the flow purely as a spacer; the bar itself is lifted out with
           position:fixed so it rides along the top of the viewport on scroll. Both heights
           must stay in step -- see the 640px block below. */
        :host{display:block;height:112px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
        *{box-sizing:border-box;}
        a{color:inherit;text-decoration:none;}
        button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit;}
        header{
          position:fixed;
          top:0;
          left:0;
          right:0;
          z-index:100;
          height:112px;
          background:rgba(255,255,255,.92);
          backdrop-filter:saturate(180%) blur(10px);
          border-bottom:1px solid #e2e8f0;
          box-shadow:0 8px 24px rgba(12,27,58,.04);
        }
        .header-inner{
          width:100%;
          max-width:none;
          height:100%;
          margin:0 auto;
          padding:0 clamp(40px,3.6vw,68px);
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
        }
        /* The logo fills the bar's full height, so its size is driven by header{height} alone. */
        .logo-link{height:100%;display:flex;align-items:center;flex-shrink:0;}
        .logo-link img{height:100%;width:auto;object-fit:contain;display:block;}
        .main-nav{display:flex;align-items:center;justify-content:center;gap:10px;flex:1;}
        .nav-item{position:relative;}
        .nav-item > a,.nav-item > button{
          display:flex;
          align-items:center;
          gap:6px;
          padding:7px 12px;
          border-radius:8px;
          font-size:14.5px;
          font-weight:700;
          color:#0c1b3a;
          transition:background .15s ease,color .15s ease;
        }
        .nav-item > a:hover,.nav-item > button:hover{background:#f1f5f9;}
        .nav-item.active > a,.nav-item.active > button{color:#1e5fd9;}
        .nav-underline{position:absolute;left:12px;right:12px;bottom:-1px;height:2px;background:#1e5fd9;border-radius:2px;}
        .chevron{width:14px;height:14px;transition:transform .15s ease;}
        .nav-item:hover .chevron,.nav-item:focus-within .chevron{transform:rotate(180deg);}
        .dropdown{
          position:absolute;
          top:calc(100% + 8px);
          left:0;
          min-width:190px;
          background:#fff;
          border:1px solid #e2e8f0;
          border-radius:12px;
          padding:8px;
          box-shadow:0 24px 60px rgba(12,27,58,.14);
          opacity:0;
          visibility:hidden;
          transform:translateY(-6px);
          transition:opacity .15s ease,transform .15s ease,visibility .15s ease;
        }
        .nav-item:hover .dropdown,.nav-item:focus-within .dropdown{opacity:1;visibility:visible;transform:translateY(0);}
        .dropdown a{display:block;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:600;color:#475569;white-space:nowrap;}
        .dropdown a:hover{background:#eaf1ff;color:#1e5fd9;}
        .header-right{display:flex;align-items:center;gap:16px;flex-shrink:0;}
        .phone-link{display:flex;align-items:center;gap:11px;font-weight:800;font-size:21.5px;color:#1e5fd9;white-space:nowrap;}
        .phone-link svg{width:28px;height:28px;}
        .btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          padding:9px 16px;
          border-radius:10px;
          font-weight:700;
          font-size:15px;
          white-space:nowrap;
          background:#ff751f;
          color:#fff;
          box-shadow:0 1px 2px rgba(12,27,58,.06);
          transition:transform .15s ease,box-shadow .15s ease,background .15s ease;
        }
        .btn:hover{background:#e96312;box-shadow:0 8px 24px rgba(12,27,58,.08);transform:translateY(-1px);}
        .mobile-toggle{display:none;width:44px;height:44px;align-items:center;justify-content:center;border-radius:8px;color:#0c1b3a;}
        .mobile-toggle:hover{background:#f1f5f9;}
        .mobile-toggle svg{width:24px;height:24px;}
        .mobile-menu{
          display:none;
          position:fixed;
          inset:0;
          background:#fff;
          z-index:200;
          padding:24px 32px;
          overflow-y:auto;
        }
        .mobile-menu.open{display:block;}
        .mobile-menu-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;}
        .mobile-menu-top img{height:48px;}
        .mobile-close{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:8px;}
        .mobile-close:hover{background:#f1f5f9;}
        .mobile-close svg{width:28px;height:28px;}
        .mobile-menu nav{display:flex;flex-direction:column;gap:4px;}
        .mobile-menu nav a,.mobile-menu nav .m-group-label{
          padding:14px 4px;
          font-size:17px;
          font-weight:700;
          color:#0c1b3a;
          border-bottom:1px solid #e2e8f0;
        }
        .mobile-sub{padding-left:16px;}
        .mobile-sub a{font-size:15px;font-weight:600;color:#475569;border-bottom:0;padding:10px 4px;}
        .mobile-menu .btn{margin-top:24px;width:100%;}
        .mobile-menu .phone-link{margin-top:16px;justify-content:center;font-size:18px;}
        @media(max-width:1080px){
          .main-nav,.header-right .phone-link{display:none;}
          .mobile-toggle{display:flex;}
        }
        @media(max-width:640px){
          :host{height:76px;}
          header{height:76px;}
          .header-inner{padding:0 20px;}
          .header-right{gap:10px;}
          .header-right .btn{display:none;}
          .header-right .phone-link{
            display:flex;
            gap:6px;
            font-size:15px;
            font-weight:800;
          }
          .header-right .phone-link svg{width:19px;height:19px;}
        }
      </style>
      <header>
        <div class="header-inner">
          <a href="index.html" class="logo-link"><img src="assets/logo.png" alt="Summit Moving Limited"></a>
          <nav class="main-nav" aria-label="Main navigation">
            <div class="nav-item${isActive('home')}"><a href="index.html">Home${active === 'home' ? '<span class="nav-underline"></span>' : ''}</a></div>
            <div class="nav-item${isActive('services')}"><a href="services.html">Services${active === 'services' ? '<span class="nav-underline"></span>' : ''}</a></div>
            <div class="nav-item"><a href="${guideHref}">Moving Guide</a></div>
            <div class="nav-item${isActive('blog')}"><a href="blog.html">Blog${active === 'blog' ? '<span class="nav-underline"></span>' : ''}</a></div>
            <div class="nav-item${isActive('company')}">
              <button type="button">Company ${iconChevron}</button>
              <div class="dropdown">
                <a href="${aboutHref}">About Us</a>
                <a href="faq.html">FAQ</a>
                <a href="${contactHref}">Contact</a>
              </div>
            </div>
          </nav>
          <div class="header-right">
            <a href="${PHONE_HREF}" class="phone-link">${iconPhone}${PHONE}</a>
            <a href="${quoteHref}" class="btn">Get a Free Quote</a>
            <button class="mobile-toggle" type="button" aria-label="Open menu">${iconMenu}</button>
          </div>
        </div>
      </header>
      <div class="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-top">
          <img src="assets/logo.png" alt="Summit Moving Limited">
          <button class="mobile-close" type="button" aria-label="Close menu">${iconClose}</button>
        </div>
        <nav aria-label="Mobile navigation">
          <a href="index.html">Home</a>
          <a href="services.html">Services</a>
          <a href="${guideHref}">Moving Guide</a>
          <a href="blog.html">Blog</a>
          <div class="m-group-label">Company</div>
          <div class="mobile-sub">
            <a href="${aboutHref}">About Us</a>
            <a href="faq.html">FAQ</a>
            <a href="${contactHref}">Contact</a>
          </div>
        </nav>
        <a href="${PHONE_HREF}" class="phone-link">${iconPhone}${PHONE}</a>
        <a href="${quoteHref}" class="btn">Get a Free Quote</a>
      </div>
    `;

    const menu = this.shadowRoot.querySelector('.mobile-menu');
    this.shadowRoot.querySelector('.mobile-toggle').addEventListener('click', () => {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    this.shadowRoot.querySelector('.mobile-close').addEventListener('click', () => this.closeMenu(menu));
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu(menu));
    });
  }

  closeMenu(menu) {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

class SummitFooter extends HTMLElement {
  connectedCallback() {
    const aboutHref = homeHref('#about');
    const contactHref = homeHref('#contact');

    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        :host{display:block;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
        *{box-sizing:border-box;}
        a{color:inherit;text-decoration:none;}
        ul{list-style:none;margin:0;padding:0;}
        .wrap{max-width:1240px;margin:0 auto;padding:0 28px;}
        footer{background:#0c1b3a;color:#c7d3ef;padding:54px 0 0;}
        .footer-grid{
          display:grid;
          grid-template-columns:1.3fr .8fr .8fr 1.15fr 1.25fr;
          gap:34px;
          padding-bottom:42px;
          border-bottom:1px solid rgba(255,255,255,.1);
        }
        .footer-logo img{height:128px;width:auto;background:#fff;border-radius:8px;padding:4px;margin-bottom:16px;}
        .footer-about p{font-size:14px;color:#aebbdd;max-width:300px;line-height:1.6;margin:0;}
        .social-row{display:flex;gap:12px;margin-top:22px;}
        .social-row a{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;color:#fff;}
        .social-row a:hover{background:rgba(59,123,245,.28);}
        .social-row svg{width:18px;height:18px;}
        .footer-col h5{color:#fff;font-size:15px;margin:0 0 16px;font-weight:800;}
        .footer-col li{margin-bottom:11px;color:#aebbdd;font-size:14px;line-height:1.45;}
        .footer-col a:hover{color:#fff;}
        .footer-contact li{display:flex;gap:10px;align-items:flex-start;}
        .footer-contact svg{width:18px;height:18px;color:#6ea0ff;flex-shrink:0;margin-top:1px;}
        .footer-hours li{display:grid;grid-template-columns:90px 1fr;gap:12px;}
        .footer-hours li span:first-child{font-weight:800;color:#c7d3ef;}
        .footer-hours .closed{color:#8593b8;}
        .footer-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:22px 0;color:#8593b8;font-size:13.5px;}
        .footer-bottom-links{display:flex;gap:22px;}
        .footer-bottom a:hover{color:#fff;}
        @media(max-width:1080px){
          .footer-grid{grid-template-columns:1.2fr 1fr 1fr;gap:34px;}
        }
        @media(max-width:640px){
          .wrap{padding:0 20px;}
          .footer-grid{grid-template-columns:1fr;gap:32px;}
          .footer-bottom{align-items:flex-start;flex-direction:column;}
        }
      </style>
      <footer>
        <div class="wrap">
          <div class="footer-grid">
            <div class="footer-about">
              <div class="footer-logo"><img src="assets/logo.jpg" alt="Summit Moving Limited"></div>
              <p>Premium moving services with exceptional care. Licensed, insured, and trusted by thousands of happy clients across the country.</p>
              <div class="social-row">
                <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></a>
                <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
              </div>
            </div>
            <div class="footer-col">
              <h5>Services</h5>
              <ul>
                <li><a href="services.html#local-moving">Local Moving</a></li>
                <li><a href="services.html#long-distance">Long-Distance Moving</a></li>
                <li><a href="services.html#packing">Packing Services</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Company</h5>
              <ul>
                <li><a href="${aboutHref}">About Us</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="faq.html">FAQ</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Contact</h5>
              <ul class="footer-contact">
                <li>${iconPhone}${PHONE}</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/></svg>info@summitmovingltd.com</li>
                <li><svg viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>${ADDRESS}</li>
              </ul>
            </div>
            <div class="footer-col">
              <h5>Hours</h5>
              <ul class="footer-hours">
                <li><span>Mon - Fri</span><span>8:00 AM - 7:00 PM</span></li>
                <li><span>Saturday</span><span>9:00 AM - 5:00 PM</span></li>
                <li><span>Sunday</span><span class="closed">Closed</span></li>
                <li><span>Emergency</span><span>24/7 Support</span></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>&copy; 2026 Summit Moving Limited. All rights reserved.</span>
            <div class="footer-bottom-links">
              <a href="privacy.html">Privacy Policy</a>
              <a href="terms.html">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('summit-header', SummitHeader);
customElements.define('summit-footer', SummitFooter);
