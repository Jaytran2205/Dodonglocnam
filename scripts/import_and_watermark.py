import os
import sys
import re
import json
import unicodedata
from PIL import Image, ImageDraw, ImageFont

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

SOURCE_FOLDERS = [
    {
        'folder_key': 'qua-tang-su-kien',
        'sub_slug': 'qua-tang-su-kien',
        'sub_name': 'Quà tặng sự kiện',
        'source_path': r'C:\Users\Admin\Downloads\Danh mục quà sự kiện, nhân dịp-20260916T193259Z-1-001\Danh mục quà sự kiện, nhân dịp',
        'dest_dir': r'public\images\products\qua-tang-su-kien'
    },
    {
        'folder_key': 'qua-tang-phong-thuy',
        'sub_slug': 'qua-tang-phong-thuy',
        'sub_name': 'Quà tặng phong thủy',
        'source_path': r'C:\Users\Admin\Downloads\quà tặng phong thủy',
        'dest_dir': r'public\images\products\qua-tang-phong-thuy'
    },
    {
        'folder_key': 'qua-tang-luu-niem',
        'sub_slug': 'qua-tang-khach-hang',
        'sub_name': 'Quà tặng lưu niệm, kỉ niệm',
        'source_path': r'C:\Users\Admin\Downloads\quà tặng lưu niệm, kỉ niệm-20260916T193302Z-1-001\quà tặng lưu niệm, kỉ niệm',
        'dest_dir': r'public\images\products\qua-tang-luu-niem'
    },
    {
        'folder_key': 'qua-tang-doanh-nghiep',
        'sub_slug': 'qua-tang-doanh-nghiep',
        'sub_name': 'Quà tặng doanh nghiệp',
        'source_path': r'C:\Users\Admin\Downloads\Quà tặng doanh nghiệp-20260916T193300Z-1-001\Quà tặng doanh nghiệp',
        'dest_dir': r'public\images\products\qua-tang-doanh-nghiep'
    }
]

def remove_tones(text):
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return text.replace('đ', 'd').replace('Đ', 'D')

def slugify(text):
    text = remove_tones(text.lower())
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_base_name(filename):
    name, _ = os.path.splitext(filename)
    # Remove (chính), ( chính), (phụ), ( phụ), (1), (2), (phụ)(1), etc.
    name = re.sub(r'\s*\(\s*(chính|phụ|ảnh chính|ảnh phụ)\s*\)(\s*\(\d+\)\s*)?', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s*\(\d+\)$', '', name)
    name = re.sub(r'[_\-]+', ' ', name)
    name = re.sub(r'\s+', ' ', name)
    return name.strip().lower()

def is_main_image(filename):
    lower = filename.lower()
    if 'chính' in lower or 'ảnh chính' in lower:
        return True
    if 'phụ' in lower or 'ảnh phụ' in lower:
        return False
    return None # not specified

def apply_watermark(img):
    img = img.convert('RGBA')
    W, H = img.size

    # Cap max dimensions to 1600px for web performance
    if max(W, H) > 1600:
        ratio = 1600.0 / max(W, H)
        new_w = int(W * ratio)
        new_h = int(H * ratio)
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        W, H = img.size

    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    logo_path = 'public/images/logo.png'
    if not os.path.exists(logo_path):
        return img.convert('RGB')

    # Bottom-right badge
    badge_w = int(W * 0.38)
    badge_h = int(badge_w * 0.26)
    logo_sz = int(badge_h * 0.72)

    logo = Image.open(logo_path).convert('RGBA')
    logo = logo.resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)

    margin = int(W * 0.02)
    bx2 = W - margin
    by2 = H - margin
    bx1 = bx2 - badge_w
    by1 = by2 - badge_h

    draw.rounded_rectangle(
        [bx1, by1, bx2, by2],
        radius=int(badge_h * 0.18),
        fill=(6, 14, 24, 215),
        outline=(223, 183, 85, 180),
        width=int(max(1, W * 0.002))
    )

    lx = bx1 + int(badge_h * 0.14)
    ly = by1 + (badge_h - logo_sz) // 2
    overlay.paste(logo, (lx, ly), logo)

    font_size_title = int(badge_h * 0.28)
    font_size_phone = int(badge_h * 0.22)
    try:
        font_title = ImageFont.truetype('C:/Windows/Fonts/timesbd.ttf', font_size_title)
        font_phone = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', font_size_phone)
    except Exception:
        font_title = ImageFont.load_default()
        font_phone = ImageFont.load_default()

    tx = lx + logo_sz + int(badge_h * 0.12)
    ty1 = by1 + int(badge_h * 0.18)
    ty2 = ty1 + font_size_title + int(badge_h * 0.08)

    draw.text((tx, ty1), 'ĐỒ ĐỒNG LỘC NAM', fill=(255, 215, 0, 255), font=font_title)
    draw.text((tx, ty2), '0836.122.222 - 0846.699.997', fill=(240, 245, 250, 240), font=font_phone)

    # Center watermark (subtle 10% opacity)
    center_logo_sz = int(min(W, H) * 0.35)
    c_logo = Image.open(logo_path).convert('RGBA')
    c_logo = c_logo.resize((center_logo_sz, center_logo_sz), Image.Resampling.LANCZOS)
    r, g, b, a = c_logo.split()
    a = a.point(lambda p: int(p * 0.10))
    c_logo.putalpha(a)
    cx = (W - center_logo_sz) // 2
    cy = (H - center_logo_sz) // 2
    overlay.paste(c_logo, (cx, cy), c_logo)

    final_img = Image.alpha_composite(img, overlay).convert('RGB')
    return final_img

