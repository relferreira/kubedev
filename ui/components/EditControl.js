import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Card from './Card';
import Button from './Button';

const CustomCard = styled(Card)`
  display: flex;
  align-items: center;
  position: absolute;
  width: 70%;
  height: 51px;
  bottom: 0;
  left: 50%;
  margin-left: -35%;
  padding: 16px;
  color: ${props => props.theme.containerFont};
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  z-index: 1;

  p {
    flex: 1;
  }

  button {
    margin-left: 16px;
  }
`;

const EditControl = ({ confirm, loading, onDiff, onConfirm, onCancel }) => (
  <CustomCard>
    <p>{!loading ? 'Apply Configuration?' : 'Loading...'}</p>
    {!confirm ? (
      <Button onClick={onDiff} disabled={loading}>
        SAVE
      </Button>
    ) : (
      <Fragment>
        <Button type="error" onClick={onCancel} disabled={loading}>
          CANCEL
        </Button>
        <Button onClick={onConfirm} disabled={loading}>
          CONFIRM
        </Button>
      </Fragment>
    )}
  </CustomCard>
);

EditControl.propTypes = {
  confirm: PropTypes.bool,
  loading: PropTypes.bool,
  onDiff: PropTypes.func,
  confirm: PropTypes.bool
};

EditControl.defaultProps = {
  confirm: false,
  loading: false
};

export default EditControl;
