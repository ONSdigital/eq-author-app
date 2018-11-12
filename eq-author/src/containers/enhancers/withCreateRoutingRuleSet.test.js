import { mapMutateToProps, createUpdater } from "./withCreateRoutingRuleSet";
import gql from "graphql-tag";

const fragment = gql`
  fragment PageWithRouting on Page {
    routingRuleSet {
      id
    }
  }
`;

describe("containers/enhancers/withCreateRoutingRuleSet", () => {
  const questionPage = {
    id: "1",
    routingRuleSet: null
  };

  let mutate, ownProps, result, createRoutingRuleSet;

  beforeEach(() => {
    ownProps = {
      match: {
        params: {
          pageId: questionPage.id
        }
      }
    };

    createRoutingRuleSet = {
      id: "1",
      questionPage: {
        id: "1"
      },
      routingDestination: null
    };

    result = {
      data: {
        createRoutingRuleSet
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    let id;
    let writeFragment;
    let readFragment;
    let updater;

    beforeEach(() => {
      id = `QuestionPage${questionPage.id}`;
      writeFragment = jest.fn();
      readFragment = jest.fn(() => questionPage);
      updater = createUpdater(questionPage.id);
    });

    it("should update the apollo cache", () => {
      updater({ readFragment, writeFragment }, result);
      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: questionPage
      });

      expect(questionPage.routingRuleSet).toMatchObject(createRoutingRuleSet);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate, ownProps });
    });

    it("should have a onAddRoutingRuleSet prop", () => {
      expect(props.onAddRoutingRuleSet).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      return props.onAddRoutingRuleSet(questionPage).then(() => {
        expect(mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: {
              input: { questionPageId: questionPage.id }
            }
          })
        );
      });
    });
  });
});
