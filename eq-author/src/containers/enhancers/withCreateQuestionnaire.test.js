import {
  redirectToDesigner,
  mapMutateToProps,
  updateQuestionnaireList
} from "./withCreateQuestionnaire";
import { buildPagePath } from "utils/UrlUtils";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";

describe("withCreateQuestionnaire", () => {
  let history, mutate, results, user;

  const page = { id: "3" };
  const section = { id: "2", pages: [page] };
  const questionnaire = { id: "1", sections: [section] };

  beforeEach(() => {
    results = {
      data: { createQuestionnaire: questionnaire }
    };

    history = {
      push: jest.fn()
    };

    user = {
      displayName: "Dave McDave"
    };

    mutate = jest.fn(() => Promise.resolve(results));
  });

  describe("redirectToDesigner", () => {
    it("should redirect to correct location", () => {
      redirectToDesigner(history)(results);

      expect(history.push).toHaveBeenCalledWith(
        buildPagePath({
          questionnaireId: questionnaire.id,
          sectionId: section.id,
          pageId: page.id
        })
      );
    });
  });

  describe("mapMutateToProps", () => {
    let ownProps, props;

    beforeEach(() => {
      ownProps = { history, user };
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should have a onCreateQuestionnaire prop", () => {
      expect(props.onCreateQuestionnaire).toBeInstanceOf(Function);
    });

    it("should redirect after mutation", () => {
      const input = {
        ...questionnaire,
        createdBy: user.displayName
      };

      return props.onCreateQuestionnaire(questionnaire).then(() => {
        expect(mutate).toHaveBeenCalledWith({
          variables: { input }
        });
        expect(history.push).toHaveBeenCalled();
      });
    });
  });

  describe("updateQuestionnaireList", () => {
    let proxy, readQuery, writeQuery, data;

    beforeEach(() => {
      data = {
        questionnaires: [{ id: "2" }, { id: "1" }]
      };

      readQuery = jest.fn(() => data);
      writeQuery = jest.fn();

      proxy = {
        readQuery,
        writeQuery
      };
    });

    it("should update the getQuestionnaireList query with new questionnaire.", () => {
      const newQuestionnaire = { id: "3" };

      updateQuestionnaireList(proxy, {
        data: { createQuestionnaire: newQuestionnaire }
      });

      expect(readQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList
      });
      expect(writeQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList,
        data: {
          questionnaires: [newQuestionnaire, { id: "2" }, { id: "1" }]
        }
      });
    });
  });
});
