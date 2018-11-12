import { mapMutateToProps, createUpdater } from "./withDeleteRoutingRuleSet";

import gql from "graphql-tag";

const fragment = gql`
  fragment PageWithRouting on Page {
    routingRuleSet {
      id
    }
  }
`;

describe("components/QuestionnaireRoutingPage/withDeleteRoutingRuleSet", () => {
  let mutate,
    ownProps,
    result,
    deleteRoutingRuleSet,
    questionPage,
    routingRuleSet;

  beforeEach(() => {
    deleteRoutingRuleSet = {
      id: "2"
    };

    routingRuleSet = {
      id: "2",
      routingRules: []
    };

    questionPage = {
      id: "1",
      routingRuleSet
    };

    result = {
      data: {
        deleteRoutingRuleSet
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
    ownProps = { pageId: "2" };
  });

  describe("createUpdater", () => {
    it("should remove the routing rule from the cache", () => {
      const id = `QuestionPage${questionPage.id}`;
      const readFragment = jest.fn(() => questionPage);
      const writeFragment = jest.fn();

      const updater = createUpdater(routingRuleSet.id, questionPage.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({
        id,
        fragment
      });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: questionPage
      });
      expect(questionPage.routingRuleSet).toBeNull();
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate, ownProps });
    });

    it("should have a onDeleteRoutingRule prop", () => {
      expect(props.onDeleteRoutingRuleSet).toBeInstanceOf(Function);
    });

    describe("onDeleteRoutingRule", () => {
      it("should call mutate", () => {
        return props
          .onDeleteRoutingRuleSet(routingRuleSet.id, questionPage.id)
          .then(() => {
            expect(mutate).toHaveBeenCalledWith(
              expect.objectContaining({
                variables: {
                  input: { id: routingRuleSet.id }
                }
              })
            );
          });
      });

      it("should return promise that resolves to deleteRoutingRule result", () => {
        return expect(
          props.onDeleteRoutingRuleSet(routingRuleSet.id, routingRuleSet.id)
        ).resolves.toBe(deleteRoutingRuleSet);
      });
    });
  });
});
