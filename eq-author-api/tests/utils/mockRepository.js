module.exports = function mockRepository(returnValues = {}) {
  return {
    createAnswer: jest.fn(() => returnValues.createAnswer),
    getById: jest.fn(() => returnValues.getById),
    getAnswers: jest.fn(() => returnValues.getAnswers),
    findAll: jest.fn(() => returnValues.findAll),
    insert: jest.fn(() => returnValues.insert),
    update: jest.fn(() => returnValues.update),
    remove: jest.fn(() => returnValues.remove)
  };
};
