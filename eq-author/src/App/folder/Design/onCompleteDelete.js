import { buildFolderPath, buildSectionPath } from "utils/UrlUtils";
import getNextSection from "utils/getNextOnDelete";

const onCompleteDelete = (
  response,
  ownProps,
  history,
  folderId,
  questionnaireId
) => {
  console.log("history", history);
  console.log("data2", response);
  console.log("ownProps", ownProps);

  const questionnaire = response.deleteFolder;
  console.log("questionnaire.sections", questionnaire.sections);

  // const nextFolder = getNextFolder(Questionnaire.sections, sectionId);
  const nextSection = getNextSection(
    questionnaire.sections[0].folders,
    folderId
  );
  console.log("nextSection", nextSection);

  // const newSectionCreated = oldQuestionnaire.sections.length === 1;

  history.push(
    buildSectionPath({
      questionnaireId: questionnaireId,
      sectionId: questionnaire.sections[0].id,
      // sectionId: newSectionCreated
      //   ? questionnaire.sections[0].id
      //   : nextSection.id,
    })
  );
};

export default onCompleteDelete;
