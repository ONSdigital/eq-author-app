import { useMutation } from "@apollo/react-hooks";
import { useRedirectToPage } from "hooks/useRedirects";

import CREATE_QUESTION_PAGE_MUTATION from "graphql/createQuestionPage.graphql";

export const useCreateQuestionPage = () => {
  const [onAddQuestionPage] = useMutation(CREATE_QUESTION_PAGE_MUTATION);
  const redirectToPage = useRedirectToPage();

  return (input) =>
    onAddQuestionPage({
      variables: { input },
    }).then(({ data: { createQuestionPage } }) =>
      redirectToPage({ pageId: createQuestionPage.id })
    );
};
