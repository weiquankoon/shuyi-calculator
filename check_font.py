from fontTools.ttLib import TTFont

for font_path in ["SimKai-subset.ttf", "SimHei-subset.ttf"]:
    font = TTFont(font_path)
    print(f"Font: {font_path}")
    for record in font['name'].names:
        if record.nameID in [1, 4, 6]:
            print(f"  NameID {record.nameID}: {record.toUnicode()}")
    
    # Check if cmap table exists
    if 'cmap' in font:
        print("  Cmap table exists")
        for table in font['cmap'].tables:
            print(f"    PlatformID: {table.platformID}, EncodingID: {table.platEncID}, Format: {table.format}")
    else:
        print("  Cmap table MISSING")
