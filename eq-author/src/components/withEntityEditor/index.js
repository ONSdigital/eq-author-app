import React from "react";
import PropTypes from "prop-types";
import { filter } from "graphql-anywhere";
import { isEqual } from "lodash";
import fp from "lodash/fp";
import { startRequest, endRequest } from "../../redux/saving/actions";
import { connect } from "react-redux";

const withSaveTracking = connect(
  null,
  { startRequest, endRequest }
);

const withEntityEditor = (entityPropName, fragment) => WrappedComponent => {
  class EntityEditor extends React.Component {
    static propTypes = {
      [entityPropName]: PropTypes.object.isRequired, // eslint-disable-line
      onUpdate: PropTypes.func.isRequired,
      onSubmit: PropTypes.func,
      startRequest: PropTypes.func,
      endRequest: PropTypes.func
    };

    state = {
      [entityPropName]: this.props[entityPropName]
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
          [entityPropName]: newEntity
        });
      }
    }

    static fragments = WrappedComponent.fragments;

    get entity() {
      return this.state[entityPropName];
    }

    get filteredEntity() {
      return filter(fragment, this.entity);
    }

    handleChange = ({ name, value }, cb) => {
      if (this.entity[name] === value) {
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
        .onUpdate(this.filteredEntity)
        .then(() => {
          this.props.endRequest();
        })
        .catch(() => {
          this.props.endRequest();
        });
    };

    componentWillUnmount() {
      this.unmounted = true;
    }

    handleSubmit = e => {
      e.preventDefault();

      this.dirtyField = null;
      this.props.onSubmit(this.filteredEntity);
    };

    render() {
      const props = {
        [entityPropName]: this.entity
      };

      return (
        <WrappedComponent
          {...this.props}
          {...props}
          onChange={this.handleChange}
          onUpdate={this.handleUpdate}
          onSubmit={this.handleSubmit}
        />
      );
    }
  }

  EntityEditor.displayName = `withEntityEditor(${
    WrappedComponent.displayName
  })`;

  return withSaveTracking(EntityEditor);
};

export default withEntityEditor;
