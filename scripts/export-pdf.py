import subprocess
import os

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe"
]

exe_path = None
for p in edge_paths:
    if os.path.exists(p):
        exe_path = p
        break

if not exe_path:
    print("Browser executable not found.")
    exit(1)

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_path = os.path.join(base_dir, "HUONG_DAN_SU_DUNG_ADMIN_DODONGLOCNAM.html")
pdf_path = os.path.join(base_dir, "HUONG_DAN_SU_DUNG_ADMIN_DODONGLOCNAM.pdf")

cmd = [
    exe_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file:///{html_path.replace(os.sep, '/')}"
]

res = subprocess.run(cmd)
if os.path.exists(pdf_path):
    print(f"PDF SUCCESS! Size: {os.path.getsize(pdf_path) / 1024:.1f} KB")
else:
    print("PDF FAILED.")
