import os
from PIL import Image, ImageFilter

def create_4_3_image(src_path, output_path, target_height=1024):
    img = Image.open(src_path).convert('RGB')
    orig_w, orig_h = img.size

    target_h = target_height
    target_w = int(round(target_h * 4 / 3))

    scale = target_h / orig_h
    new_w = int(round(orig_w * scale))
    new_h = target_h
    scaled_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    if new_w < target_w:
        canvas = Image.new('RGB', (target_w, target_h), (12, 18, 25))
        offset_x = (target_w - new_w) // 2

        # Create background extension using mirrored/blurred edge slices
        left_slice = scaled_img.crop((0, 0, min(80, new_w), target_h))
        left_bg = left_slice.resize((offset_x, target_h), Image.Resampling.LANCZOS)
        left_bg = left_bg.filter(ImageFilter.GaussianBlur(radius=6))

        right_slice = scaled_img.crop((max(0, new_w - 80), 0, new_w, target_h))
        right_bg = right_slice.resize((target_w - (offset_x + new_w), target_h), Image.Resampling.LANCZOS)
        right_bg = right_bg.filter(ImageFilter.GaussianBlur(radius=6))

        canvas.paste(left_bg, (0, 0))
        canvas.paste(right_bg, (offset_x + new_w, 0))

        # Paste clean original image in center (NO WATERMARK)
        canvas.paste(scaled_img, (offset_x, 0))

        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        canvas.save(output_path, 'JPEG', quality=95)
        print(f"Created 4:3 image: {output_path} ({target_w}x{target_h})")
    else:
        left = (new_w - target_w) // 2
        cropped = scaled_img.crop((left, 0, left + target_w, target_h))
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        cropped.save(output_path, 'JPEG', quality=95)
        print(f"Created 4:3 cropped image: {output_path} ({target_w}x{target_h})")

src_tran_hung_dao = "C:/Users/Admin/.gemini/antigravity/brain/73242ecb-02bb-4289-b2e3-5ed29637caea/.user_uploaded/media_1789818269651.jpg"
src_bac_ho = "C:/Users/Admin/.gemini/antigravity/brain/73242ecb-02bb-4289-b2e3-5ed29637caea/.user_uploaded/media_1789818411113.jpg"
src_bac_giap = "C:/Users/Admin/.gemini/antigravity/brain/73242ecb-02bb-4289-b2e3-5ed29637caea/.user_uploaded/media_1789818481872.jpg"

create_4_3_image(src_tran_hung_dao, "public/images/locnam_real/locnam_tran_hung_dao.jpg", 1024)
create_4_3_image(src_bac_ho, "public/images/locnam_real/locnam_bac_ho.jpg", 1024)
create_4_3_image(src_bac_giap, "public/images/locnam_real/locnam_bac_giap.jpg", 1024)
