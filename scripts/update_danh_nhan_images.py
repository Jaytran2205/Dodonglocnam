import os
import sys
from PIL import Image, ImageDraw, ImageFont

def apply_watermark(image_path, output_path):
    print(f"Processing watermark for: {image_path} -> {output_path}")
    img = Image.open(image_path).convert('RGBA')
    W, H = img.size

    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    logo_path = 'public/images/logo.png'
    if not os.path.exists(logo_path):
        print(f"Logo not found at {logo_path}")
        return False

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

    logo = Image.open(logo_path).convert('RGBA')
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

    center_logo_sz = int(min(W, H) * 0.35)
    c_logo = Image.open(logo_path).convert('RGBA')
    c_logo = c_logo.resize((center_logo_sz, center_logo_sz), Image.Resampling.LANCZOS)
    r, g, b, a = c_logo.split()
    a = a.point(lambda p: int(p * 0.10))
    c_logo.putalpha(a)
    cx = (W - center_logo_sz) // 2
    cy = (H - center_logo_sz) // 2
    overlay.paste(c_logo, (cx, cy), c_logo)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_img = Image.alpha_composite(img, overlay).convert('RGB')
    final_img.save(output_path, 'JPEG', quality=93)
    print(f"Saved: {output_path}")
    return True

items = [
    (
        "C:/Users/Admin/.gemini/antigravity/brain/73242ecb-02bb-4289-b2e3-5ed29637caea/.user_uploaded/media_1789818269651.jpg",
        "public/images/locnam_real/locnam_tran_hung_dao.jpg"
    ),
    (
        "C:/Users/Admin/.gemini/antigravity/brain/73242ecb-02bb-4289-b2e3-5ed29637caea/.user_uploaded/media_1789818411113.jpg",
        "public/images/locnam_real/locnam_bac_ho.jpg"
    ),
    (
        "C:/Users/Admin/.gemini/antigravity/brain/73242ecb-02bb-4289-b2e3-5ed29637caea/.user_uploaded/media_1789818481872.jpg",
        "public/images/locnam_real/locnam_bac_giap.jpg"
    )
]

for src, dst in items:
    if os.path.exists(src):
        apply_watermark(src, dst)
    else:
        print(f"Source file not found: {src}")
