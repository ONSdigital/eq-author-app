import { graphql } from "react-apollo";
import createFolderMutation from "graphql/createFolder.graphql";
import { get, tap } from "lodash/fp";
import { buildFolderPath } from "utils/UrlUtils";

export const redirectToNewFolder = ownProps => folder => {
  const {
    history,
    match: { params },
  } = ownProps;

  history.push(
    buildFolderPath({
      questionnaireId: params.questionnaireId,
      folderId: folder.id,
    })
  );
};

export const mapMutateToProps = ({ mutate, ownProps }) => ({
  onAddFolder(sectionId, position) {
    const input = {
      sectionId,
      alias: "",
      position,
      enabled: true,
    };

    mutate({
      variables: {
        input,
      },
    })
      .then(get("data.createFolder"))
      .then(tap(redirectToNewFolder(ownProps)));
  },
});

export default graphql(createFolderMutation, {
  props: mapMutateToProps,
});
