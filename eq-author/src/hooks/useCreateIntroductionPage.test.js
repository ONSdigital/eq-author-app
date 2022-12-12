import { useCreateIntroductionPage } from "hooks/useCreateIntroductionPage";

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
              createIntroductionPage: {
                id: "questionnaire-id",
                introduction: { id: "introduction-id" },
              },
            },
          })
        )
    ),
  ],
}));

describe("hooks: useCreateIntroductionPage", () => {
  it("should redirect to new page after mutation", async () => {
    const redirect = jest.fn();
    useRedirectToPage.mockImplementation(() => redirect);

    const addIntroductionPage = useCreateIntroductionPage();
    await addIntroductionPage({});
    expect(redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pageId: "questionnaire-id" })
    );
  });
});
