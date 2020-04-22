import React from "react";
import { shallow } from "enzyme";
import { render } from "tests/utils/rtl";
import { UnwrappedMainNavigation, publishStatusSubscription } from "./";
import { MeContext } from "App/MeContext";
//import { SynchronousPromise } from "synchronous-promise";

describe("MainNavigation", () => {
  let props, user, mocks, queryWasCalled;
  beforeEach(() => {
    user = {
      id: "123",
      displayName: "Batman",
      name: "Bruce",
      email: "IAmBatman@dccomics.com",
      picture: "",
      admin: true,
    };
    const page = { id: "2", title: "Page", position: 0 };
    const section = { id: "3", title: "Section", pages: [page] };
    const questionnaire = {
      id: "1",
      title: "Questionnaire",
      sections: [section],
      editors: [],
      createdBy: { ...user },
    };
    props = {
      questionnaire,
      match: { params: { modifier: "", questionnaireId: questionnaire.id } },
      loading: false,
    };
    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: props.match.params.questionnaireId },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              id: "1",
              publishStatus: "unpublished",
              __typename: "query",
            },
          };
        },
      },
    ];
  });

  it.only("should render", () => {
    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user }}>
        <UnwrappedMainNavigation {...props} />
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    const nav = getByTestId("main-navigation");
    expect(nav).toBeTruthy();
  });

  it("should only render container if loading", () => {
    const wrapper = shallow(<MainNavigation {...props} loading />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow sections to be added", () => {
    const wrapper = shallow(<MainNavigation {...props} />);
    wrapper.find("[data-test='nav-section-header']").simulate("addSection");
    expect(props.onAddSection).toHaveBeenCalledWith(props.questionnaire.id);
  });

  it("should allow pages to be added", () => {
    const wrapper = shallow(<MainNavigation {...props} />);
    wrapper
      .find("[data-test='nav-section-header']")
      .simulate("addQuestionPage");

    expect(props.onAddQuestionPage).toHaveBeenCalledWith();
  });

  it("should render an introduction nav item when the questionnaire has one", () => {
    props.questionnaire.introduction = {
      id: "1",
    };
    const wrapper = shallow(<MainNavigation {...props} />);
    expect(wrapper.find("[data-test='nav-introduction']")).toHaveLength(1);
  });
});
