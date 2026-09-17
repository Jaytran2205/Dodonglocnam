import os
import subprocess
import sys
import time
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8')

def main():
    print("=== BAT DAU DONG DAU WATERMARK TOAN BO ANH CHINH & PHU ===")
    
    # Get previously watermarked files to avoid double-watermarking
    try:
        out = subprocess.check_output(['git', 'diff', '--name-only', 'HEAD~1', 'HEAD']).decode('utf-8', errors='ignore')
        already_watermarked = set(os.path.normpath(line.strip()) for line in out.splitlines() if line.strip())
    except Exception as e:
        print(f"Git diff check: {e}")
        already_watermarked = set()

    exclude_exact = {
        os.path.normpath('public/images/logo.png'),
        os.path.normpath('public/images/logo-emblem.png'),
        os.path.normpath('public/images/logo-legiagroup-50x50.png'),
        os.path.normpath('public/images/logo-legiagroup.jpg'),
        os.path.normpath('public/images/logo_lotus.jpg'),
    }

    logo_path = 'public/images/logo.png'
    if not os.path.exists(logo_path):
        print("ERROR: Logo file not found!")
        return

    base_logo = Image.open(logo_path).convert('RGBA')

    # Collect all candidate product images
    targets = []
    for root, dirs, files in os.walk('public/images'):
        r_lower = root.lower()
        if 'banners' in r_lower or 'icons' in r_lower or 'videos' in r_lower:
            continue
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.jpg', '.jpeg', '.webp', '.png']:
                full_path = os.path.normpath(os.path.join(root, f))
                if full_path in exclude_exact:
                    continue
                if full_path in already_watermarked:
                    continue
                targets.append(full_path)

    print(f"So luong anh can dong watermark: {len(targets)} anh.")

    success = 0
    errors = 0
    start_time = time.time()

    for idx, img_path in enumerate(targets, 1):
        try:
            with Image.open(img_path) as im:
                img = im.convert('RGBA')
            
            W, H = img.size
            if W < 100 or H < 100:
                continue

            overlay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)

            badge_w = int(W * 0.38)
            badge_h = int(badge_w * 0.26)
            logo_sz = int(badge_h * 0.72)

            logo = base_logo.resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)

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

            center_logo_sz = int(min(W, H) * 0.35)
            c_logo = base_logo.resize((center_logo_sz, center_logo_sz), Image.Resampling.LANCZOS)
            r, g, b, a = c_logo.split()
            a = a.point(lambda p: int(p * 0.10))
            c_logo.putalpha(a)
            cx = (W - center_logo_sz) // 2
            cy = (H - center_logo_sz) // 2
            overlay.paste(c_logo, (cx, cy), c_logo)

            ext = os.path.splitext(img_path)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                final_img = Image.alpha_composite(img, overlay).convert('RGB')
                final_img.save(img_path, quality=92)
            elif ext == '.webp':
                final_img = Image.alpha_composite(img, overlay).convert('RGB')
                final_img.save(img_path, quality=88, method=6)
            else:
                final_img = Image.alpha_composite(img, overlay)
                final_img.save(img_path)

            success += 1
            if idx % 100 == 0 or idx == len(targets):
                print(f"Tien do: {idx}/{len(targets)} anh ({success} thanh cong, {errors} loi)...")
        except Exception as e:
            errors += 1
            print(f"Loi anh {img_path}: {e}")

    elapsed = time.time() - start_time
    print(f"=== HOAN TAT: {success} anh da duoc dong dau watermark thanh cong trong {elapsed:.1f}s ===")

if __name__ == '__main__':
    main()
