import { useMutation } from "@apollo/react-hooks";
import { useParams, useHistory } from "react-router-dom";
import { buildPagePath } from "utils/UrlUtils";

import CREATE_QUESTION_PAGE_MUTATION from "graphql/createQuestionPage.graphql";

export const redirectToNewPage = ({ id, section }, params, history) =>
  history.push(
    buildPagePath({
      questionnaireId: params.questionnaireId,
      sectionId: section.id,
      pageId: id,
    })
  );

export const useCreateQuestionPage = () => {
  const params = useParams();
  const history = useHistory();
  const [onAddQuestionPage] = useMutation(CREATE_QUESTION_PAGE_MUTATION, {
    onCompleted: ({ createQuestionPage }) =>
      redirectToNewPage(createQuestionPage, params, history),
  });

  const handleAddQuestionPage = (input) =>
    onAddQuestionPage({ variables: { input } });

  return [handleAddQuestionPage];
};
