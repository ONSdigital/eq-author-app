const { v4: uuidv4 } = require("uuid");

module.exports = () => {
  return {
    id: uuidv4(),
    furtherContent: `<p>Your response will help inform decision-makers how best to support the UK population and economy at this challenging time</p>`,
    viewPrintAnswers: true,
    emailConfirmation: true,
    feedback: true,
  };
};
