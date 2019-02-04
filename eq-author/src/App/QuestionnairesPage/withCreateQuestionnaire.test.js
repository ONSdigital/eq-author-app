import {
  redirectToDesigner,
  mapMutateToProps,
  updateQuestionnaireList,
} from "App/QuestionnairesPage/withCreateQuestionnaire";
import { buildPagePath } from "utils/UrlUtils";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import fakeId from "tests/utils/fakeId";

describe("withCreateQuestionnaire", () => {
  let history, mutate, results, user;

  const page = { id: fakeId("3") };
  const section = { id: fakeId("2"), pages: [page] };
  const questionnaire = { id: fakeId("1"), sections: [section] };

  beforeEach(() => {
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
    it("should redirect to correct location", () => {
      redirectToDesigner(history)(results);

      expect(history.push).toHaveBeenCalledWith(
        buildPagePath({
          questionnaireId: questionnaire.id,
          sectionId: section.id,
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
      questionnaire1Id = fakeId("1");
      questionnaire2Id = fakeId("2");
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
      const newQuestionnaire = { id: fakeId("3") };

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
