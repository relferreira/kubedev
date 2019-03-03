import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import GridCard from './GridCard';

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Schedule = styled.span`
  margin-top: 10px;
`;

const CronJobCard = ({ name, schedule }) => (
  <GridCard>
    <TextContainer>
      <span>{name}</span>
      <Schedule>Schedule: {schedule}</Schedule>
    </TextContainer>
  </GridCard>
);

CronJobCard.propTypes = {
  name: PropTypes.string.isRequired,
  schedule: PropTypes.string.isRequired
};

export default CronJobCard;
