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

    const portfolioBtn = document.createElement('a');
    portfolioBtn.href = './Krishan_Joshi_Portfolio.pdf';
    portfolioBtn.download = 'Krishan_Joshi_Portfolio.pdf';
    portfolioBtn.id = 'portfolio-btn';
    portfolioBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> Portfolio`;

    const btnWrapper = document.createElement('div');
    btnWrapper.style.cssText = 'display:flex; gap:12px; flex-wrap:wrap;';
    btnWrapper.appendChild(resumeBtn);
    btnWrapper.appendChild(portfolioBtn);
    heroButtons2.appendChild(btnWrapper);
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
    { img: 'img/Project/html/Appoosto.webp', title: 'Appoosto', desc: 'Clean and modern web UI for the Appoosto platform.' },
    { img: 'img/Project/html/fledger.webp', title: 'Fledger', desc: 'Expense management web app with intuitive UI.' },
    { img: 'img/Project/html/gahari.webp', title: 'Gahari', desc: 'Elegant web design with rich visual storytelling.' },
    { img: 'img/Project/html/geomedium.webp', title: 'Geomedium', desc: 'Geo-based platform with clean and functional UI.' },
    { img: 'img/Project/html/glukk.webp', title: 'Glukk', desc: 'Engaging web interface with smooth user experience.' },
    { img: 'img/Project/html/Hotel jobs.webp', title: 'Hotel Jobs', desc: 'Job portal for hospitality industry with easy navigation.' },
    { img: 'img/Project/html/jobportal.webp', title: 'Job Portal', desc: 'Feature-rich job listing platform with advanced filters.' },
    { img: 'img/Project/html/lalit khatri photography.webp', title: 'Lalit Khatri Photography', desc: 'Portfolio website for a professional photographer.' },
    { img: 'img/Project/html/lemur technologies.webp', title: 'Lemur Technologies', desc: 'Tech company website with modern branding.' },
    { img: 'img/Project/html/luneta.webp', title: 'Luneta', desc: 'Stylish web presence with clean layout and typography.' },
    { img: 'img/Project/html/Pmaps.webp', title: 'Pmaps', desc: 'Interactive mapping platform with clean layout.' },
    { img: 'img/Project/html/prestige.webp', title: 'Prestige', desc: 'Luxury brand website with premium design.' },
    { img: 'img/Project/html/prestige 2.webp', title: 'Prestige 2', desc: 'Updated luxury brand UI with refined visual style.' },
    { img: 'img/Project/html/Restaurant.webp', title: 'Restaurant', desc: 'Food ordering website with appetizing UI.' },
    { img: 'img/Project/html/themegasolutions.webp', title: 'The Mega Solutions', desc: 'Corporate solutions website with professional layout.' },
    { img: 'img/Project/html/topvabor.webp', title: 'TopVabor', desc: 'SaaS web platform with modern responsive design.' },
    { img: 'img/Project/html/traderhub.webp', title: 'TraderHub', desc: 'Trading platform website with data-rich UI.' }
  ];

  // ===== FIGMA PROJECTS DYNAMIC RENDER =====
  const figmaProjects = [
    { img: 'img/Project/mobile/Finance and Budget.webp', title: 'Finance & Budget Mobile', desc: 'Mobile finance app with clean budgeting interface.' },
    { img: 'img/Project/mobile/ForexBull.webp', title: 'ForexBull', desc: 'Forex trading mobile app with live market data UI.' },
    { img: 'img/Project/mobile/founders hub.webp', title: 'Founders Hub', desc: 'Startup community app for founders and entrepreneurs.' },
    { img: 'img/Project/mobile/Gr8niteout.webp', title: 'Gr8niteout', desc: 'Nightlife discovery app with vibrant visual design.' },
    { img: 'img/Project/mobile/Loan Approval.webp', title: 'Loan Approval', desc: 'Fintech app for quick loan applications and approvals.' },
    { img: 'img/Project/mobile/Shopislive.webp', title: 'Shopislive', desc: 'Live shopping app with engaging product discovery UI.' },
    { img: 'img/Project/mobile/Smilestone.webp', title: 'Smilestone', desc: 'Dental care app with appointment and wellness tracking.' },
    { img: 'img/Project/mobile/Solar App.webp', title: 'Solar App Mobile', desc: 'Solar energy monitoring app with usage analytics.' },
    { img: 'img/Project/mobile/SpeakCue.webp', title: 'SpeakCue', desc: 'Public speaking coach app with real-time feedback UI.' },
    { img: 'img/Project/mobile/TreaderHub.webp', title: 'TreaderHub Mobile', desc: 'Mobile trading platform with intuitive data visualization.' },
    { img: 'img/Project/mobile/Vivahab.webp', title: 'Vivahab', desc: 'Wedding planning app with elegant and warm UI design.' }
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

    // Remove existing graphic cards and render from post images
    projectsGrid.querySelectorAll('[data-cat="graphic"]').forEach(el => el.remove());
    const postImages = [
      'img/Project/post/Desktop - 1 1.png',
      'img/Project/post/Desktop - 1 2.png',
      'img/Project/post/Desktop - 1 3.png',
      'img/Project/post/Desktop - 1 4.png',
      'img/Project/post/Desktop - 1 5.png',
      'img/Project/post/Desktop - 1 6.png',
      'img/Project/post/Desktop - 1 7.png',
      'img/Project/post/Desktop - 1 8.png',
      'img/Project/post/Frame 1 8.png',
      'img/Project/post/Frame 1 9.png',
      'img/Project/post/Frame 1 10.png',
      'img/Project/post/Frame 1 11.png',
      'img/Project/post/Frame 6848 1.png',
      'img/Project/post/Frame 6848 2.png',
      'img/Project/post/Frame 6848 3.png',
      'img/Project/post/Frame 6848 4.png'
    ];
    const graphicFragment = document.createDocumentFragment();
    postImages.forEach((imgPath, i) => {
      const card = document.createElement('div');
      card.dataset.cat = 'graphic';
      card.className = 'group relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1.5 hover:border-[#FE8551]/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300';
      card.innerHTML = `
        <div class="relative w-full aspect-[4/3] overflow-hidden">
          <img data-src="${imgPath}" alt="Graphic Design ${i + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" decoding="async">
          <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
            <a href="${imgPath}" target="_blank" class="px-5 py-2.5 bg-[#FE8551] text-black text-sm font-semibold rounded-xl translate-y-3 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#FF9A6A]">View Design</a>
          </div>
        </div>`;
      graphicFragment.appendChild(card);
    });
    projectsGrid.appendChild(graphicFragment);

    const lazyImgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          lazyImgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    projectsGrid.querySelectorAll('[data-cat="graphic"] img[data-src]').forEach(img => lazyImgObserver.observe(img));
  }
  const filterBtns = document.querySelectorAll('#projects .flex.flex-wrap.gap-2 button');

  function showCard(card) {
    card.style.display = 'flex';
    card.style.opacity = '1';
    card.style.transform = '';
    card.style.pointerEvents = '';
  }
  function hideCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    card.style.pointerEvents = 'none';
    setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 300);
  }

  function applyFilter(label) {
    const allCards = Array.from(projectsGrid.querySelectorAll('[data-cat]'));
    const isMobile = window.innerWidth < 1024;
    let viewAllBtn = document.getElementById('view-all-btn');

    allCards.forEach(card => { card.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; });

    if (label === 'All') {
      const counts = { html: 0, uiux: 0, graphic: 0 };
      const limit = isMobile ? 1 : 3;
      allCards.forEach(card => {
        const cat = card.dataset.cat;
        if (counts[cat] < limit) { counts[cat]++; showCard(card); }
        else hideCard(card);
      });

      if (isMobile) {
        if (!viewAllBtn) {
          viewAllBtn = document.createElement('button');
          viewAllBtn.id = 'view-all-btn';
          viewAllBtn.textContent = 'View All Projects';
          viewAllBtn.className = 'mt-8 px-8 py-3 rounded-xl bg-[#FE8551] text-black font-semibold text-sm hover:bg-[#FF9A6A] transition-all duration-200 mx-auto block';
          projectsGrid.after(viewAllBtn);
          viewAllBtn.addEventListener('click', () => {
            allCards.forEach(card => showCard(card));
            viewAllBtn.remove();
            setTimeout(attachLightbox, 50);
          });
        }
        viewAllBtn.style.display = 'block';
      } else {
        if (viewAllBtn) viewAllBtn.remove();
      }
    } else {
      if (viewAllBtn) viewAllBtn.remove();
      allCards.forEach(card => {
        const cat = card.dataset.cat;
        let show = false;
        if (label.includes('HTML') || label.includes('Development')) show = cat === 'html';
        else if (label.includes('Mobile')) show = cat === 'uiux';
        else if (label.includes('Graphic') || label.includes('Poster')) show = cat === 'graphic';
        show ? showCard(card) : hideCard(card);
      });
    }
  }

  applyFilter('All');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.style.background = 'transparent'; b.style.color = '#B0B0B0'; b.style.borderColor = '#2A2A2A'; });
      btn.style.background = '#FE8551';
      btn.style.color = '#000';
      btn.style.borderColor = '#FE8551';
      applyFilter(btn.textContent.trim());
      setTimeout(attachLightbox, 50);
    });
  });

  // ===== LIGHTBOX POPUP =====
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <div id="lightbox-overlay"></div>
    <div id="lightbox-content">
      <button id="lightbox-close">&times;</button>
      <button id="lightbox-prev">&#8249;</button>
      <img id="lightbox-img" src="" alt="">
      <button id="lightbox-next">&#8250;</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  let lightboxImages = [];
  let lightboxIndex = 0;

  function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex = index;
    document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-overlay').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
  });
  document.getElementById('lightbox-next').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
  });

  // Attach lightbox to project cards
  function attachLightbox() {
    projectsGrid.querySelectorAll('[data-cat]').forEach(card => {
      const img = card.querySelector('img');
      const btn = card.querySelector('a');
      if (!img || !btn || btn.dataset.lightbox) return;
      btn.dataset.lightbox = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = card.dataset.cat;
        const allImgs = Array.from(projectsGrid.querySelectorAll(`[data-cat="${cat}"] img`)).map(i => i.src).filter(Boolean);
        const idx = allImgs.indexOf(img.src);
        openLightbox(allImgs, idx >= 0 ? idx : 0);
      });
    });
  }

  // Call after cards are rendered
  setTimeout(attachLightbox, 100);

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
  #resume-btn, #portfolio-btn {
    display: inline-flex; align-items: center; gap: 7px;
    height: 48px; padding: 0 24px; border-radius: 12px;
    border: 1px solid #2A2A2A; color: #B0B0B0;
    font-size: 15px; font-weight: 600; font-family: 'Inter', sans-serif;
    text-decoration: none; transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  #resume-btn:hover, #portfolio-btn:hover {
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
  #lightbox {
    display: none; position: fixed; inset: 0; z-index: 99999;
    align-items: center; justify-content: center;
  }
  #lightbox.active { display: flex; }
  #lightbox-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.92);
    backdrop-filter: blur(8px);
  }
  #lightbox-content {
    position: relative; z-index: 1; display: flex; align-items: center;
    gap: 16px; max-width: 90vw; max-height: 90vh;
  }
  #lightbox-img {
    max-width: 80vw; max-height: 85vh;
    border-radius: 16px; object-fit: contain;
    box-shadow: 0 24px 80px rgba(0,0,0,0.8);
    border: 1px solid rgba(254,133,81,0.2);
  }
  #lightbox-close {
    position: fixed; top: 20px; right: 24px;
    background: rgba(254,133,81,0.15); border: 1px solid rgba(254,133,81,0.3);
    color: #fff; font-size: 28px; width: 44px; height: 44px;
    border-radius: 50%; cursor: pointer; display: flex;
    align-items: center; justify-content: center; line-height: 1;
    transition: background 0.2s;
  }
  #lightbox-close:hover { background: rgba(254,133,81,0.35); }
  #lightbox-prev, #lightbox-next {
    background: rgba(254,133,81,0.15); border: 1px solid rgba(254,133,81,0.3);
    color: #fff; font-size: 32px; width: 48px; height: 48px;
    border-radius: 50%; cursor: pointer; display: flex;
    align-items: center; justify-content: center; flex-shrink: 0;
    transition: background 0.2s;
  }
  #lightbox-prev:hover, #lightbox-next:hover { background: rgba(254,133,81,0.35); }
`;
document.head.appendChild(globalStyle);
