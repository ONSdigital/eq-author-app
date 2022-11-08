import React from "react";
import { render, flushPromises, fireEvent, act } from "tests/utils/rtl";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";

import HistoryPageContent from "./HistoryPage";

import questionnaireHistoryQuery from "./questionnaireHistory.graphql";
import createNoteMutation from "./createHistoryNoteMutation.graphql";
import updateNoteMutation from "./updateHistoryNoteMutation.graphql";
import deleteNoteMutation from "./deleteHistoryNoteMutation.graphql";
import { publishStatusSubscription } from "components/EditorLayout/Header";

import { UNPUBLISHED } from "constants/publishStatus";

//eslint-disable-next-line react/prop-types
jest.mock("components/RichTextEditor", () => ({ onUpdate }) => {
  const handleInputChange = (event) =>
    onUpdate({
      value: event.target.value,
    });
  return <input data-test="rtl-textbox" onChange={handleInputChange} />;
});

describe("History page", () => {
  let props, questionnaireId, user, queryWasCalled, mutationWasCalled, mocks;

  beforeEach(() => {
    questionnaireId = "1";
    queryWasCalled = false;
    mutationWasCalled = false;

    props = {
      match: {
        params: {
          questionnaireId,
        },
      },
      data: {
        questionnaire: {
          id: questionnaireId,
        },
      },
    };

    user = {
      id: "123",
      displayName: "Rick Sanchez",
      email: "wubbalubba@dubdub.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };

    mocks = [
      {
        request: {
          query: questionnaireHistoryQuery,
          variables: { input: { questionnaireId } },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              history: [
                {
                  id: "161deb98-fdbe-4906-aea5-39d3de2d78a2",
                  publishStatus: "Questionnaire created",
                  questionnaireTitle: "Test 2",
                  bodyText: null,
                  type: "system",
                  user: {
                    id: "123",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:48:28.584Z",
                  __typename: "History",
                },
                {
                  id: "item-id-123",
                  publishStatus: UNPUBLISHED,
                  questionnaireTitle: "Test 2",
                  bodyText: "Hello Moto",
                  type: "note",
                  user: {
                    id: "123",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:49:16.636Z",
                  __typename: "History",
                },
              ],
            },
          };
        },
      },
      {
        request: {
          query: createNoteMutation,
          variables: {
            input: {
              id: props.match.params.questionnaireId,
              bodyText: "New note",
            },
          },
        },
        result: () => {
          mutationWasCalled = true;
          return {
            data: {
              createHistoryNote: [
                {
                  id: "161deb98-fdbe-4906-aea5-39d3de2d78a2",
                  publishStatus: "Questionnaire created",
                  questionnaireTitle: "Test 2",
                  bodyText: null,
                  type: "system",
                  user: {
                    id: "123",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:48:28.584Z",
                  __typename: "History",
                },
                {
                  id: "aa94b4ef-e717-40b6-aba5-7c99557d283c",
                  publishStatus: UNPUBLISHED,
                  questionnaireTitle: "Test 2",
                  bodyText: "Hello Moto",
                  type: "note",
                  user: {
                    id: "123",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:49:16.636Z",
                  __typename: "History",
                },
                {
                  id: "48c2c4ca-9935-4ee4-98fd-7f2387fe8fea",
                  publishStatus: UNPUBLISHED,
                  questionnaireTitle: "Test 2",
                  bodyText: "New note",
                  type: "note",
                  user: {
                    id: "123",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:49:21.247Z",
                  __typename: "History",
                },
              ],
            },
          };
        },
      },
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

  afterEach(() =>
    act(async () => {
      await flushPromises();
    })
  );

  const renderWithContext = (component) =>
    render(
      <MeContext.Provider value={{ me: user }}>
        <QuestionnaireContext.Provider value={props.data.questionnaire}>
          {component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}`,
        urlParamMatcher: "/q/:questionnaireId",
        mocks,
      }
    );

  it("renders History page with correct events", async () => {
    const { getByText } = renderWithContext(<HistoryPageContent {...props} />, {
      mocks,
    });
    await act(async () => {
      await flushPromises();
    });

    expect(getByText("History")).toBeTruthy();
    expect(getByText("Questionnaire created")).toBeTruthy();
    expect(getByText("Hello Moto")).toBeTruthy();
  });

  it("should request questionnaire history", async () => {
    queryWasCalled = false;
    renderWithContext(<HistoryPageContent {...props} />, {
      mocks,
    });
    await act(async () => {
      await flushPromises();
    });
    expect(queryWasCalled).toBeTruthy();
  });

  it("should render loading state", () => {
    const { getByTestId } = renderWithContext(
      <HistoryPageContent {...props} />
    );
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error state", async () => {
    mocks[0] = {
      request: {
        query: questionnaireHistoryQuery,
        variables: { input: { questionnaireId } },
      },
      result: () => ({ error: {} }),
    };

    const { getByText } = renderWithContext(<HistoryPageContent {...props} />);
    await act(async () => {
      await flushPromises();
    });
    expect(getByText("Currently no history info...")).toBeTruthy();
  });

  describe("user notes", () => {
    beforeEach(() => {
      user.admin = false;
    });

    describe("creating notes", () => {
      it("can create a note", async () => {
        const { getByText, getByTestId } = renderWithContext(
          <HistoryPageContent {...props} />,
          {
            mocks,
          }
        );

        await act(async () => {
          await flushPromises();
        });

        await act(async () => {
          await fireEvent.change(getByTestId("rtl-textbox"), {
            target: { value: "New note" },
          });
          await fireEvent.click(getByTestId("add-note-btn"));
        });

        expect(getByText("Questionnaire created")).toBeTruthy();
        expect(getByText("Hello Moto")).toBeTruthy();
        expect(getByText("New note")).toBeTruthy();
      });

      it("wont create an empty note", async () => {
        const { getByTestId } = renderWithContext(
          <HistoryPageContent {...props} />,
          {
            mocks,
          }
        );

        await act(async () => {
          await flushPromises();
        });
        await act(async () => {
          await fireEvent.click(getByTestId("add-note-btn"));
        });

        expect(mutationWasCalled).toBeFalsy();
      });
    });

    describe("update notes", () => {
      beforeEach(() => {
        mocks = [
          ...mocks,
          {
            request: {
              query: updateNoteMutation,
              variables: {
                input: {
                  id: "item-id-123",
                  questionnaireId,
                  bodyText: "this is an edited message",
                },
              },
            },
            result: () => {
              mutationWasCalled = true;
              return {
                data: {
                  updateHistoryNote: [
                    {
                      id: "item-id-123",
                      publishStatus: "Questionnaire created",
                      questionnaireTitle: "my wonderful thing",
                      bodyText: "this is an edited message",
                      type: "note",
                      user: {
                        id: "123",
                        name: "Rick Sanchez",
                        displayName: "Rick Sanchez",
                        email: "wubbalubba@dubdub.com",
                        picture: "http://img.com/avatar.jpg",
                        admin: true,
                        __typename: "User",
                      },
                      time: "2019-10-11T09:48:28.584Z",
                      __typename: "History",
                    },
                  ],
                },
              };
            },
          },
        ];
      });
      it("should be able to update your own note", async () => {
        const { getByTestId, getAllByTestId, getByText } = renderWithContext(
          <HistoryPageContent {...props} />,
          { mocks }
        );

        await act(async () => {
          await flushPromises();
        });
        expect(getByText("Hello Moto")).toBeTruthy();

        const editButton = getByTestId("edit-note-btn");
        await act(async () => {
          await fireEvent.click(editButton);
        });

        const textEditor = getAllByTestId("rtl-textbox")[1];
        fireEvent.change(textEditor, {
          target: { value: "this is an edited message" },
        });

        const saveButton = getByTestId("save-note-btn");
        await act(async () => {
          await fireEvent.click(saveButton);
        });

        expect(mutationWasCalled).toBeTruthy();
        expect(getByText("this is an edited message")).toBeTruthy();
      });

      it("should allow admins to update any notes", async () => {
        user.id = "uauthorized-uid-123";
        user.admin = true;
        const { getByTestId, getAllByTestId, getByText } = renderWithContext(
          <HistoryPageContent {...props} />,
          {
            mocks,
          }
        );
        await act(async () => {
          await flushPromises();
        });

        const editButton = getByTestId("edit-note-btn");
        await act(async () => {
          await fireEvent.click(editButton);
        });

        const textEditor = getAllByTestId("rtl-textbox")[1];

        fireEvent.change(textEditor, {
          target: { value: "this is an edited message" },
        });
        const saveButton = getByTestId("save-note-btn");

        await act(async () => {
          await fireEvent.click(saveButton);
        });

        expect(mutationWasCalled).toBeTruthy();
        expect(getByText("this is an edited message")).toBeTruthy();
      });
    });

    describe("deleting notes", () => {
      beforeEach(() => {
        mocks = [
          ...mocks,
          {
            request: {
              query: deleteNoteMutation,
              variables: {
                input: {
                  id: "item-id-123",
                  questionnaireId,
                },
              },
            },
            result: () => {
              mutationWasCalled = true;
              return {
                data: {
                  deleteHistoryNote: [
                    {
                      id: "161deb98-fdbe-4906-aea5-39d3de2d78a2",
                      publishStatus: "Questionnaire created",
                      questionnaireTitle: "Test 2",
                      bodyText: null,
                      type: "system",
                      user: {
                        id: "123",
                        email: "sam@hello.com",
                        name: "sam",
                        displayName: "sam",
                        __typename: "User",
                      },
                      time: "2019-10-11T09:48:28.584Z",
                      __typename: "History",
                    },
                  ],
                },
              };
            },
          },
        ];
      });

      it("should be able to delete your own note", async () => {
        const { getByTestId, queryByText } = renderWithContext(
          <HistoryPageContent {...props} />,
          { mocks }
        );

        await act(async () => {
          await flushPromises();
        });
        expect(queryByText("Hello Moto")).toBeTruthy();

        const deleteButton = getByTestId("delete-note-btn");
        await act(async () => {
          await fireEvent.click(deleteButton);
        });

        expect(getByTestId("modal")).toBeInTheDocument();
        const confirmDeleteButton = getByTestId("btn-modal-positive");

        await act(async () => {
          await fireEvent.click(confirmDeleteButton);
        });

        expect(mutationWasCalled).toBeTruthy();
        expect(queryByText("Hello Moto")).toBeFalsy();
      });

      it("should close modal when close button is clicked", async () => {
        const { getByTestId, queryByTestId } = renderWithContext(
          <HistoryPageContent {...props} />,
          { mocks }
        );

        await act(async () => {
          await flushPromises();
        });

        const deleteButton = getByTestId("delete-note-btn");
        await act(async () => {
          await fireEvent.click(deleteButton);
        });

        expect(getByTestId("modal")).toBeInTheDocument();

        const modalCloseButton = getByTestId("btn-modal-negative");

        await act(async () => {
          await fireEvent.click(modalCloseButton);
        });

        expect(queryByTestId("modal")).not.toBeInTheDocument();
      });

      it("should allow admins to delete any notes", async () => {
        user.id = "uauthorized-uid-123";
        user.admin = true;
        const { getByTestId, queryByText, getByText } = renderWithContext(
          <HistoryPageContent {...props} />,
          {
            mocks,
          }
        );

        await act(async () => {
          await flushPromises();
        });
        expect(getByText("Hello Moto")).toBeTruthy();

        const deleteButton = getByTestId("delete-note-btn");

        await act(async () => {
          await fireEvent.click(deleteButton);
        });

        expect(getByTestId("modal")).toBeInTheDocument();
        const confirmDeleteButton = getByTestId("btn-modal-positive");

        await act(async () => {
          await fireEvent.click(confirmDeleteButton);
        });

        expect(mutationWasCalled).toBeTruthy();
        expect(queryByText("Hello Moto")).toBeFalsy();
      });
    });

    describe("update and delete notes", () => {
      it("should not be able to update or delete another users note", async () => {
        user.id = "uauthorized-uid-123";
        const { queryByTestId } = renderWithContext(
          <HistoryPageContent {...props} />,
          { mocks }
        );

        await act(async () => {
          await flushPromises();
        });
        expect(queryByTestId("edit-note-btn")).toBeFalsy();
        expect(queryByTestId("delete-note-btn")).toBeFalsy();
      });

      it("should not be able to update or delete system events", async () => {
        user.admin = true;
        mocks[0] = {
          request: {
            query: questionnaireHistoryQuery,
            variables: {
              input: { questionnaireId: props.match.params.questionnaireId },
            },
          },
          result: () => {
            queryWasCalled = true;
            return {
              data: {
                history: [
                  {
                    id: "161deb98-fdbe-4906-aea5-39d3de2d78a2",
                    publishStatus: "Questionnaire created",
                    questionnaireTitle: "Test 2",
                    bodyText: null,
                    type: "system",
                    user: {
                      id: "123",
                      email: "sam@hello.com",
                      name: "sam",
                      displayName: "sam",
                      __typename: "User",
                    },
                    time: "2019-10-11T09:48:28.584Z",
                    __typename: "History",
                  },
                ],
              },
            };
          },
        };
        const { queryByTestId } = renderWithContext(
          <HistoryPageContent {...props} />,
          {
            mocks,
          }
        );

        await act(async () => {
          await flushPromises();
        });
        expect(queryByTestId("edit-note-btn")).toBeFalsy();
        expect(queryByTestId("delete-note-btn")).toBeFalsy();
      });
    });
  });

  describe("cancel notes", () => {
    beforeEach(() => {
      mocks = [
        ...mocks,
        {
          request: {
            query: updateNoteMutation,
            variables: {
              input: {
                id: "item-id-123",
                questionnaireId,
                bodyText: "Hello Moto",
              },
            },
          },
          result: () => {
            mutationWasCalled = true;
            return {
              data: {
                updateHistoryNote: [
                  {
                    id: "item-id-123",
                    publishStatus: "Questionnaire created",
                    questionnaireTitle: "The Questionnaire",
                    bodyText: "Hello Moto",
                    type: "note",
                    user: {
                      id: "123",
                      name: "Joe Bloggs",
                      displayName: "Joe Bloggs",
                      email: "joe@bloggs.com",
                      picture: "http://img.com/avatar.jpg",
                      admin: true,
                      __typename: "User",
                    },
                    time: "2020-11-02T09:48:28.584Z",
                    __typename: "History",
                  },
                ],
              },
            };
          },
        },
      ];
    });

    it("should be able to cancel your own note", async () => {
      const { getByTestId, getAllByTestId, getByText } = renderWithContext(
        <HistoryPageContent {...props} />,
        { mocks }
      );

      await act(async () => {
        await flushPromises();
      });
      expect(getByText("Hello Moto")).toBeTruthy();

      const editButton = getByTestId("edit-note-btn");
      await act(async () => {
        await fireEvent.click(editButton);
      });

      const textEditor = getAllByTestId("rtl-textbox")[1];
      fireEvent.change(textEditor, {
        target: { value: "Edited message with new changes" },
      });

      const cancelButton = getByTestId("cancel-note-btn");
      await act(async () => {
        await fireEvent.click(cancelButton);
      });

      expect(getByText("Hello Moto")).toBeTruthy();
    });

    it("should allow admins to cancel editing any notes", async () => {
      user.id = "uauthorized-uid-123";
      user.admin = true;
      const { getByTestId, getAllByTestId, getByText } = renderWithContext(
        <HistoryPageContent {...props} />,
        {
          mocks,
        }
      );
      await act(async () => {
        await flushPromises();
      });

      const editButton = getByTestId("edit-note-btn");
      await act(async () => {
        await fireEvent.click(editButton);
      });

      const textEditor = getAllByTestId("rtl-textbox")[1];

      fireEvent.change(textEditor, {
        target: { value: "Hello Moto" },
      });

      const cancelButton = getByTestId("cancel-note-btn");
      await act(async () => {
        await fireEvent.click(cancelButton);
      });

      expect(getByText("Hello Moto")).toBeTruthy();
    });
  });
});
