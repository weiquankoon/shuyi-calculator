import os
import json
import base64
import subprocess
import glob

# 1. Collect all characters used in the project
chars = set()

# Basic characters
chars.update(set("数易生命数字计算工具报告张三年月日生肖属性五行分布类别自身财富事业官鬼父母数量本源梦想主性格星号位左右正面负面先天拥有缺解析重复次隐藏号码灵性探索者万倍磁场仅供参考第共页木火土金水鼠牛虎兔龙蛇马羊猴鸡狗猪"))
chars.update(set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':\",./<>? "))
chars.update(set("·■⚠•—()（）【】［］：，。、"))

def extract_chars_from_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            chars.update(set(content))
    except Exception as e:
        pass

# Read all JS, HTML, JSON
for filepath in glob.glob('src/**/*.js', recursive=True) + glob.glob('public/data/**/*.json', recursive=True) + ['index.html', 'flow.html']:
    extract_chars_from_file(filepath)

char_str = "".join(sorted(list(chars)))
with open("chars.txt", "w", encoding="utf-8") as f:
    f.write(char_str)

print(f"Collected {len(char_str)} unique characters.")

# 2. Subset fonts using pyftsubset
fonts_to_subset = [
    {"name": "KaiTi", "path": "C:\\Windows\\Fonts\\simkai.ttf"},
    {"name": "SimHei", "path": "C:\\Windows\\Fonts\\simhei.ttf"}
]

os.makedirs('src/pdf', exist_ok=True)
js_content = "export function registerFonts(doc) {\n"

for font in fonts_to_subset:
    out_file = f"{font['name']}-subset.ttf"
    print(f"Subsetting {font['name']}...")
    try:
        # Run pyftsubset with flags to ensure jsPDF compatibility
        subprocess.run([
            "python", "-m", "fontTools.subset",
            font['path'],
            f"--text-file=chars.txt",
            f"--output-file={out_file}",
            "--ignore-missing-glyphs",
            "--desubroutinize",
            "--no-hinting",
            "--name-IDs=*",
            "--name-legacy",
            "--name-languages=*",
            "--layout-features=*",
            "--notdef-glyph",
            "--notdef-outline",
            "--recommended-glyphs",
            "--legacy-cmap",
            "--symbol-cmap",
            "--glyph-names", # Preserve PS names
            "--drop-tables="
        ], check=True)
    except Exception as e:
        print(f"Subsetting failed for {font['name']}: {e}")
        subprocess.run([
            "python", "-m", "fontTools.subset",
            font['path'],
            f"--text-file=chars.txt",
            f"--output-file={out_file}"
        ], check=True)

    # Read the subsetted TTF and convert to base64
    with open(out_file, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("ascii")
    
    js_content += f"  var font_{font['name']} = '{encoded}';\n"
    js_content += f"  doc.addFileToVFS('{font['name']}.ttf', font_{font['name']});\n"
    js_content += f"  doc.addFont('{font['name']}.ttf', '{font['name']}', 'normal');\n"

js_content += "}\n"

with open('src/pdf/pdf-fonts.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Font subsetting complete! Generated src/pdf/pdf-fonts.js")
