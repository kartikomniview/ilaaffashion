// Clips for the home page's "Moments in Style" row, hosted on the brand's S3 bucket. Each clip is a
// 720×1280 (9:16) MP4 of about 10s with music, and has a cover still under thumbnails/ with the same
// name, shown until the clip plays. The tiles are 9:16 too, so a clip is never cropped; the covers are
// closer to 2:3, so their sides are trimmed a little. To add a clip, upload both files and add a line.
import type { CategorySlug, StyleVideo } from "@/lib/types";

const BASE = "https://aawsite.s3.ap-south-1.amazonaws.com/illaffashion/videos/homepage";

const clip = (id: string, category: CategorySlug): StyleVideo => ({
  id,
  category,
  src: `${BASE}/video/compressed/${id}.mp4`,
  poster: `${BASE}/thumbnails/${id}.webp`,
});

export const styleVideos: StyleVideo[] = [
  clip("anarkali", "anarkalis"),
  clip("pakistani-suit", "pakistani-suits"),
  clip("kurti", "kurtis"),
  clip("saree", "sarees"),
  clip("co-ord", "co-ords"),
];
