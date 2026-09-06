/**
 * Portfolio Interactive Scripts
 * Zaidan Alfarizy Putra Fadilah - Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------- 1. Theme Toggle -----------------------------
  const themeBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Determine initial theme
  const savedTheme = localStorage.getItem('porto_theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');

  html.setAttribute('data-theme', initialTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('porto_theme', newTheme);
    });
  }

  // ----------------------------- 2. Mobile Menu -----------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close when clicking nav links or CTA
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  // ----------------------------- 3. Active Nav Highlighting -----------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);

  // ----------------------------- 4. Hardware Gallery Switcher -----------------------------
  const mainGalleryImg = document.getElementById('case-main-img');
  const galleryMainBox = document.getElementById('case-gallery-main');
  const thumbs = document.querySelectorAll('.gallery-thumb');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const targetSrc = thumb.getAttribute('data-full');
      const docKey = thumb.getAttribute('data-doc-key');
      if (mainGalleryImg && targetSrc) {
        mainGalleryImg.src = targetSrc;
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (galleryMainBox && docKey) {
          galleryMainBox.setAttribute('data-current-key', docKey);
        }
      }
    });
  });

  if (galleryMainBox) {
    galleryMainBox.addEventListener('click', () => {
      const currentKey = galleryMainBox.getAttribute('data-current-key') || 'poster-iot';
      openDocModal(currentKey);
    });
  }

  // ----------------------------- 5. Document Lightbox / Modal -----------------------------
  const modalBackdrop = document.getElementById('doc-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalDesc = document.getElementById('modal-desc');
  const modalDownload = document.getElementById('modal-download');
  const modalClose = document.getElementById('modal-close');
  const pageControls = document.getElementById('modal-page-controls');
  const pageIndicator = document.getElementById('modal-page-indicator');
  const prevPageBtn = document.getElementById('modal-prev-page');
  const nextPageBtn = document.getElementById('modal-next-page');

  // Document Registry
  const docData = {
    'hki-buku-panduan': {
      title: 'Surat Pencatatan Ciptaan — Buku Panduan Smart Cat Litter Box IoT',
      subtitle: 'Kementerian Hukum & HAM RI / DJKI • No. EC002026098216 • Hak Cipta No. 001304498',
      pages: [
        'assets/images/surat_hki_buku_panduan_p1.jpg',
        'assets/images/surat_hki_buku_panduan_p2.jpg'
      ],
      pdf: 'assets/docs/surat_hki_buku_panduan.pdf'
    },
    'hki-spin-a-meal': {
      title: 'Surat Pencatatan Ciptaan — Program Komputer Website Spin A Meal',
      subtitle: 'Kementerian Hukum & HAM RI / DJKI • No. EC00202448914 • Hak Cipta No. 000624268',
      pages: [
        'assets/images/sertifikat_hakcipta_WebsiteSpinAMeal.jpg'
      ],
      pdf: 'assets/docs/sertifikat_hakcipta_WebsiteSpinAMeal.pdf'
    },
    'jaiea-paper': {
      title: 'Letter of Acceptance (LoA) — Journal of Artificial Intelligence and Engineering Applications',
      subtitle: 'JAIEA (SINTA Rank 5, E-ISSN 2808-4519) • Vol. 5 No. 3, Juni 2026 • Corresponding Author',
      pages: [
        'assets/images/loa_jaiea_preview.png'
      ],
      pdf: 'assets/docs/loa_jaiea_cat_litter_box.pdf'
    },
    'dicoding-android': {
      title: 'Sertifikat Kelulusan — Belajar Membuat Aplikasi Android untuk Pemula',
      subtitle: 'Dicoding Indonesia (Google Authorized Partner) • ID: JLX170EJGX72 • 60 Jam Pembelajaran',
      pages: [
        'assets/images/sertifikat_dicoding_android.png'
      ],
      pdf: 'assets/docs/sertifikat_dicoding_android.pdf'
    },
    'robot-juara3': {
      title: 'Sertifikat Penghargaan — Juara 3 Kontes Robot Cerdas Regional Kaltim-Kaltara',
      subtitle: 'Politeknik Negeri Samarinda • Kategori Robot Wall Follower (SLTA & Umum) • No. 5132/PL7.1.2/KM/2023',
      pages: [
        'assets/images/sertifikat_robot_juara3.png'
      ],
      pdf: 'assets/docs/sertifikat_robot_juara3.pdf'
    },
    'toefl-cert': {
      title: 'Certificate of Achievement — TOEFL Prediction Test',
      subtitle: 'Kementerian Pendidikan Tinggi, Sains, dan Teknologi • Politeknik Negeri Samarinda • UPA. Bahasa',
      desc: 'Sertifikat resmi uji kemahiran bahasa Inggris (TOEFL Prediction Test) dengan skor total 483: Listening Comprehension (51), Structure & Written Expression (42), dan Reading Comprehension (52). Diterbitkan oleh UPA Bahasa POLNES pada 06 Agustus 2026.',
      pages: [
        'assets/images/sertifikat_toefl.jpg'
      ],
      pdf: 'assets/docs/sertifikat_toefl.pdf'
    },
    'poster-iot': {
      title: 'Poster Penelitian & Rancang Bangun — Smart Cat Litter Box IoT',
      subtitle: 'Jurusan Teknologi Informasi - D4 Teknologi Rekayasa Komputer, Politeknik Negeri Samarinda',
      pages: [
        'assets/images/poster_cat_litter_box.png'
      ],
      pdf: 'assets/docs/poster_cat_litter_box.pdf'
    },
    'hardware-wiring': {
      title: 'Dokumentasi Perangkat Keras — Rangkaian Elektronika & Sensor',
      subtitle: 'Pengujian Breadboard, NodeMCU ESP8266, Driver DRV8825, Step-Down XL4005 & Sensor IR Obstacle',
      pages: [
        'assets/images/image24.jpeg'
      ],
      pdf: 'assets/images/image24.jpeg'
    },
    'hardware-stepper': {
      title: 'Dokumentasi Mekanikal — Motor Stepper NEMA17 & Rel Ulir Sisir',
      subtitle: 'Sistem Penggerak Lead Screw Presisi untuk Mekanisme Pembersih Kotak Pasir',
      pages: [
        'assets/images/hardware_stepper_mekanikal.jpeg',
        'assets/images/hardware_cad_mekanisme.jpeg'
      ],
      pdf: 'assets/images/hardware_stepper_mekanikal.jpeg'
    },
    'hardware-prototype': {
      title: 'Dokumentasi Prototipe — Rancang Bangun Fisik & Packaging',
      subtitle: 'Boks Kayu Litter Box, Tangga Kucing, Kompartemen Sampah & Modul PCB Terpasang',
      pages: [
        'assets/images/hardware_packaging_fisik.jpeg'
      ],
      pdf: 'assets/images/hardware_packaging_fisik.jpeg'
    },
    'magang-01': {
      title: 'Dokumentasi Operasional — Instalasi Jaringan & Crimping Kabel LAN',
      subtitle: 'PTUN Samarinda • Subbag PTIP • Pembuatan Kabel RJ-45 & Pengujian Jalur Jaringan Ruang Perkara',
      desc: 'Melakukan pembuatan kabel LAN (crimping RJ-45) untuk ruang perkara, penataan jalur jaringan fisik, investigasi kendala Wi-Fi Loss pada router/modem sentral, serta konfigurasi IP statik/DHCP.',
      pages: [
        'assets/images/magang/ptun_dok_01_p1.jpg',
        'assets/images/magang/ptun_dok_01_p2.jpg',
        'assets/images/magang/ptun_dok_01_p3.jpg'
      ],
      pdf: 'assets/images/magang/ptun_dok_01_p1.jpg'
    },
    'magang-02': {
      title: 'Dokumentasi Operasional — Setup Perangkat Printer & Maintenance',
      subtitle: 'PTUN Samarinda • Subbag PTIP • Pengisian Tinta Canon G3010, Pergantian Cartridge & Troubleshooting Driver',
      desc: 'Melakukan setup unit printer baru, pengisian tinta, serta penanganan masalah teknis (troubleshooting) seperti kertas macet (paper jam), pembersihan print head, nozzle check, dan konfigurasi driver jaringan.',
      pages: [
        'assets/images/magang/ptun_dok_02_p1.jpg',
        'assets/images/magang/ptun_dok_02_p2.jpg',
        'assets/images/magang/ptun_dok_02_p3.jpg',
        'assets/images/magang/ptun_dok_02_p4.jpg'
      ],
      pdf: 'assets/images/magang/ptun_dok_02_p1.jpg'
    },
    'magang-03': {
      title: 'Dokumentasi Operasional — Persiapan Perangkat Keras & Kiosk Antrian Tamu PTSP',
      subtitle: 'PTUN Samarinda • Subbag PTIP • Pengoperasian Mesin Antrian Sidang & Booting Rutin Komputer Layanan',
      desc: 'Melakukan persiapan dan pengoperasian perangkat TI harian, meliputi aktivasi (startup) PC operasional layanan publik, pengujian sistem Kiosk antrian sidang PTSP, serta pengetesan sistem video conference.',
      pages: [
        'assets/images/magang/ptun_dok_03_p1.jpg',
        'assets/images/magang/ptun_dok_03_p2.jpg',
        'assets/images/magang/ptun_dok_03_p3.jpg'
      ],
      pdf: 'assets/images/magang/ptun_dok_03_p1.jpg'
    },
    'magang-04': {
      title: 'Dokumentasi Operasional — Troubleshooting Perangkat Keras & Laptop Kantor',
      subtitle: 'PTUN Samarinda • Subbag PTIP • Pembersihan Modul RAM, Baterai CMOS, Servis PC All-in-One & Laptop Fujitsu',
      desc: 'Melakukan troubleshooting PC no-display dengan membersihkan pin RAM, konfigurasi ulang BIOS, penggantian baterai CMOS, pembongkaran PC AIO layanan SELDI, dan pemeliharaan fisik laptop inventaris kantor.',
      pages: [
        'assets/images/magang/ptun_dok_04_p1.jpg',
        'assets/images/magang/ptun_dok_04_p2.jpg',
        'assets/images/magang/ptun_dok_04_p3.jpg',
        'assets/images/magang/ptun_dok_04_p4.jpg'
      ],
      pdf: 'assets/images/magang/ptun_dok_04_p1.jpg'
    },
    'magang-05': {
      title: 'Dokumentasi Operasional — Fasilitasi Video Conference & Persidangan Daring',
      subtitle: 'PTUN Samarinda • Ruang Sidang Utama • Infrastruktur Audio Visual, Kamera PTZ & Koordinasi Dirjen',
      desc: 'Mempersiapkan infrastruktur video conference ruang sidang untuk eksaminasi daring, rapat koordinasi Mahkamah Agung RI, pembinaan Dirjen, instalasi kamera PTZ, dan pengujian audio microphone.',
      pages: [
        'assets/images/magang/ptun_dok_05_p1.jpg',
        'assets/images/magang/ptun_dok_05_p2.jpg',
        'assets/images/magang/ptun_dok_05_p3.jpg'
      ],
      pdf: 'assets/images/magang/ptun_dok_05_p1.jpg'
    },
    'magang-06': {
      title: 'Dokumentasi Pengembangan — Sistem E-Presensi Magang Berbasis Web',
      subtitle: 'PTUN Samarinda • Subbag PTIP & Kepegawaian • Dashboard Analitik Visualisasi Grafik & Manual Book SOP',
      desc: 'Merancang dan mengembangkan aplikasi web presensi mandiri peserta magang; mengimplementasikan visualisasi analitik (bar chart tren & donut chart ketepatan waktu) serta menyusun SOP manual book.',
      pages: [
        'assets/images/magang/ptun_dok_06_p1.png',
        'assets/images/magang/ptun_dok_06_p2.png',
        'assets/images/magang/ptun_dok_06_p3.png'
      ],
      pdf: 'assets/images/magang/ptun_dok_06_p1.png'
    },
    'magang-07': {
      title: 'Dokumentasi Pengembangan — Portal SI-CUTI (Sistem Informasi Cuti Pegawai)',
      subtitle: 'PTUN Samarinda • Subbag Kepegawaian & PTIP • Dasbor Portal Pegawai, Ringkasan Kuota Multi-Kategori & Persetujuan Berjenjang',
      desc: 'Mengembangkan aplikasi web SI-CUTI (Portal Pegawai) untuk digitalisasi permohonan cuti terpadu; menampilkan ringkasan kuota multi-kategori (tahunan, sakit, melahirkan, alasan penting), fitur tindakan cepat pengajuan mandiri, pelacakan status permohonan, serta dasbor verifikasi persetujuan berjenjang atasan.',
      pages: [
        'assets/images/magang/ptun_dok_07_dashboard.png'
      ],
      pdf: 'assets/images/magang/ptun_dok_07_dashboard.png'
    },
    'magang-08': {
      title: 'Dokumentasi Kegiatan — Desain Poster & Media Publikasi Digital',
      subtitle: 'PTUN Samarinda • Subbag PTIP • Perancangan Poster Hari Besar Keagamaan, Spanduk & Infografis Instansi',
      desc: 'Merancang desain grafis poster ucapan hari besar keagamaan (Jumat Agung & Ramadhan) untuk publikasi media sosial resmi PTUN Samarinda, perancangan spanduk luar ruang donor darah (3×1m), serta infografis rute perjalanan dinas.',
      pages: [
        'assets/images/magang/ptun_dok_08_p1.jpg',
        'assets/images/magang/ptun_dok_08_p2.jpg',
        'assets/images/magang/ptun_dok_08_p3.jpg',
        'assets/images/magang/ptun_dok_08_p4.jpg'
      ],
      pdf: 'assets/images/magang/ptun_dok_08_p1.jpg'
    }
  };

  let currentDocKey = null;
  let currentPageIndex = 0;

  function updateModalPage() {
    if (!currentDocKey || !docData[currentDocKey]) return;
    const doc = docData[currentDocKey];
    const pageSrc = doc.pages[currentPageIndex];

    // Show loading spinner
    const container = modalImg.parentElement;
    container.classList.add('loading');
    modalImg.style.opacity = '0';

    modalImg.onload = () => {
      container.classList.remove('loading');
      modalImg.style.opacity = '1';
    };
    modalImg.onerror = () => {
      container.classList.remove('loading');
      modalImg.style.opacity = '1';
    };

    modalImg.src = pageSrc;

    if (pageIndicator) {
      pageIndicator.textContent = `Halaman ${currentPageIndex + 1} dari ${doc.pages.length}`;
    }
    if (prevPageBtn && nextPageBtn) {
      prevPageBtn.disabled = currentPageIndex === 0;
      nextPageBtn.disabled = currentPageIndex === doc.pages.length - 1;
    }
  }

  function openDocModal(key) {
    if (!docData[key]) return;
    currentDocKey = key;
    currentPageIndex = 0;
    const doc = docData[key];

    modalTitle.textContent = doc.title;
    modalSubtitle.textContent = doc.subtitle;
    modalDownload.href = doc.pdf;
    modalDownload.setAttribute('download', doc.pdf.split('/').pop());

    if (modalDesc) {
      if (doc.desc) {
        modalDesc.textContent = doc.desc;
        modalDesc.style.display = 'block';
      } else {
        modalDesc.style.display = 'none';
      }
    }

    if (doc.pages.length > 1) {
      pageControls.style.display = 'flex';
    } else {
      pageControls.style.display = 'none';
    }

    updateModalPage();
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDocModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Trigger buttons
  document.querySelectorAll('[data-open-doc]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docKey = btn.getAttribute('data-open-doc');
      openDocModal(docKey);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeDocModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeDocModal();
      }
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPageIndex > 0) {
        currentPageIndex--;
        updateModalPage();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentDocKey && currentPageIndex < docData[currentDocKey].pages.length - 1) {
        currentPageIndex++;
        updateModalPage();
      }
    });
  }

  // ESC key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeDocModal();
    }
  });

  // ----------------------------- 6. Email Copy & Toast -----------------------------
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'zaidan.apf@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email berhasil disalin: zaidan.apf@gmail.com');
      }).catch(() => {
        showToast('zaidan.apf@gmail.com');
      });
    });
  }

  // ----------------------------- 7. Experience Carousel Navigation -----------------------------
  const expCarousel = document.getElementById('exp-docs-carousel');
  const expPrevBtn = document.getElementById('exp-prev-btn');
  const expNextBtn = document.getElementById('exp-next-btn');

  if (expCarousel && expPrevBtn && expNextBtn) {
    expPrevBtn.addEventListener('click', () => {
      expCarousel.scrollBy({ left: -340, behavior: 'smooth' });
    });
    expNextBtn.addEventListener('click', () => {
      expCarousel.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }
});
