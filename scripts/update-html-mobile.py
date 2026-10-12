import os

html_path = "HUONG_DAN_SU_DUNG_ADMIN_DODONGLOCNAM.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add mobile CSS
mobile_css = """
    /* Mobile Responsive Styles - Powered by jaydev */
    @media (max-width: 900px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 4px 0 24px rgba(0,0,0,0.6);
        width: 280px;
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .sidebar-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.7);
        z-index: 45;
        backdrop-filter: blur(3px);
      }
      .sidebar-overlay.active {
        display: block;
      }
      .main-container {
        margin-left: 0 !important;
        padding: 16px 12px 80px 12px !important;
        width: 100% !important;
      }
      .top-action-bar {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        padding: 14px;
      }
      .header-cover {
        padding: 24px 18px !important;
        margin-bottom: 20px;
        border-radius: 14px;
      }
      .cover-title {
        font-size: 21px !important;
      }
      .section-card {
        padding: 20px 14px !important;
        margin-bottom: 20px !important;
        border-radius: 12px;
      }
      .section-title {
        font-size: 18px !important;
      }
      .section-num {
        width: 32px;
        height: 32px;
        font-size: 15px;
      }
      .mockup-body {
        padding: 12px !important;
      }
      .ui-mockup div[style*="grid-template-columns: repeat(4, 1fr)"] {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .spec-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
      .spec-table th, .spec-table td {
        padding: 8px 10px !important;
        font-size: 12px !important;
      }
      .mobile-menu-trigger {
        display: flex !important;
      }
      .mobile-top-bar {
        display: flex !important;
      }
    }

    .mobile-top-bar {
      display: none;
      align-items: center;
      justify-content: space-between;
      background: #0a1420;
      color: white;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      border: 1px solid var(--primary);
    }

    .mobile-menu-trigger {
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 60;
      background: var(--gold-gradient);
      color: #08121e;
      border: none;
      border-radius: 50px;
      padding: 12px 22px;
      font-weight: 800;
      font-size: 14px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      cursor: pointer;
      align-items: center;
      gap: 8px;
    }
"""

if "/* Mobile Responsive Styles - Powered by jaydev */" not in html:
    html = html.replace("</style>", mobile_css + "\n  </style>")

# 2. Add Mobile Overlay and Mobile Top bar inside app-wrapper
mobile_elements = """
  <!-- MOBILE OVERLAY & TRIGGER -->
  <div class="sidebar-overlay" onclick="toggleMobileMenu()"></div>
  <button class="mobile-menu-trigger no-print" onclick="toggleMobileMenu()">
    ☰ Mục Lục
  </button>
"""
if '<div class="sidebar-overlay"' not in html:
    html = html.replace('<div class="app-wrapper">', '<div class="app-wrapper">\n' + mobile_elements)

# 3. Add PDF Download button in Top Action Bar
pdf_btn = """
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="HUONG_DAN_SU_DUNG_ADMIN_DODONGLOCNAM.pdf" download class="btn-print" style="text-decoration: none; background: #0c1825; color: #ffd700; border: 1px solid #ffd700;">
          📥 Tải file PDF về máy
        </a>
        <button class="btn-print" onclick="window.print()">
          🖨️ In / Xuất PDF
        </button>
      </div>
"""
old_btn = """      <button class="btn-print" onclick="window.print()">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></svg>
        In tài liệu / Xuất PDF
      </button>"""

if old_btn in html:
    html = html.replace(old_btn, pdf_btn)

# 4. Add Mobile JS functions
mobile_js = """
  function toggleMobileMenu() {
    const sb = document.querySelector('.sidebar');
    const ov = document.querySelector('.sidebar-overlay');
    if (sb && ov) {
      sb.classList.toggle('open');
      ov.classList.toggle('active');
    }
  }

  // Auto close mobile sidebar on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const sb = document.querySelector('.sidebar');
      const ov = document.querySelector('.sidebar-overlay');
      if (sb && ov) {
        sb.classList.remove('open');
        ov.classList.remove('active');
      }
    });
  });
"""
if "function toggleMobileMenu()" not in html:
    html = html.replace("</script>", mobile_js + "\n</script>")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated HTML mobile responsiveness successfully!")
