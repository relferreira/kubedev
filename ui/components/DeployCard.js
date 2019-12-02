import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import GridCard from './GridCard';
import { Link } from '@reach/router';

const DeployReplicas = styled.span`
  font-size: 25px;
  margin-right: 16px;
`;

const DeployLink = styled(Link)`
  width: 100%;
  color: inherit;
  text-decoration: none;
`;

const DeployCard = ({ replicas, name }) => (
  <GridCard>
    <DeployLink to={`${name}/get`}>
      <DeployReplicas>{replicas}</DeployReplicas>
      <span>{name}</span>
    </DeployLink>
  </GridCard>
);

DeployCard.propTypes = {
  replicas: PropTypes.number,
  name: PropTypes.string.isRequired
};

export default DeployCard;
