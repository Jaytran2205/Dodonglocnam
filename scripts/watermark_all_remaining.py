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

            badge_h = max(38, int(min(W, H) * 0.095))
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

            logo = base_logo.resize((logo_sz, logo_sz), Image.Resampling.LANCZOS)
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
