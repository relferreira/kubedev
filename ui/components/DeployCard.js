import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import GridCard from './GridCard';

const DeployReplicas = styled.span`
  font-size: 25px;
  margin-right: 16px;
`;

const DeployCard = ({ replicas, name }) => (
  <GridCard>
    <DeployReplicas>{replicas}</DeployReplicas>
    <span>{name}</span>
  </GridCard>
);

DeployCard.propTypes = {
  replicas: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

export default DeployCard;
