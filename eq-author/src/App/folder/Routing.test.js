import React from "react";
import RoutingPage, { NO_ROUTING_TITLE } from "./Routing";
import { buildFolders } from "tests/utils/createMockQuestionnaire";
import { render, screen } from "tests/utils/rtl";

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
  it("should show placeholder page stating routing is disabled", () => {
    const [mockFolder] = buildFolders();
    useQuery.mockImplementation(() => ({
      data: { folder: mockFolder },
    }));

    render(
      <RoutingPage
        match={{ params: { questionnaireId: "woo", folderId: mockFolder.id } }}
      />
    );

    expect(screen.queryByText(NO_ROUTING_TITLE)).toBeTruthy();
  });
});
