import os
import sys
import subprocess
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image, ImageDraw, ImageFont, ImageOps
import io

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

LOGO_PATH = 'public/images/logo.png'
BASE_COMMIT = '0b2b701'
RAW_BASE_DIR = r"C:\Users\Admin\Downloads\Ảnh web đồ đồng"

def apply_single_watermark(raw_img):
    img = ImageOps.exif_transpose(raw_img).convert('RGBA')
    W, H = img.size

    # Cap max dimension to 1200px for web performance & mobile fast loading
    if max(W, H) > 1200:
        ratio = 1200.0 / max(W, H)
        new_w = int(W * ratio)
        new_h = int(H * ratio)
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        W, H = img.size

    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    if not os.path.exists(LOGO_PATH):
        return img.convert('RGB')

    badge_h = max(36, int(min(W, H) * 0.095))
    logo_sz = int(badge_h * 0.72)

    font_size_title = int(badge_h * 0.28)
    font_size_phone = int(badge_h * 0.19)
    try:
        font_title = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', font_size_title)
        font_phone = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', font_size_phone)
    except Exception:
        font_title = ImageFont.load_default()
        font_phone = ImageFont.load_default()

    title_text = 'ĐỒ ĐỒNG LỘC NAM'
    phone_text = '0836.122.222 - 0846.699.997'

    title_bbox = font_title.getbbox(title_text)
    phone_bbox = font_phone.getbbox(phone_text)

    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    phone_w = phone_bbox[2] - phone_bbox[0]
    phone_h = phone_bbox[3] - phone_bbox[1]

    max_text_w = max(title_w, phone_w)

    pad_left = int(badge_h * 0.20)
    gap_logo_text = int(badge_h * 0.16)
    pad_right = int(badge_h * 0.45)

    badge_w = pad_left + logo_sz + gap_logo_text + max_text_w + pad_right
    gap_lines = int(badge_h * 0.08)
    total_text_h = title_h + gap_lines + phone_h

    margin = int(min(W, H) * 0.02)
    bx2 = W - margin
    by2 = H - margin
    bx1 = bx2 - badge_w
    by1 = by2 - badge_h

    draw.rounded_rectangle(
        [bx1, by1, bx2, by2],
        radius=int(badge_h * 0.18),
        fill=(6, 14, 24, 235),
        outline=(223, 183, 85, 220),
        width=int(max(1, min(W, H) * 0.002))
    )

    logo = Image.open(LOGO_PATH).convert('RGBA')
    logo = logo.resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)
    lx = bx1 + pad_left
    ly = by1 + (badge_h - logo_sz) // 2
    overlay.paste(logo, (lx, ly), logo)

    tx_base = lx + logo_sz + gap_logo_text
    ty1 = by1 + (badge_h - total_text_h) // 2
    ty2 = ty1 + title_h + gap_lines

    tx1 = tx_base + (max_text_w - title_w) // 2
    tx2 = tx_base + (max_text_w - phone_w) // 2

    draw.text((tx1, ty1), title_text, fill=(255, 215, 0, 255), font=font_title)
    draw.text((tx2, ty2), phone_text, fill=(240, 245, 250, 245), font=font_phone)

    # Center watermark (10% opacity)
    center_logo_sz = int(min(W, H) * 0.35)
    c_logo = Image.open(LOGO_PATH).convert('RGBA')
    c_logo = c_logo.resize((center_logo_sz, center_logo_sz), Image.Resampling.LANCZOS)
    r, g, b, a = c_logo.split()
    a = a.point(lambda p: int(p * 0.10))
    c_logo.putalpha(a)
    cx = (W - center_logo_sz) // 2
    cy = (H - center_logo_sz) // 2
    overlay.paste(c_logo, (cx, cy), c_logo)

    final_img = Image.alpha_composite(img, overlay).convert('RGB')
    return final_img