def main():
    manifest = []

    for cfg in SOURCE_FOLDERS:
        src = cfg['source_path']
        dest = cfg['dest_dir']
        os.makedirs(dest, exist_ok=True)

        if not os.path.exists(src):
            print(f"Source path not found: {src}")
            continue

        print(f"\nProcessing {cfg['folder_key']} from {src}...")
        all_files = [f for f in os.listdir(src) if os.path.isfile(os.path.join(src, f)) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

        # Group by clean base name
        product_groups = {}
        for f in all_files:
            base = clean_base_name(f)
            if base not in product_groups:
                product_groups[base] = []
            product_groups[base].append(f)

        print(f"Found {len(product_groups)} products in {cfg['folder_key']}")

        for base, files in product_groups.items():
            base_slug = slugify(base)
            
            # Sort files: main first, then secondary
            main_files = [f for f in files if is_main_image(f) is True]
            sub_files = [f for f in files if is_main_image(f) is False]
            other_files = [f for f in files if is_main_image(f) is None]

            sorted_files = []
            if main_files:
                sorted_files.extend(main_files)
                sorted_files.extend(sub_files)
                sorted_files.extend(other_files)
            elif other_files:
                sorted_files.append(other_files[0])
                sorted_files.extend(sub_files)
                sorted_files.extend(other_files[1:])
            else:
                sorted_files = sub_files

            processed_images = []

            for idx, orig_filename in enumerate(sorted_files):
                is_avatar = (idx == 0)
                tag = "chinh" if is_avatar else f"phu_{idx}"
                clean_dest_filename = f"{base_slug}_{tag}.jpg"
                dest_file_path = os.path.join(dest, clean_dest_filename)
                web_url = f"/images/products/{cfg['folder_key']}/{clean_dest_filename}".replace('\\', '/')

                src_file_path = os.path.join(src, orig_filename)
                try:
                    with Image.open(src_file_path) as raw_img:
                        watermarked = apply_watermark(raw_img)
                        watermarked.save(dest_file_path, quality=90, optimize=True)
                        processed_images.append(web_url)
                except Exception as e:
                    print(f"Error watermarking {orig_filename}: {e}")

            if processed_images:
                manifest.append({
                    'folder_key': cfg['folder_key'],
                    'sub_slug': cfg['sub_slug'],
                    'sub_name': cfg['sub_name'],
                    'base_name': base,
                    'base_slug': base_slug,
                    'main_image': processed_images[0],
                    'images': processed_images
                })
                print(f"  + Product '{base}': {len(processed_images)} images -> Avatar: {processed_images[0]}")

    with open('import_manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"\nCompleted! Total products processed and watermarked: {len(manifest)}")
    print(f"Manifest saved to import_manifest.json")

if __name__ == '__main__':
    main()
