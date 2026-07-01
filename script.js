document.addEventListener('DOMContentLoaded', () => {
  // --- Database Istilah Teknis (Glossary Data) ---
  const glossaryDb = {
    'POY': {
      title: 'POY (Partially Oriented Yarn)',
      category: 'Bahan',
      simpleDef: 'Benang hasil proses pemintalan (spinning) yang baru terorientasi sebagian, digunakan sebagai bahan baku untuk proses DTY.'
    },
    'DTY': {
      title: 'DTY (Draw Textured Yarn)',
      category: 'Produk',
      simpleDef: 'Benang hasil penarikan dan pemuntiran benang POY sehingga memiliki tekstur berombak dan elastis.'
    },
    'Murata': {
      title: 'Mesin Murata',
      category: 'Teknologi',
      simpleDef: 'Mesin pembuat benang tekstur (DTY) asal Jepang yang digunakan di Unit Produksi DTY.'
    },
    'Spinning': {
      title: 'Spinning (Pemintalan)',
      category: 'Proses',
      simpleDef: 'Proses pemintalan serat poliester mentah menjadi gulungan benang POY.'
    },
    'Texturing': {
      title: 'Texturing (Pemberian Tekstur)',
      category: 'Proses',
      simpleDef: 'Proses pemberian tekstur mengembang dan keriting pada benang menggunakan pemanas dan pemuntiran mekanik.'
    },
    'Knitting': {
      title: 'Knitting (Merajut)',
      category: 'Kualitas',
      simpleDef: 'Proses merajut benang menjadi kain rajut contoh untuk keperluan pengujian celup warna di laboratorium.'
    },
    'Grading': {
      title: 'Grading (Penggolongan Mutu)',
      category: 'Kualitas',
      simpleDef: 'Proses pengelompokan kualitas benang hasil produksi ke dalam grade AX, A, B, dan C berdasarkan berat dan pengujian laboratorium.'
    },
    'K3': {
      title: 'K3 (Keselamatan & Kesehatan Kerja)',
      category: 'Protokol',
      simpleDef: 'Prosedur keselamatan kerja untuk melindungi operator dan lingkungan kerja di area lantai produksi.'
    },
    'APD': {
      title: 'APD (Alat Pelindung Diri)',
      category: 'Protokol',
      simpleDef: 'Perlengkapan keselamatan wajib seperti sepatu safety, helm pelindung kepala, penutup telinga, dan sarung tangan.'
    },
    'Creel': {
      title: 'Creel (Rak Gulungan)',
      category: 'Teknologi',
      simpleDef: 'Rak tempat meletakkan gulungan benang POY agar dapat diumpankan ke mesin DTY secara teratur.'
    },
    'Take-up': {
      title: 'Take-up (Penggulungan Akhir)',
      category: 'Proses',
      simpleDef: 'Mekanisme gulung ulang otomatis benang hasil produksi ke selongsong kertas (paper cone).'
    }
  };

  // --- 1. Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Header background transition on scroll
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. Dynamic Smart Tooltips for Technical Terms ---
  const techTerms = document.querySelectorAll('.tech-term');
  
  techTerms.forEach(termEl => {
    const termKey = termEl.getAttribute('data-term');
    const termData = glossaryDb[termKey];
    
    if (termData) {
      // Create and inject custom tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.innerHTML = `
        <h5>${termData.title} <span>${termData.category}</span></h5>
        <p>${termData.simpleDef}</p>
      `;
      termEl.appendChild(tooltip);
      
      // Support for touch screens (tap to toggle tooltip)
      termEl.addEventListener('click', (e) => {
        // Prevent click events if clicking inside tooltip
        if (e.target.closest('.custom-tooltip')) return;
        
        // Toggle active class
        const isActive = termEl.classList.contains('active');
        
        // Hide other tooltips
        techTerms.forEach(t => t.classList.remove('active'));
        
        if (!isActive) {
          termEl.classList.add('active');
        } else {
          termEl.classList.remove('active');
        }
        
        e.stopPropagation();
      });
    }
  });

  // Close active tooltip when clicking outside
  document.addEventListener('click', () => {
    techTerms.forEach(t => t.classList.remove('active'));
  });

  // --- 3. Timeline Interactive Detail Panels ---
  const toggleDetailBtns = document.querySelectorAll('.toggle-detail-btn');
  
  toggleDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('i');
      const label = btn.querySelector('.btn-label');
      
      if (panel && panel.classList.contains('detail-panel')) {
        panel.classList.toggle('active');
        
        // Change button icon and text
        if (panel.classList.contains('active')) {
          icon.className = 'bi bi-chevron-up';
          label.textContent = 'Tutup Detail Teknis';
        } else {
          icon.className = 'bi bi-chevron-down';
          label.textContent = 'Lihat Detail Teknis';
        }
      }
    });
  });

  // --- 4. Interactive Glossary Section (Kamus Istilah) ---
  const glossaryGrid = document.querySelector('.glossary-grid');
  const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Render glossary cards dynamically
  function renderGlossary(filterCategory = 'semua', searchQuery = '') {
    if (!glossaryGrid) return;
    
    glossaryGrid.innerHTML = '';
    let matchesCount = 0;

    Object.keys(glossaryDb).forEach(key => {
      const item = glossaryDb[key];
      const categoryMatch = filterCategory === 'semua' || item.category.toLowerCase() === filterCategory.toLowerCase();
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.simpleDef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          key.toLowerCase().includes(searchQuery.toLowerCase());

      if (categoryMatch && searchMatch) {
        matchesCount++;
        const card = document.createElement('div');
        card.className = 'glossary-card';
        card.innerHTML = `
          <div class="glossary-header">
            <h4 class="glossary-term">${item.title}</h4>
            <span class="glossary-category">${item.category}</span>
          </div>
          <p class="glossary-definition">${item.simpleDef}</p>
        `;
        glossaryGrid.appendChild(card);
      }
    });

    if (matchesCount === 0) {
      glossaryGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <i class="bi bi-search" style="font-size: 2.5rem; display: block; margin-bottom: 1rem; color: var(--border-color-hover)"></i>
          Tidak ada istilah yang cocok dengan pencarian Anda.
        </div>
      `;
    }
  }

  // Search input listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
      renderGlossary(activeFilter, e.target.value);
    });
  }

  // Filter buttons listener
  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        const query = searchInput ? searchInput.value : '';
        renderGlossary(filter, query);
      });
    });
  }

  // Initialize Glossary Section
  renderGlossary();

  // --- 5. Navigation Scrollspy ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-menu a').forEach(el => el.classList.remove('active'));
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
});
