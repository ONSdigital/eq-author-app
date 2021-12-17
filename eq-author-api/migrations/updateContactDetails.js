module.exports = (questionnaire) => {
  if (!questionnaire.introduction) {
    return questionnaire;
  }

  const into = questionnaire.introduction;
  if (!into.contactDetailsPhoneNumber) {
    into.contactDetailsPhoneNumber = "0300 1234 931";
  }

  if (!into.contactDetailsEmailAddress) {
    into.contactDetailsEmailAddress = "surveys@ons.gov.uk";
  }

  if (!into.contactDetailsEmailSubject) {
    into.contactDetailsEmailSubject = "Change of details";
  }

  if (!into.contactDetailsIncludeRuRef) {
    into.contactDetailsIncludeRuRef = true;
  }

  return questionnaire;
};
