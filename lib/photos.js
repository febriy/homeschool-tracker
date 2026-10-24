import { learningSubjects } from '../public/learning-data.js';
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
export const validPhotoId = id => typeof id === 'string' && /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(id);
export function validPhotoDetails(value) {
  return value && /^[a-zA-Z0-9-]{1,80}$/.test(value.childId || '') && /^\d{4}-\d{2}-\d{2}$/.test(value.date || '') && !Number.isNaN(Date.parse(value.date)) && typeof value.caption === 'string' && value.caption.length <= 500 && Object.hasOwn(learningSubjects,value.subject);
}
export function imageType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (bytes.length >= 8 && Buffer.from(bytes.subarray(0,8)).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes.length >= 12 && Buffer.from(bytes.subarray(0,4)).toString() === 'RIFF' && Buffer.from(bytes.subarray(8,12)).toString() === 'WEBP') return 'image/webp';
  return null;
}
