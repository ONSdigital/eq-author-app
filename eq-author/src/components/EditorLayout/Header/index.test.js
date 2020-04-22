import React from "react";

import { render, flushPromises, act } from "tests/utils/rtl";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";
import Header, { publishStatusSubscription } from "./";

import { UNPUBLISHED } from "constants/publishStatus";

describe("Header", () => {
  let user, props, questionnaire, signOut, mocks;

  beforeEach(() => {
    questionnaire = {
      id: "456",
      displayName: "Questionnaire of Awesomeness",
      totalErrorCount: 0,
      createdBy: {
        id: "1",
        name: "Pinky Malinky",
        email: "pinky@welovestuff.com",
      },
      editors: [
        { id: "2", name: "Babs", email: "b@abs.com", picture: "babs.jpg" },
        { id: "3", name: "Jay", email: "j@ay.com", picture: "jay.jpg" },
      ],
    };
    user = {
      id: "123",
      displayName: "Rick Sanchez",
      email: "wubbalubba@dubdub.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };
    props = {
      title: "Some title",
      children: "Some content",
    };
    signOut = jest.fn();
    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: questionnaire.id },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaire.id,
              publishStatus: UNPUBLISHED,
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  const renderWithContext = (component, rest) =>
    render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          {component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaire.id}/page/2`,
        urlParamMatcher: "/q/:questionnaireId/:modifier",
        mocks,
        ...rest,
      }
    );

  // it("should show the currently logged in user", () => {
  //   const { queryByText } = renderWithContext(<Header {...props} />);

  //   expect(queryByText("Rick Sanchez")).toBeTruthy();
  // });

  // it("should be able to log out", () => {
  //   const { getByText } = renderWithContext(<Header {...props} />);

  //   expect(getByText("Rick Sanchez")).toBeTruthy();

  //   fireEvent.click(getByText("Rick Sanchez"));

  //   expect(signOut).toHaveBeenCalled();
  // });

  it("should show the questionnaire display name", () => {
    const { getByText } = renderWithContext(<Header {...props} />);

    expect(getByText(questionnaire.displayName)).toBeTruthy();
  });

  // describe("view survey button", () => {
  //   it("should show a button for previewing questionnaire", () => {
  //     const { getByText, getByTestId } = renderWithContext(
  //       <Header {...props} />
  //     );

  //     const viewSurveyButton = getByTestId("btn-preview");
  //     expect(viewSurveyButton.getAttribute("href")).toMatch(
  //       new RegExp(`/launch/${questionnaire.id}$`)
  //     );
  //     expect(getByText("View survey")).toBeTruthy();
  //   });

  //   it("should disable the view survey button when questionnaire is invalid", () => {
  //     questionnaire.totalErrorCount = 1;
  //     const { getByTestId } = renderWithContext(<Header {...props} />);

  //     const viewSurveyButton = getByTestId("btn-preview");
  //     expect(viewSurveyButton).toHaveAttribute("disabled");
  //   });

  //   it("should not disable the view survey button when questionnaire is valid", () => {
  //     const { getByTestId } = renderWithContext(<Header {...props} />);

  //     const viewSurveyButton = getByTestId("btn-preview");
  //     expect(viewSurveyButton).not.toHaveAttribute("disabled");
  //   });
  // });

  // describe("publish survey button", () => {
  //   it("should disable the publish survey button when questionnaire is invalid", () => {
  //     questionnaire.totalErrorCount = 1;
  //     const { getByTestId } = renderWithContext(<Header {...props} />);

  //     const publishSurveyButton = getByTestId("btn-publish");
  //     expect(publishSurveyButton).toHaveAttribute("disabled");
  //   });

  //   it("should not disable the publish survey button when questionnaire is valid", () => {
  //     const { getByText } = renderWithContext(<Header {...props} />);

  //     const publishSurveyButton = getByText("Publish");
  //     expect(publishSurveyButton).not.toHaveAttribute("disabled");
  //   });

  //   it("should disable the publish survey button when the user is currently on the publish page", () => {
  //     props.title = "Publish";
  //     const { getByTestId } = renderWithContext(<Header {...props} />);

  //     const publishSurveyButton = getByTestId("btn-publish");
  //     expect(publishSurveyButton).toHaveAttribute("disabled");
  //   });

  //   it("should disable the publish button when status is Published", () => {
  //     questionnaire.publishStatus = PUBLISHED;
  //     const { getByTestId } = renderWithContext(<Header {...props} />);

  //     const publishSurveyButton = getByTestId("btn-publish");
  //     expect(publishSurveyButton).toHaveAttribute("disabled");
  //   });

  //   it("should enable the button when publish subscription returns Unpublished", async () => {
  //     let queryWasCalled = false;
  //     renderWithContext(<Header {...props} />, {
  //       mocks: [
  //         {
  //           request: {
  //             query: publishStatusSubscription,
  //             variables: { id: questionnaire.id },
  //           },
  //           result: () => {
  //             queryWasCalled = true;
  //             return {
  //               data: {
  //                 publishStatusUpdated: {
  //                   id: questionnaire.id,
  //                   publishStatus: UNPUBLISHED,
  //                   __typename: "Questionnaire",
  //                 },
  //               },
  //             };
  //           },
  //         },
  //       ],
  //     });

  //     await act(async () => {
  //       await flushPromises();
  //     });
  //     expect(queryWasCalled).toBeTruthy();
  //   });

  //   it("should enable publish button for owner of questionnaire", () => {
  //     questionnaire.publishStatus = UNPUBLISHED;
  //     user = { ...user, id: "1", admin: false };
  //     const { getByTestId } = renderWithContext(<Header {...props} />);

  //     const publishSurveyButton = getByTestId("btn-publish");
  //     expect(publishSurveyButton).toBeTruthy();
  //   });

  //   it("should enable publish button for editor of questionnaire", () => {
  //     questionnaire.publishStatus = UNPUBLISHED;
  //     user = { ...user, id: "2", admin: false };
  //     const { getByTestId } = renderWithContext(<Header {...props} />);

  //     const publishSurveyButton = getByTestId("btn-publish");
  //     expect(publishSurveyButton).toBeTruthy();
  //   });

  //   it("should not display publish button when awaiting approval", () => {
  //     questionnaire.publishStatus = AWAITING_APPROVAL;
  //     user = { ...user, id: "1", admin: false };
  //     const { queryByTestId } = renderWithContext(<Header {...props} />);

  //     const publishSurveyButton = queryByTestId("btn-publish");
  //     expect(publishSurveyButton).toBeFalsy();
  //   });
  // });

  // describe("review survey button", () => {
  //   it("should display review button instead of publish when awaiting approval", () => {
  //     questionnaire.publishStatus = AWAITING_APPROVAL;
  //     const { queryByText } = renderWithContext(<Header {...props} />);

  //     expect(queryByText("Publish")).toBeFalsy();
  //     expect(queryByText("Review")).toBeTruthy();
  //   });

  //   it("should disable review button when on review page", () => {
  //     questionnaire.publishStatus = AWAITING_APPROVAL;
  //     props.title = "Review";
  //     const { getByTestId } = renderWithContext(<Header {...props} />);
  //     const reviewButton = getByTestId("btn-review");

  //     expect(reviewButton).toHaveAttribute("disabled");
  //   });

  //   it("should hide review button when not awaiting approval", () => {
  //     questionnaire.publishStatus = UNPUBLISHED;
  //     const { queryByTestId } = renderWithContext(<Header {...props} />);

  //     expect(queryByTestId("btn-publish")).toBeTruthy();
  //     expect(queryByTestId("btn-review")).toBeFalsy();
  //   });

  //   it("should route to review page when clicked", () => {
  //     questionnaire.publishStatus = AWAITING_APPROVAL;
  //     const { getByTestId, history } = renderWithContext(<Header {...props} />);
  //     const reviewButton = getByTestId("btn-review");

  //     fireEvent.click(reviewButton);
  //     expect(history.location.pathname).toMatch("/review");
  //   });

  //   it("should not show review button for non admins", () => {
  //     questionnaire.publishStatus = AWAITING_APPROVAL;
  //     user.admin = false;
  //     const { queryByTestId } = renderWithContext(<Header {...props} />);
  //     const reviewButton = queryByTestId("btn-review");
  //     expect(reviewButton).toBeFalsy();
  //   });
  // });

  //   describe("updating a questionnaire", () => {
  //     it("can open the questionnaire settings modal", () => {
  //       const { getByText, queryByText } = renderWithContext(
  //         <Header {...props} />
  //       );

  //       expect(queryByText("Questionnaire settings")).toBeFalsy();
  //       fireEvent.click(getByText("Settings"));

  //       expect(getByText("Questionnaire settings")).toBeTruthy();
  //     });

  //     it("can close the questionnaire settings modal", async () => {
  //       const { getByText, queryByText } = renderWithContext(
  //         <Header {...props} />
  //       );

  //       fireEvent.click(getByText("Settings"));
  //       expect(getByText("Questionnaire settings")).toBeTruthy();

  //       fireEvent.click(getByText("Cancel"));
  //       await waitForElementToBeRemoved(() =>
  //         queryByText("Questionnaire settings")
  //       );

  //       expect(queryByText("Questionnaire settings")).toBeFalsy();
  //     });

  //     it("should start with the questionnaire settings open when the modifier is provided in the url", () => {
  //       const { getByText } = renderWithContext(<Header {...props} />, {
  //         route: `/q/${questionnaire.id}/settings`,
  //       });

  //       expect(getByText("Questionnaire settings")).toBeTruthy();
  //     });
  //   });

  //   it("should be possible to open and close the sharing modal", () => {
  //     const { getByText, queryByText } = renderWithContext(<Header {...props} />);
  //     expect(queryByText("Pinky Malinky")).toBeFalsy();

  //     fireEvent.click(getByText("Sharing"));
  //     expect(getByText("Pinky Malinky")).toBeTruthy();

  //     fireEvent.click(getByText("Done"));
  //     expect(queryByText("Pinky Malinky")).toBeFalsy();
  //   });
});
