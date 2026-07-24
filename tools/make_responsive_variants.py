"""
Generate resized WebP responsive variants for images in IMG/.
Requires Pillow (`pip install pillow`) and creates -w400/-w800/-w1200 variants.
"""
from PIL import Image
from pathlib import Path
import sys

IMG_DIR=Path('IMG')
if not IMG_DIR.exists():
    print('IMG directory not found')
    sys.exit(1)

sizes=[400,800,1200]
for p in IMG_DIR.glob('*.*'):
    if p.suffix.lower() not in ['.jpg','.jpeg','.png','.webp']:
        continue
    try:
        im=Image.open(p)
    except Exception as e:
        print('SKIP',p,e)
        continue
    for w in sizes:
        h=int(im.height * (w / im.width))
        out=IMG_DIR / f"{p.stem}-w{w}.webp"
        try:
            im.resize((w,h), Image.LANCZOS).save(out, 'WEBP', quality=80, method=6)
            print('WROTE', out)
        except Exception as e:
            print('ERR', out, e)
