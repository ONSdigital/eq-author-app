import React from "react";
import { render, flushPromises } from "tests/utils/rtl";
import { UnwrappedMainNavigation, publishStatusSubscription } from "./";
import { MeContext } from "App/MeContext";
import { act } from "react-dom/test-utils";
import { QCodeContext } from "components/QCodeContext";


describe("MainNavigation", () => {
  let props, user, mocks, questionnaire, flattenedAnswers, duplicateQCode;
  
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
    questionnaire = {
      id: "1",
      title: "Questionnaire",
      sections: [section],
      editors: [],
      createdBy: { ...user },
      totalErrorCount: 0,
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
          return {
            data: {
              publishStatusUpdated: {
                id: "1",
                publishStatus: "unpublished",
                __typename: "query",
              },
            },
          };
        },
      },
    ];
    flattenedAnswers = [ 
      { title: '<p>Questions 1</p>',
        alias: undefined,
        id: 'ans-p1-1',
        description: '',
        guidance: '',
        label: 'num1',
        qCode: '123',
        secondaryQCode: '1',
        type: 'Number',
        questionPageId: 'qp-1',
        secondaryLabel: null 
      },
      { title: '<p>Questions 1</p>',
        alias: undefined,
        nested: true,
        id: 'ans-p1-2',
        description: '',
        guidance: '',
        label: 'curr1',
        qCode: '123',
        secondaryQCode: '2',
        type: 'Currency',
        questionPageId: 'qp-1',
        secondaryLabel: null 
      },
      { title: '<p>Questions 1</p>',
        alias: undefined,
        nested: true,
        id: 'ans-p1-3',
        description: '',
        guidance: '',
        label: 'Un1',
        qCode: '1',
        secondaryQCode: '3',
        type: 'Unit',
        questionPageId: 'qp-1',
        secondaryLabel: null 
      },
      { title: '<p>Questions 1</p>',
        alias: undefined,
        nested: true,
        id: 'ans-p1-4',
        description: '',
        guidance: '',
        label: 'Per1',
        qCode: 'www',
        secondaryQCode: '4',
        type: 'Percentage',
        questionPageId: 'qp-1',
        secondaryLabel: null 
      },
      { title: '<p>Questions 1</p>',
        alias: undefined,
        nested: true,
        id: 'ans-p1-5',
        description: '',
        guidance: '',
        label: 'Dur1',
        qCode: 'qCode3',
        secondaryQCode: '5',
        type: 'Duration',
        questionPageId: 'qp-1',
        secondaryLabel: null 
      },
    ];
    duplicateQCode = false;
    // duplicates = {qCode3: 2};
  });

  it("should enable all buttons if there are no errors on questionnaire", () => {
    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user }}>
         <QCodeContext.Provider value={{flattenedAnswers, duplicateQCode}}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    const nav = getByTestId("main-navigation");

    expect(nav).toBeTruthy();

    const viewSurveyBtn = getByTestId("btn-preview");
    const settingsBtn = getByTestId("btn-settings");
    const sharingBtn = getByTestId("btn-sharing");
    const historyBtn = getByTestId("btn-history");
    const metadataBtn = getByTestId("btn-metadata");
    const qcodesBtn = getByTestId("btn-qcodes");
    // const publishBtn = getByTestId("btn-publish");

    expect(viewSurveyBtn).not.toBeDisabled();
    expect(settingsBtn).not.toBeDisabled();
    expect(sharingBtn).not.toBeDisabled();
    expect(historyBtn).not.toBeDisabled();
    expect(metadataBtn).not.toBeDisabled();
    expect(qcodesBtn).not.toBeDisabled();
  });

  it("should disable qcodes, publish and preview buttons if there are errors on questionnaire", async () => {
    props.questionnaire.totalErrorCount = 1;

    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user }}>
        <QCodeContext.Provider value={{flattenedAnswers, duplicateQCode}}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    await act(async () => {
      flushPromises();
    });

    const nav = getByTestId("main-navigation");

    expect(nav).toBeTruthy();

    const viewSurveyBtn = getByTestId("btn-preview");
    const settingsBtn = getByTestId("btn-settings");
    const sharingBtn = getByTestId("btn-sharing");
    const historyBtn = getByTestId("btn-history");
    const metadataBtn = getByTestId("btn-metadata");
    const qcodesBtn = getByTestId("btn-qcodes");

    expect(viewSurveyBtn.hasAttribute("disabled")).toBeTruthy();
    expect(settingsBtn.hasAttribute("disabled")).toBeFalsy();
    expect(sharingBtn.hasAttribute("disabled")).toBeFalsy();
    expect(historyBtn.hasAttribute("disabled")).toBeFalsy();
    expect(metadataBtn.hasAttribute("disabled")).toBeFalsy();
    expect(qcodesBtn.hasAttribute("disabled")).toBeTruthy();
  });

  it("should provide the validation error dot for the QCodes tab if there is an empty qCode", async () => {
    flattenedAnswers[0].qCode = "";
    
    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user }}>
        <QCodeContext.Provider value={{flattenedAnswers, duplicateQCode}}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    await act(async () => {
      flushPromises();
    });

    expect(getByTestId("small-badge")).toBeTruthy();
  });

  it("should provide the validation error dot for the QCodes tab if there are duplicate qCodes", async () => {
    duplicateQCode = true;

    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user }}>
        <QCodeContext.Provider value={{flattenedAnswers, duplicateQCode}}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    await act(async () => {
      flushPromises();
    });

    expect(getByTestId("small-badge")).toBeTruthy();
  });
});
