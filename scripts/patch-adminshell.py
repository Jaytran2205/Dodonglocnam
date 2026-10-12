import os

path = "components/admin/AdminShell.tsx"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

norm = text.replace("\r\n", "\n")

# 1. Add BookOpen import
target_import = "  Image as ImageIcon,\n} from \"lucide-react\";"
rep_import = "  Image as ImageIcon,\n  BookOpen,\n} from \"lucide-react\";"

if target_import in norm:
    norm = norm.replace(target_import, rep_import, 1)
    print("Import BookOpen added!")

# 2. Add PAGE_TITLES
target_title = '    "/admin/logs": "Lịch Sử Hoạt Động Hệ Thống",\n  };'
rep_title = '    "/admin/logs": "Lịch Sử Hoạt Động Hệ Thống",\n    "/admin/huong-dan": "Cẩm Nang Quản Trị Website",\n  };'

if target_title in norm:
    norm = norm.replace(target_title, rep_title, 1)
    print("PAGE_TITLES updated!")

# 3. Add navItems
target_nav = """    {
      href: "/admin/logs",
      label: "Lịch Sử Hoạt Động",
      icon: History,
      permission: "logs",
    },
  ];"""

rep_nav = """    {
      href: "/admin/logs",
      label: "Lịch Sử Hoạt Động",
      icon: History,
      permission: "logs",
    },
    {
      href: "/admin/huong-dan",
      label: "Cẩm Nang Quản Trị",
      icon: BookOpen,
    },
  ];"""

if target_nav in norm:
    norm = norm.replace(target_nav, rep_nav, 1)
    print("navItems updated!")

with open(path, "w", encoding="utf-8") as f:
    f.write(norm.replace("\n", "\r\n"))
