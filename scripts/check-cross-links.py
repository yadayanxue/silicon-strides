#!/usr/bin/env python3
"""跨卷 fragment 链接校验 —— 必须先 npm run build 后再跑"""
import re, os, sys
from pathlib import Path

DIST = Path("dist")
DOCS = Path("src/content/docs")
errors = 0
fragments = set()

# 1. 收集所有跨卷 fragment
for md in DOCS.rglob("*.md"):
    text = md.read_text()
    for m in re.finditer(r'\[[^\]]*\]\(\.\./[^)]*#([^)]*)\)', text):
        fragments.add(m.group(1))

print(f"=== 跨卷 fragment 链接校验 ===\n  共 {len(fragments)} 条去重 fragment")

# 2. 在 dist 中逐条搜索
for frag in sorted(fragments):
    found = list(DIST.rglob("*.html"))
    # 只搜索 HTML 文件中的 id="frag"
    exists = False
    for html in DIST.rglob("*.html"):
        if f'id="{frag}"' in html.read_text(errors='ignore'):
            exists = True
            break
    if not exists:
        # 找引用源
        sources = []
        for md in DOCS.rglob("*.md"):
            if f"#{frag}" in md.read_text():
                sources.append(str(md.relative_to(DOCS)))
        src_str = ", ".join(sources[:3])
        print(f"  ❌ #{frag}")
        print(f"     来自: {src_str}")

        # 搜索相似 ID
        partial = frag[:8]
        similar = set()
        for html in DIST.rglob("*.html"):
            for m in re.finditer(rf'id="([^"]*{re.escape(partial)}[^"]*)"', html.read_text(errors='ignore')):
                similar.add(m.group(1))
        for s in sorted(similar)[:3]:
            print(f"     相似: #{s}")
        errors += 1

print()
if errors == 0:
    print("  ✅ 全部 fragment 链接通过")
else:
    print(f"  ❌ {errors} 条失败")
    sys.exit(1)
