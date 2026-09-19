import os
import shutil
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

base_dir = os.path.abspath(os.path.dirname(__file__))
app_data = r"C:\Users\Admin\.gemini\antigravity\brain\73242ecb-02bb-4289-b2e3-5ed29637caea"

out_lo_hoa = os.path.join(base_dir, '..', 'public', 'images', 'products', 'lo-hoa')
os.makedirs(out_lo_hoa, exist_ok=True)

out_tuong_dong = os.path.join(base_dir, '..', 'public', 'images', 'products', 'tuong-dong')
os.makedirs(out_tuong_dong, exist_ok=True)

out_qua_tang = os.path.join(base_dir, '..', 'public', 'images', 'products', 'qua-tang')
os.makedirs(out_qua_tang, exist_ok=True)

image_mapping = [
    # 1. Bình hoa sen 20 nhánh bằng đồng dát vàng 24k
    (
        r"c:\Users\Admin\Downloads\Danh mục quà sự kiện, nhân dịp-20260916T193259Z-1-001\Danh mục quà sự kiện, nhân dịp\chậu hoa sen (chính).jpg",
        os.path.join(out_lo_hoa, "binh_hoa_sen_dat_vang_24k.jpg")
    ),
    # 2. Đôi Lọ Hoa Chạm Hoa Văn Bằng Đồng Vàng
    (
        os.path.join(app_data, "doi_lo_hoa_cham_dong_vang_1789785476500.jpg"),
        os.path.join(out_lo_hoa, "doi_lo_hoa_cham_dong_vang.jpg")
    ),
    # 3. Đôi Lọ Hoa Trơn Bằng Đồng Vàng Đậm Mộc
    (
        os.path.join(app_data, "lo_hoa_dong_vang_tron_1789785140697.jpg"),
        os.path.join(out_lo_hoa, "doi_lo_hoa_tron_dong_vang.jpg")
    ),
    # 4. Đôi lọ hoa tứ quý cao 36cm bằng đồng catut
    (
        os.path.join(app_data, "doi_lo_hoa_tu_quy_1789785275174.jpg"),
        os.path.join(out_lo_hoa, "doi_lo_hoa_tu_quy_catut.jpg")
    ),
    # 5. Lọ hoa tứ linh mộc mạ vàng 24k
    (
        os.path.join(app_data, "lo_hoa_tu_linh_diem_vang_1789785394649.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_tu_linh_diem_vang.jpg")
    ),
    # 6. Lọ hoa bằng đồng dát vàng 9999 cao cấp
    (
        os.path.join(app_data, "lo_hoa_dat_vang_9999_1789785317777.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_dat_vang_9999.jpg")
    ),
    # 7. Lọ hoa bằng đồng hun giả cổ trang nghiêm
    (
        os.path.join(app_data, "lo_hoa_hun_gia_co_1789785244420.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_hun_gia_co.jpg")
    ),
    # 8. Lọ hoa bằng đồng màu mộc nguyên bản
    (
        os.path.join(app_data, "lo_hoa_dong_moc_1789785217839.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_dong_moc_nguyen_ban.jpg")
    ),
    # 9. Lọ hoa bằng đồng màu cổ tự truyền thống
    (
        os.path.join(app_data, "lo_hoa_mau_co_tu_1789785440545.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_mau_co_tu.jpg")
    ),
    # 10. Lọ hoa bằng đồng đỏ cao cấp đúc thủ công
    (
        os.path.join(app_data, "lo_hoa_dong_do_1789785361794.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_dong_do_thu_cong.jpg")
    ),
    # 11. Lọ hoa bằng đồng đỏ khảm tam khí tinh xảo
    (
        os.path.join(base_dir, '..', 'public', 'images', 'locnam_real', 'locnam_loc_binh.jpg'),
        os.path.join(out_lo_hoa, "lo_hoa_kham_tam_khi.jpg")
    ),
    # 12. Lọ hoa bằng đồng màu vàng sáng bóng
    (
        os.path.join(app_data, "lo_hoa_dong_vang_bong_1789785167307.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_dong_vang_bong.jpg")
    ),
    # 13. Lọ hoa tứ linh bằng đồng thau thờ cúng
    (
        os.path.join(app_data, "lo_hoa_tu_linh_1789785191167.jpg"),
        os.path.join(out_lo_hoa, "lo_hoa_tu_linh_dong_thau.jpg")
    ),
    # 14. Lọ hoa bằng đồng (Đôi lọ lộc bình khảm tinh xảo)
    (
        os.path.join(base_dir, '..', 'public', 'images', 'du_an_thucte', 'duc-va-thi-cong-50-doi-lo-loc-binh-bang-dong-cho-t', 'lo-loc-binh-bang-dong-kham-2.jpg'),
        os.path.join(out_lo_hoa, "lo_hoa_bang_dong_locnam.jpg")
    ),
    # 15. Tượng Tam Đa Phúc Lộc Thọ Dát Vàng 9999
    (
        os.path.join(app_data, "tuong_tam_da_dat_vang_1789785559265.jpg"),
        os.path.join(out_tuong_dong, "tuong_tam_da_dat_vang_9999.jpg")
    ),
    # 16. Tranh Chữ Tri Ân Dát Vàng 24k
    (
        os.path.join(app_data, "tranh_chu_tri_an_1789785597986.jpg"),
        os.path.join(out_qua_tang, "tranh_chu_tri_an_dat_vang.jpg")
    )
]

for src, dst in image_mapping:
    if os.path.exists(src):
        try:
            im = Image.open(src)
            # Save optimized JPEG
            im.convert('RGB').save(dst, 'JPEG', quality=90, optimize=True)
            print(f"Processed: {os.path.basename(dst)} ({im.size})")
        except Exception as e:
            print(f"Error processing {src}: {e}")
            shutil.copy2(src, dst)
    else:
        print(f"NOT FOUND: {src}")

print("Image preparation complete.")
