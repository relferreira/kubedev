import React from 'react';
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
`;

const EditControl = ({ onSave }) => (
  <CustomCard>
    <Button onClick={onSave}>SAVE</Button>
  </CustomCard>
);

EditControl.propTypes = {
  onSave: PropTypes.func
};

export default EditControl;
