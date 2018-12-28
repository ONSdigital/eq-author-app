/* eslint-disable import/unambiguous */

const { RichUtils } = jest.genMockFromModule("draft-js");
const draftjs = require.requireActual("draft-js");

const mockImplementation = (state, style) =>
  draftjs.RichUtils.toggleBlockType(state, style);

RichUtils.toggleBlockType.mockImplementation(mockImplementation);
RichUtils.toggleInlineStyle.mockImplementation(mockImplementation);

module.exports = {
  ...draftjs,
  RichUtils
};
