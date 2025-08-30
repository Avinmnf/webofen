export function calculateReadTime(htmlContent: string): number {
  if (!htmlContent) return 1;

  // Strip HTML tags
  let text = htmlContent.replace(/<[^>]*>/g, " ");

  // Decode HTML entities
  const txtArea = document.createElement("textarea");
  txtArea.innerHTML = text;
  text = txtArea.value;

  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Count words (any sequence of non-whitespace characters)
  const words = text.length > 0 ? text.split(/\s+/).length : 0;

  const wordsPerMinute = 200; // average reading speed
  return Math.max(1, Math.ceil(words / wordsPerMinute)); // at least 1 minute
}
