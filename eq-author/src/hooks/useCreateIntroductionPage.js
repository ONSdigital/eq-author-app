import { useMutation } from "@apollo/react-hooks";
import { useRedirectToPage } from "hooks/useRedirects";

import CREATE_INTRODUCTION_PAGE_MUTATION from "graphql/createIntroductionPage.graphql";

export const useCreateIntroductionPage = () => {
  const [onAddIntroductionPage] = useMutation(
    CREATE_INTRODUCTION_PAGE_MUTATION
  );
  const redirectToPage = useRedirectToPage();

  return (input) =>
    onAddIntroductionPage({
      variables: { input },
    }).then(({ data: { createIntroductionPage } }) =>
      redirectToPage({ pageId: createIntroductionPage.id })
    );
};
