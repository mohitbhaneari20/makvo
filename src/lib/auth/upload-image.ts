import { createClient } from "@/lib/supabase/client";
import { PROFILE_MEDIA_BUCKET } from "./media-config";

export type ImageKind = "avatar" | "cover";

/** Output size per image kind. Images are cropped to fill, re-encoded (which also drops EXIF data such as location) and kept small. */
const TARGET: Record<ImageKind, { w: number; h: number }> = { avatar: { w: 512, h: 512 }, cover: { w: 1600, h: 500 } };
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
export const IMAGE_ACCEPT = ACCEPTED.join(",");
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

export function checkImageFile(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return "Please choose a JPG, PNG or WebP image.";
  if (file.size > MAX_INPUT_BYTES) return "That image is over 15 MB. Please choose a smaller one.";
  return null;
}

async function resize(file: File, kind: ImageKind): Promise<Blob> {
  const { w, h } = TARGET[kind];
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.max(w / bitmap.width, h / bitmap.height);
  const sw = w / scale, sh = h / scale;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, (bitmap.width - sw) / 2, (bitmap.height - sh) / 2, sw, sh, 0, 0, w, h);
  bitmap.close();
  const encode = (type: string) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.86));
  // Some browsers can't encode WebP and silently return PNG; fall back to JPEG then.
  const webp = await encode("image/webp");
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await encode("image/jpeg");
  if (!jpeg) throw new Error("encode");
  return jpeg;
}

/** Uploads into the user's own folder and returns the public URL. Storage policies enforce the folder on the server. */
export async function uploadProfileImage(userId: string, file: File, kind: ImageKind): Promise<{ url: string; path: string }> {
  const blob = await resize(file, kind);
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/${kind}-${Date.now()}.${ext}`;
  const storage = createClient().storage.from(PROFILE_MEDIA_BUCKET);
  const { error } = await storage.upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return { url: storage.getPublicUrl(path).data.publicUrl, path };
}

/** Best-effort removal of a previous image, only when it lives in the user's own folder. */
export async function removeOldProfileImage(userId: string, publicUrl: string | null) {
  if (!publicUrl) return;
  const marker = `/storage/v1/object/public/${PROFILE_MEDIA_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i < 0) return;
  const path = decodeURIComponent(publicUrl.slice(i + marker.length));
  if (!path.startsWith(`${userId}/`)) return;
  await createClient().storage.from(PROFILE_MEDIA_BUCKET).remove([path]).catch(() => undefined);
}