def restore_and_watermark_from_git(rel_path):
    """
    Extract clean unwatermarked image from commit 0b2b701 and watermark once.
    """
    try:
        git_path = rel_path.replace('\\', '/')
        data = subprocess.check_output(['git', 'show', f'{BASE_COMMIT}:{git_path}'])
        with Image.open(io.BytesIO(data)) as raw:
            wm = apply_single_watermark(raw)
            os.makedirs(os.path.dirname(rel_path), exist_ok=True)
            
            ext = os.path.splitext(rel_path)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                wm.save(rel_path, format='JPEG', quality=85, optimize=True)
            elif ext == '.webp':
                wm.save(rel_path, format='WEBP', quality=85)
            elif ext == '.png':
                wm.save(rel_path, format='PNG', optimize=True)
        return True, rel_path
    except Exception as e:
        return False, f"{rel_path}: {e}"

def watermark_raw_file(src_path, dest_path):
    """
    Watermark a raw file from 'Ảnh web đồ đồng' and save to public/images/products/...
    """
    try:
        with Image.open(src_path) as raw:
            wm = apply_single_watermark(raw)
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            wm.save(dest_path, format='JPEG', quality=85, optimize=True)
        return True, dest_path
    except Exception as e:
        return False, f"{dest_path}: {e}"

def main():
    start_time = time.time()
    print("=================================================================")
    print("   TIẾN TRÌNH KHÔI PHỤC & ĐÓNG DẤU CHUẨN 1 WATERMARK DUY NHẤT    ")
    print("=================================================================")

    # 1. Collect all candidate files in git commit 0b2b701 that belong to products
    out = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASE_COMMIT, 'public/images']).decode('utf-8')
    all_git_files = [line.strip() for line in out.splitlines() if line.strip()]

    # Filter to product image paths only
    product_git_files = []
    for f in all_git_files:
        ext = os.path.splitext(f)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            continue
        # Exclude banners, collections, du_an, showroom, logo, icons
        f_lower = f.lower()
        if any(skip in f_lower for skip in ['banners', 'collections', 'du_an', 'showroom', 'logo', 'icons', 'fav_']):
            continue
        product_git_files.append(os.path.normpath(f))

    print(f"\n[BƯỚC 1] Khôi phục từ git {BASE_COMMIT}: {len(product_git_files)} file ảnh sản phẩm...")
    success_git = 0
    fail_git = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(restore_and_watermark_from_git, f): f for f in product_git_files}
        for future in as_completed(futures):
            ok, msg = future.result()
            if ok:
                success_git += 1
            else:
                fail_git += 1
                print("  Lỗi git:", msg)

    print(f"  -> Hoàn tất: {success_git} thành công, {fail_git} lỗi.")

    # 2. Re-process all 1403 raw images from "Ảnh web đồ đồng" using ready_db_payload.json mapping
    print(f"\n[BƯỚC 2] Quét và đóng dấu toàn bộ ảnh từ thư mục gốc '{RAW_BASE_DIR}'...")
    with open('scratch/ready_db_payload.json', 'r', encoding='utf-8') as f:
        payload = json.load(f)

    raw_tasks = []
    for p in payload:
        raw_photos = p.get('raw_photos', [])
        pub_images = p.get('images', [])
        for src, dest_rel in zip(raw_photos, pub_images):
            if os.path.exists(src):
                dest_full = os.path.normpath(os.path.join('public', dest_rel.lstrip('/')))
                raw_tasks.append((src, dest_full))

    print(f"  Tổng số ảnh cần đóng dấu từ thư mục gốc: {len(raw_tasks)} ảnh.")
    success_raw = 0
    fail_raw = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(watermark_raw_file, src, dest): dest for src, dest in raw_tasks}
        for future in as_completed(futures):
            ok, msg = future.result()
            if ok:
                success_raw += 1
            else:
                fail_raw += 1
                print("  Lỗi raw:", msg)

    print(f"  -> Hoàn tất: {success_raw} thành công, {fail_raw} lỗi.")

    elapsed = time.time() - start_time
    print(f"\n=================================================================")
    print(f"HOÀN TẤT TIẾN TRÌNH TRONG {elapsed:.1f} GIÂY!")
    print(f"Tổng số ảnh được chuẩn hóa: {success_git + success_raw} ảnh.")
    print("=================================================================")

if __name__ == '__main__':
    main()
