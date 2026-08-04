"""Génère l'image Open Graph statique 1200×630 pour Facebook."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "og-share.png"

BG_TOP = (244, 244, 248)
BG_MID = (232, 232, 240)
ACCENT = (255, 223, 61)
GREEN = (20, 184, 135)
INK = (18, 17, 23)
MUTED = (106, 105, 124)


def main() -> None:
    img = Image.new("RGB", (W, H), BG_TOP)
    draw = ImageDraw.Draw(img)

    for y in range(H):
        t = y / H
        r = int(BG_TOP[0] + (BG_MID[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_MID[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_MID[2] - BG_TOP[2]) * t)
        if t > 0.45:
            fade = (t - 0.45) / 0.55
            r = int(r + (ACCENT[0] - r) * fade * 0.2)
            g = int(g + (ACCENT[1] - g) * fade * 0.2)
            b = int(b + (ACCENT[2] - b) * fade * 0.2)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    try:
        title_font = ImageFont.truetype("arialbd.ttf", 52)
        sub_font = ImageFont.truetype("arial.ttf", 28)
        badge_font = ImageFont.truetype("arialbd.ttf", 22)
        brand_font = ImageFont.truetype("arialbd.ttf", 34)
    except OSError:
        title_font = ImageFont.load_default()
        sub_font = ImageFont.load_default()
        badge_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()

    draw.rounded_rectangle((48, 48, 100, 100), radius=14, fill=GREEN)
    draw.text((62, 58), "B", fill=ACCENT, font=brand_font)
    draw.text((118, 58), "BacheliO", fill=INK, font=brand_font)

    draw.rounded_rectangle((W - 220, 52, W - 48, 96), radius=999, fill=GREEN)
    draw.text((W - 200, 60), "Plateforme", fill=INK, font=badge_font)

    card = (56, 130, W - 56, H - 120)
    draw.rounded_rectangle(card, radius=24, fill=(255, 255, 255), outline=INK, width=3)
    draw.text((92, 170), "BacheliO — du bac à l'emploi", fill=INK, font=title_font)
    draw.text(
        (92, 250),
        "Orientation IA · Mentorat · Bourses · Forum · Stages",
        fill=MUTED,
        font=sub_font,
    )

    draw.text((56, H - 72), "www.bachelio.com", fill=MUTED, font=sub_font)
    draw.rounded_rectangle((W - 260, H - 78, W - 56, H - 38), radius=8, fill=ACCENT)
    draw.text((W - 242, H - 72), "Guinée · Étudiants", fill=INK, font=badge_font)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"Écrit : {OUT}")


if __name__ == "__main__":
    main()
