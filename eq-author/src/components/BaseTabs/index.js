import React from "react";
import PropTypes from "prop-types";

const renderButton = ({ onChange, activeId, buttonRender }, item) => {
  const { id } = item;
  const isSelected = id === activeId;
  return buttonRender(
    {
      "aria-selected": isSelected,
      "aria-controls": id,
      onClick: () => {
        if (isSelected) {
          return;
        }
        onChange(id);
      },
      key: id,
    },
    { ...item, isSelected }
  );
};

const BaseTabs = ({
  TabList,
  ContentWrapper,
  buttonRender,
  onChange,
  activeId,
  tabs,
}) => {
  const activeTab = tabs.find(({ id }) => id === activeId) || tabs[0];
  const { render: renderTab, id: activeTabId } = activeTab;
  return (
    <React.Fragment>
      <TabList>
        {tabs.map((item) =>
          renderButton({ onChange, activeId: activeTabId, buttonRender }, item)
        )}
      </TabList>
      <ContentWrapper aria-labelledby={activeTabId}>
        {renderTab()}
      </ContentWrapper>
    </React.Fragment>
  );
};

const StringOrNumber = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);
const Component = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
  PropTypes.elementType,
]);

BaseTabs.propTypes = {
  TabList: Component,
  ContentWrapper: Component,
  buttonRender: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  activeId: StringOrNumber,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: StringOrNumber.isRequired,
      title: PropTypes.string.isRequired,
      render: PropTypes.func.isRequired,
    })
  ),
};
BaseTabs.defaultProps = {
  TabList: "ul",
  ContentWrapper: "div",
};

export default BaseTabs;
