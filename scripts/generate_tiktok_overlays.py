#!/usr/bin/env python3
"""Generate TikTok ad text overlays (1080x1920) for Hostora."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parents[1] / "tmp" / "tiktok"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1080, 1920
GOLD = (232, 165, 75, 255)
WHITE = (244, 241, 234, 255)
MUTED = (154, 149, 140, 255)
SCRIM = (11, 11, 12, 160)


def font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    path = (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
        if bold
        else "/System/Library/Fonts/Supplemental/Arial.ttf"
    )
    return ImageFont.truetype(path, size)


def base() -> Image.Image:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, H - 520, W, H), fill=SCRIM)
    return img


def centered_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    f: ImageFont.FreeTypeFont,
    fill: tuple,
) -> None:
    bbox = draw.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, y), text, font=f, fill=fill)


def save_lines(name: str, lines: list[tuple[str, int, tuple]], top: int = 1420) -> None:
    img = base()
    draw = ImageDraw.Draw(img)
    y = top
    for text, size, color in lines:
        centered_text(draw, text, y, font(size), color)
        y += int(size * 1.35)
    path = OUT / name
    img.save(path)
    print(path)


def end_card(mark_path: Path) -> None:
    img = Image.new("RGBA", (W, H), (11, 11, 12, 255))
    draw = ImageDraw.Draw(img)

    mark = Image.open(mark_path).convert("RGBA")
    mark = mark.resize((180, 180), Image.Resampling.LANCZOS)
    img.paste(mark, ((W - 180) // 2, 620), mark)

    centered_text(draw, "Hostora", 860, font(96), GOLD)
    centered_text(draw, "Run the floor.", 980, font(52), WHITE)
    centered_text(draw, "US · UK · Europe", 1080, font(36), MUTED)
    centered_text(draw, "Book a demo", 1280, font(48), GOLD)
    centered_text(draw, "hostorasoft.co.uk", 1380, font(40), WHITE)

    path = OUT / "end-card.png"
    img.save(path)
    print(path)


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    save_lines(
        "overlay-hook.png",
        [
            ("Busy night.", 72, WHITE),
            ("Too many apps?", 64, GOLD),
        ],
    )
    save_lines(
        "overlay-platform.png",
        [
            ("One platform.", 68, WHITE),
            ("Whole floor.", 68, GOLD),
        ],
    )
    save_lines(
        "overlay-modules.png",
        [
            ("Till · Kitchen · QR", 48, WHITE),
            ("Reports · Stock · Staff", 44, MUTED),
        ],
        top=1450,
    )
    end_card(root / "public" / "brand" / "mark.png")
