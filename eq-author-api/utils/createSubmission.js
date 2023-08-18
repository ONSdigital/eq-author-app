const { v4: uuidv4 } = require("uuid");

module.exports = () => {
  return {
    id: uuidv4(),
    furtherContent: `<p>Your response will help inform decision-makers how best to support the UK population and economy at this challenging time.</p><p><a href="https://www.ons.gov.uk/surveys" target="_blank" rel="noopener noreferrer">Learn more about how we use this data</a></p>`,
    viewPrintAnswers: true,
    feedback: true,
  };
};
