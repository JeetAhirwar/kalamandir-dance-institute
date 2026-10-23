#!/usr/bin/env bash
# One-pass recompress of live institute imagery to display-appropriate sizes.
# Proportional scaling only (never crops), so the aspect ratios recorded in
# src/data/gallery.js stay valid and no layout shifts.
set -uo pipefail

DIR="public/assets/institute"
WEBP_Q=70
JPG_Q=6          # ffmpeg mjpeg: 2=best .. 31=worst
CAP_HERO=1400    # hero + full-bleed band
CAP_STD=1100     # grids, cards, studio wall, walk, poster

# Files that render near full-bleed (92vw band / 46vw hero) keep more pixels.
is_wide() {
    case "$1" in
        km-place-04|km-artwork-15) return 0 ;;
        *) return 1 ;;
    esac
}

total_before=0
total_after=0
fail=0

for src in "$DIR"/*.webp "$DIR"/*.jpg; do
    [ -e "$src" ] || continue
    base=$(basename "$src")
    stem="${base%.*}"
    ext="${base##*.}"

    cap=$(is_wide "$stem" && echo $CAP_HERO || echo $CAP_STD)
    size_before=$(stat -c%s "$src")

    out="/tmp/kmenc/$base"
    mkdir -p /tmp/kmenc
    rm -f "$out"

    if [ "$ext" = "webp" ]; then
        ffmpeg -y -loglevel error -i "$src" \
            -vf "scale=${cap}:${cap}:force_original_aspect_ratio=decrease" \
            -quality "$WEBP_Q" -c:v libwebp "$out"
    else
        ffmpeg -y -loglevel error -i "$src" \
            -vf "scale=${cap}:${cap}:force_original_aspect_ratio=decrease" \
            -q:v "$JPG_Q" -c:v mjpeg "$out"
    fi

    # Only replace when the encode succeeded, is decodable, and is actually smaller.
    if [ -s "$out" ] && newdim=$(ffprobe -v error -select_streams v:0 \
            -show_entries stream=width,height -of csv=p=0 "$out" 2>/dev/null) && \
        [ "$(stat -c%s "$out")" -lt "$size_before" ]; then
        mv "$out" "$src"
        size_after=$(stat -c%s "$src")
        total_before=$((total_before + size_before))
        total_after=$((total_after + size_after))
        printf "%-26s cap%-6s %s  %6dK -> %5dK\n" \
            "$base" "$cap" "${newdim//,/x}" \
            "$((size_before / 1024))" "$((size_after / 1024))"
    else
        fail=$((fail + 1))
        echo "KEPT (no gain or encode failed): $base"
    fi
done

echo
echo "recompressed: $(( (total_before - total_after)/1024/1024 )) MB saved  |  $(( total_after/1024/1024 )) MB remaining"
echo "skipped/failed: $fail"
