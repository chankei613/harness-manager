"""
Generate OGP image for Harness Manager landing page (1200x630)
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG_TOP    = (15, 23, 42)    # navy-900
BG_BOTTOM = (30, 41, 59)    # navy-800
INDIGO    = (99, 102, 241)
WHITE     = (255, 255, 255)


def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def shield(draw, cx, cy, s, fill, outline=None, width=0):
    pts = [
        (cx, cy - s),
        (cx + s * 0.78, cy - s * 0.62),
        (cx + s * 0.78, cy + s * 0.18),
        (cx, cy + s * 1.05),
        (cx - s * 0.78, cy + s * 0.18),
        (cx - s * 0.78, cy - s * 0.62),
    ]
    if fill is not None:
        draw.polygon(pts, fill=fill)
    if outline is not None:
        draw.polygon(pts, outline=outline, width=width)


def main():
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    for y in range(H):
        t = y / H
        c = lerp_color(BG_TOP, BG_BOTTOM, t)
        draw.line([(0, y), (W, y)], fill=c)

    for y in range(0, H, 60):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 10), width=1)

    # Large decorative shield + padlock (right side)
    cx, cy = 930, 315
    shield(draw, cx, cy, 220, fill=None, outline=(255, 255, 255, 40), width=10)
    shield(draw, cx, cy, 150, fill=(99, 102, 241, 30))

    # Padlock
    lx, ly = cx, cy + 5
    draw.arc([lx - 45, ly - 95, lx + 45, ly - 15], start=180, end=360,
              fill=(255, 255, 255, 200), width=16)
    draw.rounded_rectangle([lx - 60, ly - 55, lx + 60, ly + 55], radius=14,
                            fill=(255, 255, 255, 230))
    draw.ellipse([lx - 14, ly - 12, lx + 14, ly + 16], fill=BG_TOP)

    NOTO_BOLD = "/Users/comet/Library/Fonts/NotoSansJP-Bold.ttf"
    NOTO_MEDIUM = "/Users/comet/Library/Fonts/NotoSansJP-Medium.ttf"
    NOTO_REG = "/Users/comet/Library/Fonts/NotoSansJP-Regular.ttf"

    font_badge = ImageFont.truetype(NOTO_MEDIUM, 22)
    font_title_en = ImageFont.truetype(NOTO_BOLD, 68)
    font_title_ja = ImageFont.truetype(NOTO_BOLD, 44)
    font_sub = ImageFont.truetype(NOTO_REG, 27)
    font_note = ImageFont.truetype(NOTO_REG, 21)

    LEFT = 80

    badge_text = "macOS Native App"
    bw = draw.textlength(badge_text, font=font_badge)
    bx, by = LEFT, 120
    draw.rounded_rectangle([bx, by - 8, bx + bw + 28, by + 30], radius=20,
                            fill=(99, 102, 241, 50))
    draw.text((bx + 14, by), badge_text, fill=(199, 199, 255, 240), font=font_badge)

    draw.text((LEFT, 172), "Harness Manager", fill=WHITE, font=font_title_en)
    draw.text((LEFT, 254), "Claude Code の権限を、GUIで管理する。", fill=(226, 232, 240, 220), font=font_title_ja)

    draw.line([(LEFT, 326), (LEFT + 300, 326)], fill=(255, 255, 255, 60), width=2)

    draw.text((LEFT, 346), "permissions・hooks・env をプロファイルで管理。", fill=(203, 213, 225, 180), font=font_sub)
    draw.text((LEFT, 384), "settings.json へワンクリックでエクスポート。", fill=(203, 213, 225, 180), font=font_sub)

    draw.text((LEFT, 470), "cometinc  ·  Free Download", fill=(255, 255, 255, 90), font=font_note)

    img.save("og-image.png")
    print("Saved: og-image.png (1200x630)")


if __name__ == "__main__":
    main()
