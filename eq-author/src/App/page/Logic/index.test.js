import React from "react";
// import { shallow } from "enzyme";

import { render, flushPromises, act } from "tests/utils/rtl";
// import { Tab, activeClassName } from "./";
import { publishStatusSubscription } from "components/EditorLayout/Header";

import { UnwrappedLogicPage } from "./";

describe("Logic Page", () => {
  let props, mocks, questionnaireId;

  beforeEach(() => {
    questionnaireId = "1";
    props = {
      loading: false,
      data: {
        page: {
          id: "1",
          displayName: "My first displayname",
          title: "My first title",
          validationErrorInfo: {
            totalCount: 2,
            errors: [
              {
                id: "expressions-skipConditions-1",
              },
              {
                id: "expressions-routing-1",
              },
            ],
          },
        },
      },
    };

    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: questionnaireId },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaireId,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });

  // const render = props => {
  //   return shallow(
  //     <UnwrappedLogicPage
  //       match={match}
  //       {...defaultProps}
  //       {...props}
  //       {...children}
  //     >
  //       Content
  //     </UnwrappedLogicPage>
  //   );
  // };

  // it("should render", () => {
  //   expect(render()).toMatchSnapshot();
  // });

  // it("should show loading info when loading", () => {
  //   expect(render({ loading: true })).toMatchSnapshot();
  // });

  // it("should show error info when there is an error", () => {
  //   expect(render({ error: { message: "some error" } })).toMatchSnapshot();
  // });

  // it("should render an error when there is no data", () => {
  //   expect(render({ data: undefined })).toMatchSnapshot();
  // });

  it("should provide the validation error dot for the routing tab if design page has error", async () => {
    const { getAllByTestId, debug } = render(
      <UnwrappedLogicPage {...props}>Some Children content</UnwrappedLogicPage>,
      {
        mocks,
      }
    );

    await act(async () => {
      await flushPromises();
    });

    debug();

    expect(getAllByTestId("badge-withCount").length).toBe(2);
  });
});
