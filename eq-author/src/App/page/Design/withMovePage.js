import { graphql } from "react-apollo";
import { remove } from "lodash";
import fragment from "graphql/fragments/movePage.graphql";
import getSection from "graphql/getSection.graphql";
import movePageMutation from "graphql/movePage.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onMovePage({ from, to }) {
    const options = { variables: { input: to } };

    options.refetchQueries = [
      {
        query: getSection,
        variables: {
          input: {
            sectionId: to.sectionId,
          },
        },
      },
    ];

    if (from.sectionId !== to.sectionId) {
      options.refetchQueries.push({
        query: getSection,
        variables: {
          input: {
            sectionId: from.sectionId,
          },
        },
      });

      options.update = (proxy, { data = {} }) => {
        if (data && data.movePage) {
          const fromSectionId = `Section${from.sectionId}`;
          const fromSection = proxy.readFragment({
            id: fromSectionId,
            fragment,
          });

          // Delete question from old folder to prevent brief period with duplication in nav bar
          fromSection.folders.forEach(({ pages }) => {
            remove(pages, { id: data.movePage.id });
          });

          proxy.writeData({
            id: `Section${from.sectionId}`,
            data: fromSection,
          });
        }
      };
    }

    return mutate(options);
  },
});

export default graphql(movePageMutation, {
  props: mapMutateToProps,
});
