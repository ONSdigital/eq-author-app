import React from "react";
import { shallow } from "enzyme";

import { UnwrappedMetadataModal } from "components/MetadataModal";

const render = (props = {}) => shallow(<UnwrappedMetadataModal {...props} />);

describe("MetadataModal", () => {
  let props, contentProps, questionnaireId, wrapper;

  beforeEach(() => {
    questionnaireId = "1";

    props = {
      isOpen: true,
      onClose: jest.fn(),
      onAddMetadata: jest.fn(),
      onDeleteMetadata: jest.fn(),
      onUpdateMetadata: jest.fn(),
      questionnaireId: questionnaireId
    };

    contentProps = {
      loading: false,
      error: false,
      data: {
        questionnaire: {
          id: questionnaireId,
          metadata: []
        }
      }
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render loading state", () => {
    const instance = wrapper.instance();
    const renderContent = instance.renderContent({
      ...contentProps,
      loading: true
    });
    expect(renderContent).toMatchSnapshot();
  });

  it("should render error state", () => {
    const instance = wrapper.instance();
    const renderContent = instance.renderContent({
      ...contentProps,
      error: true
    });
    expect(renderContent).toMatchSnapshot();
  });

  it("should render questionnaire error state", () => {
    const instance = wrapper.instance();
    const renderContent = instance.renderContent({
      ...contentProps,
      data: {
        questionnaire: null
      }
    });
    expect(renderContent).toMatchSnapshot();
  });

  it("should render metadata content", () => {
    const instance = wrapper.instance();
    const renderContent = instance.renderContent({
      ...contentProps
    });
    expect(renderContent).toMatchSnapshot();
  });
});
