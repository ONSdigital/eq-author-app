import { TAB_GOTO } from "redux/tabs/actions";
import tabsReducer from "redux/tabs/reducer";
import createAction from "tests/utils/createAction";
import createState from "tests/utils/createState";

describe("Tabs Reducer", () => {
  it("Update the store with id of tabs and currently active id", () => {
    expect(
      tabsReducer(
        createState(),
        createAction(TAB_GOTO, {
          tabsId: "tabs-1",
          activeTabId: "1"
        })
      )
    ).toMatchObject({ "tabs-1": "1" });
  });

  it("Should maintain the state of multiple tabs", () => {
    const firstState = tabsReducer(
      createState(),
      createAction(TAB_GOTO, {
        tabsId: "tabs-1",
        activeTabId: "1"
      })
    );

    const secondState = tabsReducer(
      firstState,
      createAction(TAB_GOTO, {
        tabsId: "tabs-2",
        activeTabId: "2"
      })
    );

    const thirdState = tabsReducer(
      secondState,
      createAction(TAB_GOTO, {
        tabsId: "tabs-3",
        activeTabId: "3"
      })
    );

    expect(thirdState).toMatchObject({
      "tabs-1": "1",
      "tabs-2": "2",
      "tabs-3": "3"
    });
  });
});
