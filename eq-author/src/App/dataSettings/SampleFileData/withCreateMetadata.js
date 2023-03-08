import { graphql } from "react-apollo";
import gql from "graphql-tag";

import metadataFragment from "graphql/fragments/metadata.graphql";

const createMetadataMutation = gql`
  mutation CreateMetadata($input: CreateMetadataInput!) {
    createMetadata(input: $input) {
      ...Metadata
      displayName
    }
  }

  ${metadataFragment}
`;

export const fragment = gql`
  fragment QuestionnaireWithMetadata on Questionnaire {
    id
    metadata {
      ...Metadata
    }
  }

  ${metadataFragment}
`;

export const fragmentName = "QuestionnaireWithMetadata";

export const createUpdater = (questionnaireId) => (proxy, result) => {
  const id = `Questionnaire${questionnaireId}`;
  const questionnaire = proxy.readFragment({ id, fragment, fragmentName });

  questionnaire.metadata.push(result.data.createMetadata);

  proxy.writeFragment({
    id,
    fragment,
    fragmentName,
    data: questionnaire,
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onAddMetadata(questionnaireId) {
    const metadata = {
      questionnaireId,
    };

    const update = createUpdater(questionnaireId);

    return mutate({
      variables: { input: metadata },
      update,
      refetchQueries: ["GetQuestionnaireWithMetadata"],
    });
  },
});

export default graphql(createMetadataMutation, {
  props: mapMutateToProps,
});
