export const stripHtmlToText = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace("\u200B", "").trim();
};
