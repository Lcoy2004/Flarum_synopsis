/**
 * Safely truncate an HTML string without breaking opening/closing tags
 * Only characters in text nodes count towards the length
 * @param html
 * @param length
 */
export default function (html: string, length: number): string;
