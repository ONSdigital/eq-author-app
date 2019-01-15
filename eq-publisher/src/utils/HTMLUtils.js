const cheerio = require("cheerio");

const { replace } = require("lodash/fp");

const isPlainText = elem => typeof elem === "string" && !elem.startsWith("<");

const getInnerHTML = elem => (isPlainText(elem) ? elem : cheerio(elem).html());

const unescapePiping = value =>
  replace(
    /{{([^}}]+)}}/g,
    (_, match) => `{{${replace(/&apos;/g, "'", match)}}}`,
    value
  );

const getInnerHTMLWithPiping = elem => unescapePiping(getInnerHTML(elem));

const getText = elem => (isPlainText(elem) ? elem : cheerio(elem).text());

const description = elem => ({ description: getInnerHTMLWithPiping(elem) });

const title = elem => ({ title: getInnerHTMLWithPiping(elem) });

const list = elem => ({
  list: cheerio(elem)
    .find("li")
    .map((i, li) => getInnerHTMLWithPiping(li))
    .toArray()
});

const mapElementToObject = elem => {
  switch (elem.name) {
    case "p":
      return description(elem);
    case "h2":
      return title(elem);
    case "ul":
      return list(elem);
  }
};

const parseContent = html => {
  const content = cheerio(html)
    .filter((i, elem) => getInnerHTML(elem) !== "")
    .map((i, elem) => mapElementToObject(elem))
    .toArray();

  if (content.length === 0) {
    return;
  }

  return { content };
};

module.exports = {
  getInnerHTML,
  getText,
  parseContent,
  getInnerHTMLWithPiping,
  unescapePiping
};
