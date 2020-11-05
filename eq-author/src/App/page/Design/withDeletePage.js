import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { flowRight } from "lodash";

import { withShowToast } from "components/Toasts";
import deletePageMutation from "graphql/deletePage.graphql";
import fragment from "graphql/sectionFragment.graphql";
import getNextPage from "utils/getNextOnDelete";
import { buildPagePath } from "utils/UrlUtils";

const query = gql`
  query UpdatePages($input: QueryInput!) {
    questionnaire(input: $input) {
      id
      sections {
        id
        title
        displayName
        questionnaire {
          id
        }
        validationErrorInfo {
          id
          totalCount
        }
        folders {
          id
          pages {
            id
            title
            position
            displayName
            pageType
            validationErrorInfo {
              id
              errors {
                id
                type
                field
                errorCode
              }
              totalCount
            }
            ... on QuestionPage {
              confirmation {
                id
                displayName
                validationErrorInfo {
                  id
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;

const getCachedSection = (client, id) =>
  client.readFragment({
    id: `Section${id}`,
    fragment,
  });

const handleDeletion = (
  {
    history,
    match: {
      params: { questionnaireId },
    },
  },
  section,
  nextPage
) =>
  history.push(
    buildPagePath({
      questionnaireId,
      pageId: section.pages.length === 1 ? section.pages[0].id : nextPage.id,
    })
  );

export const mapMutateToProps = props => ({
  onDeletePage(page) {
    const { ownProps, mutate } = props;
    const { client } = ownProps;
    const cachedSection = getCachedSection(client, page.section.id);
    const nextPage = getNextPage(cachedSection.pages, page.id);
    const mutation = mutate({
      variables: { input: { id: page.id } },
      refetchQueries: [
        {
          query,
          variables: { input: { sectionId: page.section.id } },
        },
      ],
    });

    return mutation
      .then(({ data: { deletePage: section } }) =>
        handleDeletion(ownProps, section, nextPage)
      )
      .then(() => ownProps.showToast("Page deleted"));
  },
});

export default flowRight(
  withShowToast,
  graphql(deletePageMutation, {
    props: mapMutateToProps,
  })
);
