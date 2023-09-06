import { useMutation } from "@apollo/react-hooks";
import { useRedirectToPage } from "hooks/useRedirects";

import CREATE_QUESTION_PAGE_MUTATION from "graphql/createQuestionPage.graphql";
import CREATE_CALCULATED_SUMMARY_PAGE from "graphql/createCalculatedSummaryPage.graphql";

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

export const useCreateCalculatedSummaryPage = () => {
  const [onAddCalculatedSummaryPage] = useMutation(
    CREATE_CALCULATED_SUMMARY_PAGE
  );
  const redirectToPage = useRedirectToPage();

  return (input) =>
    onAddCalculatedSummaryPage({
      variables: { input },
    }).then(({ data: { createCalculatedSummaryPage } }) =>
      redirectToPage({ pageId: createCalculatedSummaryPage.id })
    );
};
