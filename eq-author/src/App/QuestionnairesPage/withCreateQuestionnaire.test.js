import {
  redirectToDesigner,
  mapMutateToProps,
  updateQuestionnaireList,
} from "App/QuestionnairesPage/withCreateQuestionnaire";
import { buildPagePath, buildIntroductionPath } from "utils/UrlUtils";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";

describe("withCreateQuestionnaire", () => {
  let history, mutate, results, user, page, folder, section, questionnaire;

  beforeEach(() => {
    page = { id: "3" };
    folder = { id: "f", pages: [page] };
    section = { id: "2", folders: [folder] };
    questionnaire = { id: "1", sections: [section] };

    results = {
      data: { createQuestionnaire: questionnaire },
    };

    history = {
      push: jest.fn(),
    };

    user = {
      displayName: "Dave McDave",
    };

    mutate = jest.fn(() => Promise.resolve(results));
  });

  describe("redirectToDesigner", () => {
    it("should redirect to the introduction if it has one", () => {
      results.data.createQuestionnaire.introduction = {
        id: "4",
      };
      redirectToDesigner(history)(results);

      expect(history.push).toHaveBeenCalledWith(
        buildIntroductionPath({
          questionnaireId: questionnaire.id,
          introductionId: "4",
        })
      );
    });

    it("should redirect to correct location", () => {
      redirectToDesigner(history)(results);

      expect(history.push).toHaveBeenCalledWith(
        buildPagePath({
          questionnaireId: questionnaire.id,
          pageId: page.id,
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
      return props.onCreateQuestionnaire(questionnaire).then(() => {
        expect(mutate).toHaveBeenCalledWith({
          variables: { input: questionnaire },
        });
        expect(history.push).toHaveBeenCalled();
      });
    });
  });

  describe("updateQuestionnaireList", () => {
    let proxy, readQuery, writeQuery, data, questionnaire1Id, questionnaire2Id;

    beforeEach(() => {
      questionnaire1Id = "1";
      questionnaire2Id = "2";
      data = {
        questionnaires: [{ id: questionnaire2Id }, { id: questionnaire1Id }],
      };

      readQuery = jest.fn(() => data);
      writeQuery = jest.fn();

      proxy = {
        readQuery,
        writeQuery,
      };
    });

    it("should update the getQuestionnaireList query with new questionnaire.", () => {
      const newQuestionnaire = { id: "3" };

      updateQuestionnaireList(proxy, {
        data: { createQuestionnaire: newQuestionnaire },
      });

      expect(readQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList,
      });
      expect(writeQuery).toHaveBeenCalledWith({
        query: getQuestionnaireList,
        data: {
          questionnaires: [
            newQuestionnaire,
            { id: questionnaire2Id },
            { id: questionnaire1Id },
          ],
        },
      });
    });
  });
});
