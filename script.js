/* ─────────────────────────────────────────────
   FENSEFE OKULU — script.js
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0.1 BACKGROUND PARTICLE SYSTEM (Canvas Particles) ── */
  const initBgParticles = () => {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        const colors = [
          'rgba(108, 61, 224, 0.5)',   // purple
          'rgba(6, 182, 212, 0.45)',    // teal
          'rgba(244, 185, 66, 0.35)'    // gold
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        // Mouse attraction
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.015;
            this.y -= dy * force * 0.015;
          }
        }
      }

      draw() {
        ctx.shadowBlur = this.size * 4;
        ctx.shadowColor = this.baseColor;
        ctx.fillStyle = this.baseColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 50 : 120;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            let opacity = (150 - distance) / 150 * 0.15;
            ctx.strokeStyle = `rgba(108, 61, 224, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawLines();
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animate();
  };

  initBgParticles();

  /* ── FLOATING GRADIENT ORBS ── */
  const initFloatingOrbs = () => {
    const orbContainer = document.createElement('div');
    orbContainer.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;';
    document.body.insertBefore(orbContainer, document.body.firstChild);

    const orbConfigs = [
      { size: 400, color: 'rgba(108,61,224,0.07)', x: '15%', y: '20%', duration: 25 },
      { size: 350, color: 'rgba(6,182,212,0.06)', x: '75%', y: '60%', duration: 30 },
      { size: 300, color: 'rgba(244,185,66,0.05)', x: '50%', y: '80%', duration: 35 },
    ];

    orbConfigs.forEach((cfg, i) => {
      const orb = document.createElement('div');
      orb.style.cssText = `
        position: absolute;
        width: ${cfg.size}px;
        height: ${cfg.size}px;
        left: ${cfg.x};
        top: ${cfg.y};
        background: radial-gradient(circle, ${cfg.color} 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(40px);
        animation: floatOrb${i} ${cfg.duration}s ease-in-out infinite alternate;
      `;
      orbContainer.appendChild(orb);
    });

    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatOrb0 {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(80px, -60px) scale(1.2); }
      }
      @keyframes floatOrb1 {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(-70px, 50px) scale(0.9); }
      }
      @keyframes floatOrb2 {
        0% { transform: translate(0, 0) scale(1); }
        100% { transform: translate(50px, -80px) scale(1.15); }
      }
    `;
    document.head.appendChild(style);
  };

  initFloatingOrbs();

  /* ── SMOOTH PARALLAX ── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-bg-img');
        if (hero) {
          hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        // Fade particles based on scroll
        const bgCanvas = document.getElementById('bg-particles');
        if (bgCanvas) {
          const opacity = Math.max(0.2, 1 - scrolled / 1500);
          bgCanvas.style.opacity = opacity;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ── 0. LOAD SAVED DATA FROM ADMIN PANEL ── */
  const loadAdminContent = () => {
    const raw = localStorage.getItem('fo_content');
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      
      // SEO
      if (d.seo_title) document.title = d.seo_title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && d.seo_desc) metaDesc.setAttribute('content', d.seo_desc);
      const metaKey = document.querySelector('meta[name="keywords"]');
      if (metaKey && d.seo_keywords) metaKey.setAttribute('content', d.seo_keywords);
      
      // Helper functions for updating DOM elements
      const el = (id) => document.getElementById(id);
      const updateText = (id, val) => { const e = el(id); if (e && val !== undefined) e.textContent = val; };
      const updateHTML = (id, val) => { const e = el(id); if (e && val !== undefined) e.innerHTML = val; };
      
      // Hero section overrides
      updateText('dom-hero-badge', d.hero_badge);
      updateText('dom-hero-left', d.hero_left);
      updateHTML('dom-hero-right', d.hero_right);
      updateText('dom-hero-combined', d.hero_combined);
      updateHTML('dom-hero-desc', d.hero_desc);
      
      // Stats overrides
      if (d.stat_followers) {
        const f = el('dom-stat-followers');
        if (f) {
          f.setAttribute('data-target', d.stat_followers.replace(/\D/g, ''));
          f.textContent = d.stat_followers;
        }
      }
      if (d.stat_posts) {
        const p = el('dom-stat-posts');
        if (p) {
          p.setAttribute('data-target', d.stat_posts.replace(/\D/g, ''));
          p.textContent = d.stat_posts;
        }
      }
      
      // About section overrides
      updateText('dom-about-title', d.about_title);
      updateText('dom-about-name', d.about_name);
      updateText('dom-about-quote', d.about_quote);
      updateText('dom-about-p1', d.about_p1);
      updateText('dom-about-p2', d.about_p2);
      
      // Courses section overrides
      updateText('dom-c1-icon', d.c1_icon);
      updateText('dom-c1-title', d.c1_title);
      updateText('dom-c1-desc', d.c1_desc);
      
      updateText('dom-c2-icon', d.c2_icon);
      updateText('dom-c2-title', d.c2_title);
      updateText('dom-c2-desc', d.c2_desc);
      
      updateText('dom-c3-icon', d.c3_icon);
      updateText('dom-c3-title', d.c3_title);
      updateText('dom-c3-desc', d.c3_desc);
      
      // Testimonials overrides
      updateText('dom-t1-text', d.t1_text);
      updateText('dom-t1-name', d.t1_name);
      updateText('dom-t1-role', d.t1_role);
      
      updateText('dom-t2-text', d.t2_text);
      updateText('dom-t2-name', d.t2_name);
      updateText('dom-t2-role', d.t2_role);
      
      updateText('dom-t3-text', d.t3_text);
      updateText('dom-t3-name', d.t3_name);
      updateText('dom-t3-role', d.t3_role);
      
      // Contact overrides
      updateHTML('dom-contact-title', d.contact_title);
      updateText('dom-contact-desc', d.contact_desc);
      
      // Social Links & Text
      if (d.social_ig) {
        document.querySelectorAll('a[href*="instagram.com"]').forEach(link => {
          link.href = `https://www.instagram.com/${d.social_ig}`;
          link.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().startsWith('@')) {
              node.nodeValue = ` @${d.social_ig}`;
            }
          });
        });
        const igUserSpan = document.querySelector('#contact-instagram-btn span:last-of-type');
        if (igUserSpan) igUserSpan.textContent = `@${d.social_ig}`;
      }
      
      if (d.social_yt) {
        document.querySelectorAll('a[href*="youtube.com"]').forEach(link => {
          link.href = `https://www.youtube.com/@${d.social_yt}`;
          link.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().startsWith('@')) {
              node.nodeValue = ` @${d.social_yt}`;
            }
          });
        });
        const ytUserSpan = document.querySelector('#contact-youtube-btn span:last-of-type');
        if (ytUserSpan) ytUserSpan.textContent = `@${d.social_yt}`;
      }
      
      // Footer quote overrides
      updateText('dom-footer-quote', d.footer_quote ? `"${d.footer_quote.replace(/^["']|["']$/g, '')}"` : '');
      updateText('dom-footer-cite', d.footer_cite ? `— ${d.footer_cite.replace(/^[—\s]*/, '')}` : '');
      
    } catch (e) {
      console.error("Admin data could not be parsed: ", e);
    }
  };
  
  // Execute admin content overrides
  loadAdminContent();

  // Floating Admin Panel button (only shown to authenticated administrators)
  if (sessionStorage.getItem('fo_admin_logged') === 'true') {
    const badge = document.createElement('a');
    badge.href = 'admin-panel.html';
    badge.innerHTML = '🔐 Yönetim Paneli';
    badge.style.position = 'fixed';
    badge.style.bottom = '20px';
    badge.style.left = '20px';
    badge.style.zIndex = '9999';
    badge.style.background = 'linear-gradient(135deg, #6c3de0 0%, #06b6d4 100%)';
    badge.style.color = '#fff';
    badge.style.padding = '12px 24px';
    badge.style.borderRadius = '100px';
    badge.style.fontSize = '0.85rem';
    badge.style.fontWeight = 'bold';
    badge.style.textDecoration = 'none';
    badge.style.boxShadow = '0 8px 32px rgba(108, 61, 224, 0.4)';
    badge.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    badge.style.border = '1px solid rgba(255, 255, 255, 0.25)';
    badge.style.backdropFilter = 'blur(8px)';
    
    badge.addEventListener('mouseover', () => {
      badge.style.transform = 'translateY(-4px) scale(1.05)';
      badge.style.boxShadow = '0 12px 40px rgba(108, 61, 224, 0.6)';
    });
    badge.addEventListener('mouseout', () => {
      badge.style.transform = 'translateY(0) scale(1)';
      badge.style.boxShadow = '0 8px 32px rgba(108, 61, 224, 0.4)';
    });
    
    document.body.appendChild(badge);
  }

  /* ── 1. NAVBAR — scroll + mobile toggle ── */
  const navbar    = document.getElementById('navbar');
  const toggleBtn = document.getElementById('nav-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  toggleBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  /* ── 2. SCROLL REVEAL ── */
  const revealElements = () => {
    const targets = document.querySelectorAll(
      '.approach-card, .course-card, .content-card, .testimonial-card, .about-content, .contact-inner, .footer-container > *, .pillar-badge, .ai-video-card, .reels-feed-container'
    );

    targets.forEach(el => {
      // Default to reveal-fade-up if no specific reveal class exists
      if (
        !el.classList.contains('reveal') &&
        !el.classList.contains('reveal-fade-up') &&
        !el.classList.contains('reveal-fade-left') &&
        !el.classList.contains('reveal-fade-right') &&
        !el.classList.contains('reveal-scale-up')
      ) {
        el.classList.add('reveal-fade-up');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  };

  revealElements();

  /* ── 3. COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const startTime = performance.now();

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);

      el.textContent = value.toLocaleString('tr-TR');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('tr-TR');
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ── 4. ACTIVE NAV LINK on scroll ── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── 5. CONTACT FORM ── */
  // Exposed globally for the onsubmit handler in HTML
  window.handleFormSubmit = (e) => {
    e.preventDefault();
    const form    = e.target;
    const btn     = document.getElementById('form-submit-btn');
    const success = document.getElementById('form-success');

    btn.disabled = true;
    btn.textContent = 'Gönderiliyor…';

    // Simulate async send
    setTimeout(() => {
      success.hidden = false;
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Mesaj Gönder ✉';

      // Scroll to success
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Auto-hide after 5s
      setTimeout(() => { success.hidden = true; }, 5000);
    }, 1200);
  };

  /* ── 6. SMOOTH HOVER PARALLAX on approach cards ── */
  document.querySelectorAll('.approach-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 7. NAVBAR active class CSS ── */
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--white); background: rgba(255,255,255,.08); }`;
  document.head.appendChild(style);

  /* ── 8. LIGHTBOX MODAL FOR GALLERY ── */
  const initLightbox = () => {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length === 0) return;
    
    // Create lightbox DOM elements dynamically
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox-modal';
      lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <button class="lightbox-prev" aria-label="Önceki Görsel">&#10094;</button>
        <div class="lightbox-content-wrap">
          <img id="lightbox-img" src="" alt="Fensefe Galeri" />
          <p id="lightbox-caption"></p>
        </div>
        <button class="lightbox-next" aria-label="Sonraki Görsel">&#10095;</button>
      `;
      
      // Lightbox styles (injected dynamically so style.css is kept clean!)
      const style = document.createElement('style');
      style.textContent = `
        #lightbox-modal {
          display: none;
          position: fixed;
          z-index: 10000;
          left: 0; top: 0;
          width: 100%; height: 100%;
          background-color: rgba(10, 14, 26, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          box-sizing: border-box;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        #lightbox-modal.show {
          display: flex;
          opacity: 1;
        }
        .lightbox-close {
          position: absolute;
          top: 25px; right: 35px;
          color: #fff;
          font-size: 44px;
          font-weight: 200;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10002;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
        }
        .lightbox-close:hover { color: var(--teal-light, #22d3ee); transform: scale(1.1) rotate(90deg); }
        .lightbox-prev, .lightbox-next {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          font-size: 24px;
          width: 60px; height: 60px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
        }
        .lightbox-prev:hover, .lightbox-next:hover {
          background: linear-gradient(135deg, #6c3de0 0%, #06b6d4 100%);
          border-color: rgba(255,255,255,0.25);
          transform: scale(1.1);
          box-shadow: 0 8px 24px rgba(108, 61, 224, 0.45);
        }
        .lightbox-content-wrap {
          max-width: 75%;
          max-height: 85%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }
        #lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 32px 80px rgba(0,0,0,0.7);
          object-fit: contain;
          animation: zoom-in-light 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        #lightbox-caption {
          color: #fff;
          font-size: 1.05rem;
          font-weight: 500;
          text-align: center;
          margin: 0;
          letter-spacing: 0.02em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
          line-height: 1.5;
        }
        #lightbox-caption strong {
          color: var(--teal-light, #22d3ee);
          font-weight: 700;
        }
        @keyframes zoom-in-light {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 768px) {
          #lightbox-modal { padding: 1rem; }
          .lightbox-prev, .lightbox-next {
            position: absolute;
            bottom: 40px;
            width: 50px; height: 50px;
            font-size: 18px;
          }
          .lightbox-prev { left: calc(50% - 65px); }
          .lightbox-next { right: calc(50% - 65px); }
          .lightbox-content-wrap { max-width: 95%; max-height: 75%; }
          #lightbox-img { max-height: 55vh; }
          .lightbox-close { top: 15px; right: 15px; }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(lightbox);
    }
    
    const imgElement = document.getElementById('lightbox-img');
    const captionElement = document.getElementById('lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map((img) => {
      const parent = img.closest('.gallery-item');
      const title = parent ? parent.querySelector('h3')?.textContent : '';
      const text = parent ? parent.querySelector('p')?.textContent : '';
      return {
        src: img.src,
        alt: img.alt,
        caption: title ? `<strong>${title}</strong> — ${text}` : img.alt
      };
    });
    
    const showImage = (index) => {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      currentIndex = index;
      
      // Add subtle transition
      imgElement.style.opacity = '0';
      imgElement.style.transform = 'scale(0.97)';
      
      setTimeout(() => {
        imgElement.src = images[currentIndex].src;
        imgElement.alt = images[currentIndex].alt;
        captionElement.innerHTML = images[currentIndex].caption;
        imgElement.style.opacity = '1';
        imgElement.style.transform = 'scale(1)';
      }, 150);
    };
    
    const openLightbox = (index) => {
      showImage(index);
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    };
    
    const closeLightbox = () => {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    };
    
    galleryItems.forEach((img, index) => {
      const parent = img.closest('.gallery-item');
      if (parent) {
        parent.style.cursor = 'pointer';
        parent.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(index);
        });
      }
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrap')) {
        closeLightbox();
      }
    });
    
    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('show')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  };
  
  initLightbox();

  /* ── 9. DYNAMIC AI TANITIM VİDEOSU VE REELS KONTROLLERİ ── */
  const initVideoHub = () => {
    const trigger = document.getElementById('ai-video-trigger');
    const player = document.getElementById('ai-video-player-el');
    const closeBtn = document.getElementById('ai-player-close-btn');
    const subtitleEl = document.getElementById('ai-player-subtitle-el');
    const captionsEl = document.getElementById('ai-video-captions-el');

    if (!trigger || !player || !closeBtn || !subtitleEl) return;

    // AI Felsefi Alt Yazılar dizisi
    const videoSubtitles = [
      "Evreni anlamak için sadece formüllere değil, sorulara da ihtiyacımız var.",
      "Fen bilimlerinin kalbinde felsefe, felsefenin kalbinde bilimsel merak yatar.",
      "Fensefe Okulu, ezbere dayalı eğitime karşı geliştirilmiş bütüncül bir sentezdir.",
      "Burada P4C (Çocuklar için Felsefe) ile zihnimizi özgür bırakmayı öğreniyoruz.",
      "Web 2.0 araçlarıyla donatılmış interaktif derslerimizde merakımız hiç sönmez.",
      "LGS ve MEB müfredatındaki en zor konuları, sorgulayan zihnimizle saniyeler içinde çözüyoruz.",
      "Çünkü sorgulayan bir öğrenci, hayatın tüm sınavlarında başarılı olur."
    ];

    // Kapak alt yazısı için mikro geçiş döngüsü
    const coverCaptions = [
      "✨ Sorgulayan zihinler için tasarlanmış yeni nesil eğitim vizyonu...",
      "🔬 Moleküllerin yapısından varlığın özüne uzanan bir merak yolculuğu...",
      "💡 P4C yaklaşımı ile sınırları aşan yaratıcı düşünme seansları...",
      "⚡ Teknolojiyi Web 2.0 ile eğlenceye dönüştüren yeni nesil felsefe..."
    ];

    let coverIndex = 0;
    const coverInterval = setInterval(() => {
      if (captionsEl) {
        captionsEl.style.opacity = '0';
        captionsEl.style.transform = 'translateY(5px)';
        setTimeout(() => {
          coverIndex = (coverIndex + 1) % coverCaptions.length;
          captionsEl.textContent = coverCaptions[coverIndex];
          captionsEl.style.opacity = '1';
          captionsEl.style.transform = 'translateY(0)';
        }, 300);
      }
    }, 4500);

    let activeSubtitleInterval = null;
    let subtitleIndex = 0;

    const startSimulatedVideo = () => {
      player.classList.add('active');
      subtitleIndex = 0;
      subtitleEl.textContent = `"${videoSubtitles[0]}"`;
      subtitleEl.style.opacity = '1';

      activeSubtitleInterval = setInterval(() => {
        subtitleEl.style.opacity = '0';
        subtitleEl.style.transform = 'translateY(10px)';

        setTimeout(() => {
          subtitleIndex = (subtitleIndex + 1) % videoSubtitles.length;
          subtitleEl.textContent = `"${videoSubtitles[subtitleIndex]}"`;
          subtitleEl.style.opacity = '1';
          subtitleEl.style.transform = 'translateY(0)';
        }, 400);
      }, 4000);
    };

    const stopSimulatedVideo = () => {
      player.classList.remove('active');
      if (activeSubtitleInterval) {
        clearInterval(activeSubtitleInterval);
        activeSubtitleInterval = null;
      }
    };

    trigger.addEventListener('click', (e) => {
      // Don't trigger if click was on the close button itself (bubble prevention)
      if (e.target.closest('#ai-player-close-btn')) return;
      startSimulatedVideo();
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent bubbling trigger click
      stopSimulatedVideo();
    });
  };

  initVideoHub();

  /* ── 10. İNTERAKTİF TİTRASYON & PH DENEY SİMÜLATÖRÜ ── */
  const initTitrationSimulator = () => {
    const slider = document.getElementById('ph-slider');
    const displayVal = document.getElementById('ph-value-display');
    const pill = document.getElementById('ph-status-pill');
    const feedbackText = document.getElementById('ph-feedback-text');
    const reflectionText = document.getElementById('ph-reflection-question');
    const reflectIcon = document.getElementById('reflect-icon-el');
    const reflectTitle = document.getElementById('reflect-title-el');
    const liquid = document.getElementById('beaker-liquid-el');
    const drop = document.getElementById('dropper-drop-el');
    const canvas = document.getElementById('beaker-canvas');

    if (!slider || !displayVal || !pill || !feedbackText || !reflectionText || !reflectIcon || !reflectTitle || !liquid || !canvas) return;

    const ctx = canvas.getContext('2d');
    let molecules = [];
    let speedMultiplier = 1.0;

    // Molecular Particle inside Beaker
    class Molecule {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = 30 + Math.random() * 130;
        this.y = 85 + Math.random() * 70;
        this.radius = 4 + Math.random() * 4;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.color = Math.random() > 0.5 ? 'rgba(255,255,255,0.7)' : 'rgba(34, 211, 238, 0.7)';
      }

      update() {
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;

        // Beaker boundary physics
        if (this.x - this.radius < 5) {
          this.x = 5 + this.radius;
          this.vx *= -1;
        }
        if (this.x + this.radius > 185) {
          this.x = 185 - this.radius;
          this.vx *= -1;
        }
        if (this.y - this.radius < 75) {
          this.y = 75 + this.radius;
          this.vy *= -1;
        }
        if (this.y + this.radius > 175) {
          this.y = 175 - this.radius;
          this.vy *= -1;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize 12 molecules
    const initMolecules = () => {
      molecules = [];
      for (let i = 0; i < 12; i++) {
        molecules.push(new Molecule());
      }
    };

    const animateMolecules = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      molecules.forEach(m => {
        m.update();
        m.draw();
      });
      // Draw bonds between close molecules
      for (let i = 0; i < molecules.length; i++) {
        for (let j = i + 1; j < molecules.length; j++) {
          let dx = molecules[i].x - molecules[j].x;
          let dy = molecules[i].y - molecules[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 45) {
            ctx.strokeStyle = `rgba(255,255,255,${(45 - dist) / 45 * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(molecules[i].x, molecules[i].y);
            ctx.lineTo(molecules[j].x, molecules[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateMolecules);
    };

    // States and responses
    const updateSimulator = (val) => {
      displayVal.textContent = parseFloat(val).toFixed(1);
      
      let liquidBg = 'rgba(6, 182, 212, 0.45)'; // Default neutral teal
      let pillText = 'Nötr';
      let pillClass = 'neutral-status';
      let icon = '⚖️';
      let title = 'Denge ve Uyum';
      let desc = '"Bilim ile felsefenin kusursuz dengesi. Nötr bir çözeltide moleküller kararlı ve dengelidir. Zihniniz de yeni bilgilere açık, dengeli bir sorgulama modundadır."';
      let quest = '"Her şeyin dengede olduğu nötr bir dünyada, merakı ve gelişimi başlatan şey dengesizlik (asitlik veya bazlık) olabilir mi?"';
      
      if (val >= 0 && val <= 3) {
        // Strong Acid
        speedMultiplier = 3.2;
        liquidBg = 'rgba(244, 63, 94, 0.75)';
        pillText = 'Güçlü Asit';
        pillClass = 'acid-status';
        icon = '🔥';
        title = 'Yakıcı Sorgulama';
        desc = '"Son derece aktif ve yakıcı! Tıpkı zihninizin en derin, en radikal sorgulama anları gibi. Yüksek asitlik, çözünmeyi ve yeniden doğuşu simgeler. Kendi önyargılarınızı eritip yeni bir bakış açısı aramaya hazır mısınız?"';
        quest = '"Eğer her şeyi eritebilen güçlü bir asidimiz olsaydı, onu içinde tutabileceğimiz bir kap tasarlamak mümkün olur mu? Bu kabın felsefi karşılığı nedir?"';
      } else if (val > 3 && val < 7) {
        // Weak Acid
        speedMultiplier = 1.8;
        liquidBg = 'rgba(251, 113, 133, 0.6)';
        pillText = 'Zayıf Asit';
        pillClass = 'acid-status';
        icon = '⚡';
        title = 'Merakın Uyanışı';
        desc = '"Hafif asidik ve canlı! Zihninizde soru işaretlerinin yeni yeni filizlendiği, merakın uyanmaya başladığı an. Küçük şüpheler, büyük bilimsel teorilerin habercisidir."';
        quest = '"Merak etmek, mevcut zihinsel dengemizi bozmak anlamına mı gelir? Zihnin hafifçe \'asidik\' olması öğrenmeyi nasıl kolaylaştırır?"';
      } else if (val == 7) {
        // Neutral
        speedMultiplier = 1.0;
        // defaults already set
      } else if (val > 7 && val <= 10.9) {
        // Weak Base
        speedMultiplier = 0.6;
        liquidBg = 'rgba(167, 139, 250, 0.6)';
        pillText = 'Zayıf Baz';
        pillClass = 'base-status';
        icon = '🦉';
        title = 'Kavramsal İnşa';
        desc = '"Bazik ve kapsayıcı! Sorular yavaş yavaş cevaplara kavuşuyor, moleküller sakinleşiyor. Bilgiyi yapılandırdığımız ve kavramları temellendirdiğimiz dingin bir öğrenme aşaması."';
        quest = '"Cevaplar zihni sakinleştirip durağanlaştırır mı? Bir soruyu tamamen cevaplamak, o konudaki felsefi yolculuğumuzu bitirir mi?"';
      } else if (val > 10.9 && val <= 14) {
        // Strong Base
        speedMultiplier = 0.2;
        liquidBg = 'rgba(108, 61, 224, 0.75)';
        pillText = 'Güçlü Baz';
        pillClass = 'base-status';
        icon = '💎';
        title = 'Dingin Bilgelik';
        desc = '"Kaygan, arındırıcı ve dingin! Güçlü bazik ortam, moleküllerin sakin ve ağır hareketlerini beraberinde getirir. Tıpkı derin bir felsefi olgunluk ve bilgeliğe ulaşmış zihin gibi."';
        quest = '"Mutlak bilgelik ve dinginlik, sorgulamanın tamamen durduğu bir son nokta mıdır, yoksa yeni bir döngünün başlangıcı mı?"';
      }

      // Apply changes smoothly
      liquid.style.backgroundColor = liquidBg;
      
      // Update text with quick transitions
      feedbackText.style.opacity = '0';
      reflectionText.style.opacity = '0';
      reflectIcon.style.transform = 'rotate(-15deg) scale(0.8)';
      
      setTimeout(() => {
        pill.textContent = pillText;
        pill.className = `ph-status-pill ${pillClass}`;
        reflectIcon.textContent = icon;
        reflectTitle.textContent = title;
        feedbackText.textContent = desc;
        reflectionText.textContent = quest;
        
        feedbackText.style.opacity = '1';
        reflectionText.style.opacity = '1';
        reflectIcon.style.transform = 'rotate(0deg) scale(1)';
      }, 250);

      // Molecule color dynamics based on pH
      molecules.forEach(m => {
        if (val < 5) {
          m.color = Math.random() > 0.5 ? 'rgba(244, 63, 94, 0.8)' : 'rgba(255, 255, 255, 0.7)';
        } else if (val > 9) {
          m.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.7)';
        } else {
          m.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.8)' : 'rgba(255, 255, 255, 0.7)';
        }
      });
    };

    // Drip droplet anim on slider change
    slider.addEventListener('input', (e) => {
      const val = e.target.value;
      updateSimulator(val);

      // Dropper Drip Animation
      drop.classList.remove('drip');
      void drop.offsetWidth; // Trigger reflow
      
      if (val < 7) {
        drop.style.backgroundColor = 'rgba(244, 63, 94, 0.8)';
      } else if (val > 7) {
        drop.style.backgroundColor = 'rgba(108, 61, 224, 0.8)';
      } else {
        drop.style.backgroundColor = 'rgba(6, 182, 212, 0.8)';
      }

      drop.classList.add('drip');
    });

    initMolecules();
    animateMolecules();
  };

  initTitrationSimulator();

});
