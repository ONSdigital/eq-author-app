export const stripHtmlToText = (html) => {
  let temp = document.createElement("DIV");
  temp.innerHTML = html;
  let result = temp.textContent || temp.innerText || "";
  result.replace("\u200B", ""); // zero width space
  result = result.trim();
  return result;
};
