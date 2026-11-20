"""Make web-ready copies of the portfolio's images and videos.

Originals in assets/ are never changed. Output goes to assets/web/ (mirroring the folders):
  - images  -> .webp, longest side capped, ~80% quality
  - videos  -> H.264 .mp4 (fast start, small), plus a .webp poster frame

Run:  python build-assets.py          (skips files already converted)
      python build-assets.py --force  (rebuilds everything)
Needs Pillow (pip install pillow) and ffmpeg on PATH.
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image

sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # file names can contain emoji

ROOT = Path(__file__).parent / "assets"
OUT = ROOT / "web"
FORCE = "--force" in sys.argv

IMAGE_DIRS = ["graphic-design", "fine-art"]
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp"}
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".webm"}
MAX_IMAGE = 1800  # px, longest side
# longest side for videos: motion graphics keep more detail
MAX_VIDEO = {"motion-graphics": 1920, "editing": 1280, "automation": 1280}


def slug(name: str) -> str:
    keep = "".join(c if c.isalnum() else "-" for c in name.lower())
    while "--" in keep:
        keep = keep.replace("--", "-")
    return keep.strip("-") or "file"


def image(src: Path):
    rel = src.relative_to(ROOT).parent
    dst = OUT / rel / (slug(src.stem) + ".webp")
    if dst.exists() and not FORCE:
        return
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    im.thumbnail((MAX_IMAGE, MAX_IMAGE), Image.LANCZOS)
    im.save(dst, "WEBP", quality=80, method=6)
    print(f"img  {src.relative_to(ROOT)}  ->  {dst.relative_to(ROOT)}  {im.size}")


def video(src: Path):
    cat = src.parent.name
    rel = src.relative_to(ROOT).parent
    base = OUT / rel / slug(src.stem)
    mp4, poster = base.with_suffix(".mp4"), base.with_suffix(".webp")
    base.parent.mkdir(parents=True, exist_ok=True)
    cap = MAX_VIDEO.get(cat, 1280)
    # scale the longest side down to `cap`, never up; keep even dimensions
    vf = f"scale='if(gt(iw,ih),min({cap},iw),-2)':'if(gt(iw,ih),-2,min({cap},ih))'"
    if FORCE or not mp4.exists():
        subprocess.run([
            "ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", vf,
            "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(mp4),
        ], check=True)
        if mp4.stat().st_size >= src.stat().st_size:
            # already well compressed: keep the original streams, just make it start playing faster
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-c", "copy", "-movflags", "+faststart", str(mp4)], check=True)
        print(f"vid  {src.relative_to(ROOT)}  ->  {mp4.relative_to(ROOT)}  {src.stat().st_size // 1024} KB -> {mp4.stat().st_size // 1024} KB")
    if FORCE or not poster.exists():
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp4)],
                                   capture_output=True, text=True, check=True).stdout.strip() or 2)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{min(dur * 0.2, 3):.2f}", "-i", str(mp4),
                        "-frames:v", "1", "-vf", "scale='min(960,iw)':-2", str(poster)], check=True)


if __name__ == "__main__":
    for d in IMAGE_DIRS:
        for f in sorted((ROOT / d).rglob("*")):
            if f.suffix.lower() in IMAGE_EXT:
                image(f)
    for f in sorted((ROOT / "videos").rglob("*")):
        if f.suffix.lower() in VIDEO_EXT:
            video(f)
    print("done")
