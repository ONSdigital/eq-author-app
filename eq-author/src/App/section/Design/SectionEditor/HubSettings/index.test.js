import React from "react";
import { render as rtlRender, screen, act, flushPromises, fireEvent } from "tests/utils/rtl";

import HubSettings from "../HubSettings";
import updateSectionMutation from "graphql/updateSection.graphql";

describe("Section HubSettings", () => {
  let props, id, requiredCompleted, showOnHub, queryWasCalled, mocks;

  beforeEach(() => {
      props = {
        id: "testID1",
        requiredCompleted: false,
        showOnHub: false,
        // queryWasCalled: false,
      }
    
    mocks = [
        {
          request: {
            query: updateSectionMutation,
            variables: { id: id,  showOnHub: true },
          },
          result: () => {
            queryWasCalled = true;
            return {
                data: {
                    updateSection: {
                    id: id,
                    showOnHub: true,
                    __typename: "Section",
                    },
                },
            };
          },
        },
    ]
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

describe("Pre-hub section toggle", () => {
    it("should render Pre-hub toggle ", async () => {
      const { getByText } = rtlRender(() => <HubSettings {...props} />);
    
        expect(getByText("Pre-hub section")).toBeInTheDocument();
      });
  });

  describe("Display section in hub", () => {
    it("should render Display section toggle ", async () => {
      const { getByText } = rtlRender(() => <HubSettings {...props} />);
    
      expect(getByText("Display section in hub")).toBeInTheDocument();
    });

    it("should render Display section toggle as disabled IF Pre-Hub toggle is OFF ", async () => {
      const { getByTestId } = rtlRender(() => <HubSettings {...props} />);
      
      expect(getByTestId("toggle-wrapper")).toHaveAttribute("disabled");
    });
  });

});
