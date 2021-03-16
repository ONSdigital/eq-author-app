import {
  useCreateQuestionPage,
  useCreateCalculatedSummaryPage,
} from "hooks/useCreateQuestionPage";

import { useRedirectToPage } from "hooks/useRedirects";

jest.mock("hooks/useRedirects", () => ({
  useRedirectToPage: jest.fn(jest.fn()),
}));

jest.mock("@apollo/react-hooks", () => ({
  useMutation: () => [
    jest.fn(
      () =>
        new Promise((resolve) =>
          resolve({
            data: {
              createQuestionPage: { id: "new-qp" },
              createCalculatedSummaryPage: { id: "new-csp" },
            },
          })
        )
    ),
  ],
}));

describe("hooks: useCreateQuestionPage", () => {
  it("should redirect to new page after mutation", async () => {
    const redirect = jest.fn();
    useRedirectToPage.mockImplementation(() => redirect);

    const addQuestionPage = useCreateQuestionPage();
    await addQuestionPage({});
    expect(redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pageId: "new-qp" })
    );
  });
});

describe("hooks: useCreateCalculatedSummaryPage", () => {
  it("should redirect to new page after mutation", async () => {
    const redirect = jest.fn();
    useRedirectToPage.mockImplementation(() => redirect);

    const addCalculatedSummaryPage = useCreateCalculatedSummaryPage();
    await addCalculatedSummaryPage({});
    expect(redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pageId: "new-csp" })
    );
  });
});
