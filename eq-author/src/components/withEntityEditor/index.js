import React from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import fp from "lodash/fp";
import { startRequest, endRequest } from "redux/saving/actions";
import { connect } from "react-redux";

const withSaveTracking = connect(null, { startRequest, endRequest });

const withEntityEditor = (entityPropName) => (WrappedComponent) => {
  class EntityEditor extends React.Component {
    static propTypes = {
      [entityPropName]: PropTypes.object.isRequired, // eslint-disable-line
      onUpdate: PropTypes.func.isRequired,
      onSubmit: PropTypes.func,
      startRequest: PropTypes.func,
      endRequest: PropTypes.func,
    };

    state = {
      [entityPropName]: this.props[entityPropName],
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

      /*
      name: The name of the attribute being changed in the backend data (this might take the id property)
      value: The value being passed down to change, associated with the name
      this.entity: The object being changed
      */
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

    componentWillUnmount() {
      this.unmounted = true;
    }

    handleSubmit = (e) => {
      e.preventDefault();

      this.dirtyField = null;
      this.props.onSubmit(this.entity);
    };

    render() {
      const props = {
        [entityPropName]: this.entity,
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

  EntityEditor.displayName = `withEntityEditor(${WrappedComponent.displayName})`;

  return withSaveTracking(EntityEditor);
};

export default withEntityEditor;
