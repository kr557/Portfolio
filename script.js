document.addEventListener('DOMContentLoaded', () => {

  // ===== PAGE LOADER =====
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = `<div class="loader-logo">KJ</div>`;
  document.body.appendChild(loader);
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(() => loader.remove(), 600);
  }, 1200);

  // ===== CURSOR GLOW =====
  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  document.body.appendChild(cursor);
  const cursorDot = document.createElement('div');
  cursorDot.id = 'cursor-dot';
  document.body.appendChild(cursorDot);
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
  });
  (function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });

  // ===== MOBILE MENU =====
  const menuBtn = document.querySelector('[aria-label="Toggle menu"]');
  const mobileMenu = document.querySelector('.md\\:hidden.absolute');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px';
      mobileMenu.style.maxHeight = isOpen ? '0' : '400px';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => { mobileMenu.style.maxHeight = '0'; });
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ===== NAVBAR SCROLL =====
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (header) header.style.boxShadow = window.scrollY > 10 ? '0 4px 30px rgba(0,0,0,0.6)' : 'none';
    updateActiveNav();
  });

  // ===== ACTIVE NAV HIGHLIGHT =====
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('text-white');
      link.classList.add('text-[#B0B0B0]');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('text-white');
        link.classList.remove('text-[#B0B0B0]');
      }
    });
  }

  // ===== SCROLL REVEAL =====
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.from-left { transform: translateX(-40px); }
    .reveal.from-right { transform: translateX(40px); }
    .reveal.visible { opacity: 1 !important; transform: none !important; }
    .stagger-child { opacity: 0; transform: translateY(30px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .stagger-child.visible { opacity: 1 !important; transform: none !important; }
    @media (max-width: 767px) {
      .reveal, .stagger-child { opacity: 1 !important; transform: none !important; }
    }
  `;
  document.head.appendChild(revealStyle);

  // Add reveal classes
  document.querySelectorAll('#about .bg-\\[\\#1A1A1A\\]').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('#skills .mb-16').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('#skills .group').forEach((el, i) => {
    el.classList.add('stagger-child');
    el.style.transitionDelay = (i % 3) * 0.1 + 's';
  });
  document.querySelectorAll('#projects .group').forEach((el, i) => {
    el.classList.add('stagger-child');
    el.style.transitionDelay = (i % 3) * 0.1 + 's';
  });
  // Experience card — use direct child selector instead of class
  const expCard = document.querySelector('#experience .rounded-3xl');
  if (expCard) expCard.classList.add('reveal');
  document.querySelectorAll('#testimonials .min-w-\\[300px\\]').forEach((el, i) => {
    el.classList.add('stagger-child');
    el.style.transitionDelay = i * 0.15 + 's';
  });
  document.querySelectorAll('#contact .flex.flex-col, #contact .rounded-2xl').forEach((el, i) => {
    el.classList.add('reveal');
    el.classList.add(i === 0 ? 'from-left' : 'from-right');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .stagger-child').forEach(el => observer.observe(el));

  // Safety fallback — agar observer kisi element ko miss kare toh 3s baad sab visible kar do
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible), .stagger-child:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 3000);

  // ===== PARTICLE STARS =====
  const heroSection = document.querySelector('#home');
  if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.id = 'hero-stars';
    heroSection.style.position = 'relative';
    heroSection.insertBefore(canvas, heroSection.firstChild);
    const ctx = canvas.getContext('2d');
    const stars = [];
    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random() * 0.6 + 0.2,
        s: Math.random() * 0.3 + 0.1,
        d: Math.random() > 0.5 ? 1 : -1
      });
    }
    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.o += s.s * 0.01 * s.d;
        if (s.o > 0.8 || s.o < 0.1) s.d *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }
    drawStars();
  }

  // ===== PAGE PROGRESS BAR =====
  const progressBar = document.createElement('div');
  progressBar.id = 'page-progress';
  document.body.appendChild(progressBar);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
  });

  // ===== HERO ANIMATIONS =====
  const heroText = document.querySelector('#home h1');
  if (heroText) {
    heroText.style.opacity = '0';
    heroText.style.transform = 'translateY(30px)';
    heroText.style.transition = 'opacity 0.8s ease 1.4s, transform 0.8s ease 1.4s';
    setTimeout(() => {
      heroText.style.opacity = '1';
      heroText.style.transform = 'none';
    }, 100);

    // ===== TYPEWRITER EFFECT =====
    setTimeout(() => {
      const spans = heroText.querySelectorAll('span');
      const targetSpan = spans[spans.length - 1] || heroText;
      const words = ['UI/UX Designer', 'Frontend Developer', 'HTML/css', 'Figma'];
      let wi = 0, ci = 0, deleting = false;
      const typeEl = document.createElement('span');
      typeEl.id = 'typewriter';
      if (targetSpan !== heroText) {
        targetSpan.parentNode.insertBefore(typeEl, targetSpan.nextSibling);
        targetSpan.style.display = 'block';
      } else {
        heroText.appendChild(typeEl);
      }
      function type() {
        const word = words[wi];
        typeEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
        if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1200); return; }
        if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; setTimeout(type, 400); return; }
        setTimeout(type, deleting ? 50 : 90);
      }
      type();
    }, 2400);
  }
  const heroBadge = document.querySelector('#home .glass-card');
  if (heroBadge) {
    heroBadge.style.opacity = '0';
    heroBadge.style.transform = 'translateY(-20px)';
    heroBadge.style.transition = 'opacity 0.6s ease 1.2s, transform 0.6s ease 1.2s';
    setTimeout(() => { heroBadge.style.opacity = '1'; heroBadge.style.transform = 'none'; }, 100);
  }
  const heroP = document.querySelector('#home p.text-lg');
  if (heroP) {
    heroP.style.opacity = '0';
    heroP.style.transition = 'opacity 0.8s ease 1.7s';
    setTimeout(() => { heroP.style.opacity = '1'; }, 100);
  }
  const heroButtons = document.querySelector('#home .flex.flex-wrap.items-center');
  if (heroButtons) {
    heroButtons.style.opacity = '0';
    heroButtons.style.transform = 'translateY(20px)';
    heroButtons.style.transition = 'opacity 0.7s ease 2s, transform 0.7s ease 2s';
    setTimeout(() => { heroButtons.style.opacity = '1'; heroButtons.style.transform = 'none'; }, 100);
  }
  const heroImg = document.querySelector('#home .relative.lg\\:h-\\[600px\\]');
  if (heroImg) {
    heroImg.style.opacity = '0';
    heroImg.style.transform = 'scale(0.9)';
    heroImg.style.transition = 'opacity 1s ease 1.5s, transform 1s ease 1.5s';
    setTimeout(() => { heroImg.style.opacity = '1'; heroImg.style.transform = 'none'; }, 100);
  }

  // ===== FLOATING RINGS =====
  const ring1 = document.querySelector('#home .absolute.w-\\[520px\\]');
  const ring2 = document.querySelector('#home .absolute.w-\\[460px\\]');
  if (ring1 && ring2) {
    let angle1 = -184, angle2 = 67;
    setInterval(() => {
      angle1 -= 0.15;
      angle2 += 0.2;
      ring1.style.transform = `rotate(${angle1}deg)`;
      ring2.style.transform = `rotate(${angle2}deg)`;
    }, 16);
  }

  // ===== FLOATING BADGES =====
  const badge1 = document.querySelector('#home .absolute.-top-2');
  const badge2 = document.querySelector('#home .absolute.-bottom-6');
  if (badge1 && badge2) {
    let t = 0;
    setInterval(() => {
      t += 0.02;
      badge1.style.transform = `translateY(${Math.sin(t) * 8}px)`;
      badge2.style.transform = `translateY(${Math.sin(t + 1.5) * 8}px)`;
    }, 16);
  }

  // ===== COUNTER ANIMATION =====
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        el.textContent = '0';
        if (text === '4+') animateCounter(el, 4, '+');
        else if (text === '20+') animateCounter(el, 20, '+');
        else if (text === '13+') animateCounter(el, 13, '+');
        else if (text === '100%') animateCounter(el, 100, '%');
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('#experience .grid .text-3xl.font-display').forEach(el => counterObserver.observe(el));

  // ===== RESUME DOWNLOAD BUTTON =====
  const heroButtons2 = document.querySelector('#home .flex.flex-wrap.items-center');
  if (heroButtons2) {
    const resumeBtn = document.createElement('a');
    resumeBtn.href = './Krishan_joshi_Ui and Ux Designer.pdf';
    resumeBtn.download = 'Krishan_Joshi_Resume.pdf';
    resumeBtn.id = 'resume-btn';
    resumeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Resume`;
    heroButtons2.appendChild(resumeBtn);
  }

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.title = 'Back to top';
  backToTop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>`;
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  // ===== HTML PROJECTS DYNAMIC RENDER =====
  const htmlProjects = [
    { img: 'img/Project/html/Appoosto.png', title: 'Appoosto', desc: 'Clean and modern web UI for the Appoosto platform.' },
    { img: 'img/Project/html/fledger.png', title: 'Fledger', desc: 'Expense management web app with intuitive UI.' },
    { img: 'img/Project/html/glukk.png', title: 'Glukk', desc: 'Engaging web interface with smooth user experience.' },
    { img: 'img/Project/html/Pmaps.png', title: 'Pmaps', desc: 'Interactive mapping platform with clean layout.' },
    { img: 'img/Project/html/prestige.png', title: 'Prestige', desc: 'Luxury brand website with premium design.' },
    { img: 'img/Project/html/Restaurant.png', title: 'Restaurant', desc: 'Food ordering website with appetizing UI.' },
    { img: 'img/Project/html/topvabor.png', title: 'TopVabor', desc: 'SaaS web platform with modern responsive design.' },
    { img: 'img/Project/html/traderhub.png', title: 'TraderHub', desc: 'Trading platform website with data-rich UI.' }
  ];

  // ===== FIGMA PROJECTS DYNAMIC RENDER =====
  const figmaProjects = [
    { img: 'img/Project/figma/Appoosto.png', title: 'Appoosto App', desc: 'Modern mobile app UI with clean UX and smooth navigation.' },
    { img: 'img/Project/figma/Finance and Budget.png', title: 'Finance & Budget', desc: 'Personal finance dashboard with analytics and insights.' },
    { img: 'img/Project/figma/Finance and Budget-1.png', title: 'Finance & Budget Pro', desc: 'Advanced budget planner with detailed expense tracking.' },
    { img: 'img/Project/figma/fledger.png', title: 'Fledger App', desc: 'Expense management app with smart tracking features.' },
    { img: 'img/Project/figma/my magice moments.png', title: 'My Magic Moments', desc: 'Memory and moments app with beautiful visual design.' },
    { img: 'img/Project/figma/prestige.png', title: 'Prestige UI', desc: 'Luxury brand UI design with premium user experience.' },
    { img: 'img/Project/figma/Restaurant.png', title: 'Restaurant App', desc: 'Food ordering app with clean UI and fast user flow.' },
    { img: 'img/Project/figma/Solar App.png', title: 'Solar App', desc: 'Energy monitoring dashboard with usage insights.' },
    { img: 'img/Project/figma/topvabor.png', title: 'TopVabor', desc: 'Modern SaaS dashboard UI with intuitive navigation.' },
    { img: 'img/Project/figma/traderhub.png', title: 'TraderHub', desc: 'Trading platform UI with real-time data visualization.' }
  ];

  const projectsGrid = document.querySelector('#projects .grid');
  if (projectsGrid) {
    // Remove existing uiux cards
    projectsGrid.querySelectorAll('[data-cat="uiux"]').forEach(el => el.remove());

    // Prepend figma cards
    const fragment = document.createDocumentFragment();
    figmaProjects.forEach(p => {
      const card = document.createElement('div');
      card.dataset.cat = 'uiux';
      card.className = 'group relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1.5 hover:border-[#FE8551]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300';
      card.innerHTML = `
        <div class="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
          <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <a href="#" class="px-5 py-2.5 bg-[#FE8551] text-black text-sm font-semibold rounded-xl translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#FF9A6A]">View Case Study</a>
          </div>
        </div>
        <div class="p-6 flex-grow flex flex-col">
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span class="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#0F0F0F] text-[#B0B0B0] border border-[#2A2A2A]">UI/UX</span>
            <span class="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#0F0F0F] text-[#B0B0B0] border border-[#2A2A2A]">Figma</span>
          </div>
          <h3 class="text-base font-display font-semibold text-white mb-2 group-hover:text-[#FE8551] transition-colors duration-300">${p.title}</h3>
          <p class="text-[#B0B0B0] text-sm leading-relaxed flex-grow">${p.desc}</p>
        </div>`;
      fragment.appendChild(card);
    });
    projectsGrid.insertBefore(fragment, projectsGrid.firstChild);

    // Remove existing html cards and render from array
    projectsGrid.querySelectorAll('[data-cat="html"]').forEach(el => el.remove());
    const htmlFragment = document.createDocumentFragment();
    htmlProjects.forEach(p => {
      const card = document.createElement('div');
      card.dataset.cat = 'html';
      card.className = 'group relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1.5 hover:border-[#FE8551]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300';
      card.innerHTML = `
        <div class="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
          <img src="${p.img}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <a href="#" class="px-5 py-2.5 bg-[#FE8551] text-black text-sm font-semibold rounded-xl translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#FF9A6A]">View Project</a>
          </div>
        </div>
        <div class="p-6 flex-grow flex flex-col">
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span class="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#0F0F0F] text-[#B0B0B0] border border-[#2A2A2A]">HTML</span>
            <span class="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#0F0F0F] text-[#B0B0B0] border border-[#2A2A2A]">CSS</span>
          </div>
          <h3 class="text-base font-display font-semibold text-white mb-2 group-hover:text-[#FE8551] transition-colors duration-300">${p.title}</h3>
          <p class="text-[#B0B0B0] text-sm leading-relaxed flex-grow">${p.desc}</p>
        </div>`;
      htmlFragment.appendChild(card);
    });
    projectsGrid.appendChild(htmlFragment);
  }
  const filterBtns = document.querySelectorAll('#projects .flex.flex-wrap.gap-2 button');
  const projectCards = document.querySelectorAll('#projects .grid [data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.style.background = 'transparent';
        b.style.color = '#B0B0B0';
        b.style.borderColor = '#2A2A2A';
      });
      btn.style.background = '#FE8551';
      btn.style.color = '#000';
      btn.style.borderColor = '#FE8551';

      const label = btn.textContent.trim();

      projectCards.forEach(card => {
        const cat = card.dataset.cat;
        let show = true;
        if (label.includes('HTML') || label.includes('Development')) show = cat === 'html';
        else if (label.includes('UI/UX')) show = cat === 'uiux';
        else if (label.includes('Graphic') || label.includes('Poster')) show = cat === 'graphic';

        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.display = '';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.style.pointerEvents = 'none';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // ===== TESTIMONIALS AUTO-SCROLL =====
  const testimonialsTrack = document.querySelector('#testimonials .flex.overflow-x-auto');
  if (testimonialsTrack) {
    let autoScroll = setInterval(scroll, 3500);
    function scroll() {
      const max = testimonialsTrack.scrollWidth - testimonialsTrack.clientWidth;
      testimonialsTrack.scrollLeft >= max - 10
        ? testimonialsTrack.scrollTo({ left: 0, behavior: 'smooth' })
        : testimonialsTrack.scrollBy({ left: 320, behavior: 'smooth' });
    }
    testimonialsTrack.addEventListener('mouseenter', () => clearInterval(autoScroll));
    testimonialsTrack.addEventListener('mouseleave', () => { autoScroll = setInterval(scroll, 3500); });
  }

  // ===== WHATSAPP FLOATING BUTTON =====
  const waBtn = document.createElement('a');
  waBtn.id = 'wa-btn';
  waBtn.href = 'https://wa.me/919950332503';
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.title = 'Chat on WhatsApp';
  waBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  document.body.appendChild(waBtn);

  // ===== CONTACT FORM =====
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = '#22c55e';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  // ===== TILT EFFECT ON PROJECT CARDS =====
  document.querySelectorAll('#projects .group').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== SKILL CARD RIPPLE =====
  document.querySelectorAll('#skills .group').forEach(card => {
    card.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute; border-radius:50%; background:rgba(254,133,81,0.25);
        width:10px; height:10px; pointer-events:none;
        left:${e.clientX - rect.left - 5}px; top:${e.clientY - rect.top - 5}px;
        animation: ripple 0.6s ease-out forwards;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

});

// ===== GLOBAL STYLES =====
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  #page-loader {
    position: fixed; inset: 0; background: #0f0f0f; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.6s ease;
  }
  .loader-logo {
    width: 60px; height: 60px; background: #FE8551; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 20px; color: #000;
    animation: loaderPulse 0.8s ease-in-out infinite alternate;
  }
  @keyframes loaderPulse {
    from { transform: scale(0.9); box-shadow: 0 0 0 rgba(254,133,81,0.4); }
    to   { transform: scale(1.1); box-shadow: 0 0 30px rgba(254,133,81,0.5); }
  }
  #cursor-glow {
    position: fixed; width: 36px; height: 36px; border-radius: 50%;
    background: rgba(254,133,81,0.08);
    backdrop-filter: blur(4px);
    border: 1.5px solid rgba(254,133,81,0.45);
    pointer-events: none; z-index: 9998; transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease, background 0.3s ease, border-color 0.3s ease;
  }
  #cursor-glow.cursor-hover {
    width: 56px; height: 56px;
    background: rgba(254,133,81,0.15);
    border-color: rgba(254,133,81,0.8);
  }
  #cursor-dot {
    position: fixed; width: 6px; height: 6px; border-radius: 50%;
    background: #FE8551;
    pointer-events: none; z-index: 9999; transform: translate(-50%, -50%);
  }
  #page-progress {
    position: fixed; top: 0; left: 0; height: 3px; width: 0%;
    background: linear-gradient(90deg, #FE8551, #FF9A6A, #FE8551);
    background-size: 200% 100%;
    z-index: 9999;
    box-shadow: 0 0 8px rgba(254,133,81,0.6);
    transition: width 0.1s linear;
    animation: progressShimmer 2s linear infinite;
  }
  @keyframes progressShimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  #hero-stars {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
  }
  #typewriter::after {
    content: '|';
    color: #FE8551;
    animation: blink 0.7s step-end infinite;
    margin-left: 2px;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  @keyframes ripple {
    to { transform: scale(30); opacity: 0; }
  }
  #resume-btn {
    display: inline-flex; align-items: center; gap: 7px;
    height: 48px; padding: 0 24px; border-radius: 12px;
    border: 1px solid #2A2A2A; color: #B0B0B0;
    font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
    text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  #resume-btn:hover {
    border-color: rgba(254,133,81,0.5);
    color: #FE8551;
    background: rgba(254,133,81,0.06);
  }
  #back-to-top {
    position: fixed; bottom: 28px; right: 28px;
    width: 44px; height: 44px; border-radius: 50%;
    background: #FE8551; color: #000; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 9990;
    opacity: 0; transform: translateY(12px);
    transition: opacity 0.3s, transform 0.3s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(254,133,81,0.35);
  }
  #back-to-top.visible { opacity: 1; transform: translateY(0); }
  #back-to-top:hover { box-shadow: 0 6px 24px rgba(254,133,81,0.55); transform: translateY(-2px); }
  #wa-btn {
    position: fixed; bottom: 84px; right: 28px;
    width: 48px; height: 48px; border-radius: 50%;
    background: #25D366; color: #fff;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; z-index: 9990;
    box-shadow: 0 4px 16px rgba(37,211,102,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  #wa-btn:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(37,211,102,0.6); }
`;
document.head.appendChild(globalStyle);
