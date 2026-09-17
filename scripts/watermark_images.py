import os
import sys
from PIL import Image, ImageDraw, ImageFont

def apply_watermark(image_path, output_path=None):
    if output_path is None:
        output_path = image_path

    try:
        img = Image.open(image_path).convert('RGBA')
        W, H = img.size

        overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        logo_path = 'public/images/logo.png'
        if not os.path.exists(logo_path):
            print(f"Logo not found at {logo_path}")
            return

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

        center_logo_sz = int(min(W, H) * 0.35)
        c_logo = Image.open(logo_path).convert('RGBA')
        c_logo = c_logo.resize((center_logo_sz, center_logo_sz), Image.Resampling.LANCZOS)
        r, g, b, a = c_logo.split()
        a = a.point(lambda p: int(p * 0.10))
        c_logo.putalpha(a)
        cx = (W - center_logo_sz) // 2
        cy = (H - center_logo_sz) // 2
        overlay.paste(c_logo, (cx, cy), c_logo)

        ext = os.path.splitext(output_path)[1].lower()
        if ext in ['.jpg', '.jpeg']:
            final_img = Image.alpha_composite(img, overlay).convert('RGB')
            final_img.save(output_path, quality=92)
        elif ext == '.webp':
            final_img = Image.alpha_composite(img, overlay).convert('RGB')
            final_img.save(output_path, quality=88, method=6)
        else:
            final_img = Image.alpha_composite(img, overlay)
            final_img.save(output_path)

        print(f"Watermarked: {output_path}")
    except Exception as e:
        print(f"Error watermarking {image_path}: {e}")

if __name__ == '__main__':
    if len(sys.argv) > 1:
        for arg in sys.argv[1:]:
            if os.path.isfile(arg):
                apply_watermark(arg)
            elif os.path.isdir(arg):
                for root, _, files in os.walk(arg):
                    for f in files:
                        if f.lower().endswith(('.jpg', '.jpeg', '.webp', '.png')):
                            apply_watermark(os.path.join(root, f))
    else:
        print("Usage: python watermark_images.py <file_or_dir>...")
