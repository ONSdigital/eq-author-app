import React from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import fp from "lodash/fp";
import { startRequest, endRequest } from "redux/saving/actions";
import { connect } from "react-redux";
import { propType } from "graphql-anywhere";

import pageFragment from "graphql/fragments/page.graphql";
import answerFragment from "graphql/fragments/answer.graphql";

const withSaveTracking = connect(
  null,
  { startRequest, endRequest }
);

const withEntityEditor = entityPropName => WrappedComponent => {
  class EntityEditor extends React.Component {
    static propTypes = {
      [entityPropName]: PropTypes.object.isRequired, // eslint-disable-line
      onUpdate: PropTypes.func.isRequired,
      onSubmit: PropTypes.func,
      startRequest: PropTypes.func,
      endRequest: PropTypes.func,
      page: propType(pageFragment),
      answer: propType(answerFragment),
    };

    state = {
      [entityPropName]: this.props[entityPropName],
      lostFocus: false,
    };

    dirtyField = null;

    componentDidUpdate(prevProps) {
      if (!isEqual(prevProps[entityPropName], this.props[entityPropName])) {
        let newEntity = this.props[entityPropName];
        if (this.dirtyField) {
          const existingDirtyValue = fp.get(
            this.dirtyField,
            this.state[entityPropName]
          );
          newEntity = fp.set(this.dirtyField, existingDirtyValue, newEntity);
        }

        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          [entityPropName]: newEntity,
        });
      }
    }

    static fragments = WrappedComponent.fragments;

    get entity() {
      return this.state[entityPropName];
    }

    handleChange = ({ name, value }, cb) => {
      if (fp.get(name, this.entity) === value) {
        return;
      }

      this.dirtyField = name;

      const entity = fp.set(name, value, this.entity);
      if (!this.unmounted) {
        this.setState(() => ({ [entityPropName]: entity }), cb);
      }
    };

    handleUpdate = () => {
      if (!this.dirtyField) {
        return;
      }

      this.dirtyField = null;
      this.props.startRequest();

      this.props
        .onUpdate(this.entity)
        .then(() => {
          this.props.endRequest();
        })
        .catch(() => {
          this.props.endRequest();
        });
    };

    handleLoseFocus = () => {
      // Don't need to track focus if field has been updated as update with rerender component
      if (this.dirtyField) {
        return;
      }

      this.setState({
        lostFocus: true,
      });
    };

    componentWillUnmount() {
      this.unmounted = true;
    }

    handleSubmit = e => {
      e.preventDefault();

      this.dirtyField = null;
      this.props.onSubmit(this.entity);
    };

    enableValidationMessage = () => {
      const { page, answer } = this.props;
      const entity = page || answer;

      const isNewEntity = !this.state.lostFocus && entity && entity.isNew;
      return !isNewEntity;
    };

    render() {
      const props = {
        [entityPropName]: this.entity,
      };

      return (
        <div onBlur={this.handleLoseFocus}>
          <WrappedComponent
            {...this.props}
            {...props}
            onChange={this.handleChange}
            onUpdate={this.handleUpdate}
            onSubmit={this.handleSubmit}
            enableValidationMessage={this.enableValidationMessage()}
          />
        </div>
      );
    }
  }

  EntityEditor.displayName = `withEntityEditor(${
    WrappedComponent.displayName
  })`;

  return withSaveTracking(EntityEditor);
};

export default withEntityEditor;
