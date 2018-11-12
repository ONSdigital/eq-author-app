export const TAB_GOTO = "TAB_GOTO";

export const gotoTab = (tabsId, activeTabId) => ({
  type: TAB_GOTO,
  payload: { tabsId, activeTabId }
});
