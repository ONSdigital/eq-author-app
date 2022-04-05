import React from "react";
import RoutingPage, { NO_ROUTING_TITLE } from "./Routing";
import { buildFolders } from "tests/utils/createMockQuestionnaire";
import { render, screen } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";

import { useQuery } from "@apollo/react-hooks";

jest.mock("@apollo/react-hooks", () => ({
  useQuery: jest.fn(),
  useSubscription: jest.fn(),
}));

jest.mock("components/EditorLayout/Tabs", () => ({
  __esModule: true,
  default: () => null,
}));

describe("Folder: routing page", () => {
  const user = {
    id: "1",
    name: "Name",
  };

  it("should show placeholder page stating routing is disabled", () => {
    const [mockFolder] = buildFolders();
    useQuery.mockImplementation(() => ({
      data: { folder: mockFolder },
    }));

    render(
      <MeContext.Provider value={{ me: user }}>
        <RoutingPage
          match={{
            params: { questionnaireId: "woo", folderId: mockFolder.id },
          }}
        />
      </MeContext.Provider>
    );

    expect(screen.queryByText(NO_ROUTING_TITLE)).toBeTruthy();
  });
});
