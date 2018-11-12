export const findPageElements = selector => {
  return browser.elements(selector).value;
};

export const exists = selector => browser.isExisting(selector);

export const getPageTitle = () => browser.getTitle();
export const getPageHTML = element => browser.getHTML(element);

export const getElementText = element => {
  return browser.elementIdText(element.ELEMENT).value;
};

export const goToUrl = url => {
  browser.url(url);
};

export const startAtHomepage = () => {
  goToUrl("http://localhost:3000/");
};
