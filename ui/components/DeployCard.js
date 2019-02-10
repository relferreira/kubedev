import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Card from './Card';

const CustomCard = styled(Card)`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;

  grid-column: span 12;
  @media screen and (min-width: 720px) {
    grid-column: span 6;
    margin: 16px;
  }
`;

const DeployReplicas = styled.span`
  font-size: 25px;
  margin-right: 16px;
`;

const DeployCard = ({ replicas, name }) => (
  <CustomCard>
    <DeployReplicas>{replicas}</DeployReplicas>
    <span>{name}</span>
  </CustomCard>
);

DeployCard.propTypes = {
  replicas: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired
};

export default DeployCard;
