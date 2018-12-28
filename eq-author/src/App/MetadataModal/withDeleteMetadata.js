import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { remove } from "lodash";

const deleteMetadataMutation = gql`
  mutation DeleteMetadata($input: DeleteMetadataInput!) {
    deleteMetadata(input: $input) {
      id
    }
  }
`;

export const fragment = gql`
  fragment MetadataQuestionnaire on Questionnaire {
    metadata {
      id
    }
  }
`;

export const deleteUpdater = (questionnaireId, metadataId) => proxy => {
  const id = `Questionnaire${questionnaireId}`;
  const questionnaire = proxy.readFragment({ id, fragment });

  remove(questionnaire.metadata, { id: metadataId });

  proxy.writeFragment({
    id,
    fragment,
    data: questionnaire
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onDeleteMetadata(questionnaireId, metadataId) {
    const metadata = { id: metadataId };
    const update = deleteUpdater(questionnaireId, metadataId);

    const mutation = mutate({
      variables: { input: metadata },
      update
    });

    return mutation.then(() => mutation);
  }
});

export default graphql(deleteMetadataMutation, {
  props: mapMutateToProps
});
