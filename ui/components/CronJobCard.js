import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import GridCard from './GridCard';
import { Link } from '@reach/router';

const CronJobLink = styled(Link)`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: inherit;
  text-decoration: none;
`;

const Schedule = styled.span`
  margin-top: 10px;
`;

const CronJobCard = ({ name, schedule }) => (
  <GridCard>
    <CronJobLink to={`${name}/get`}>
      <span>{name}</span>
      <Schedule>Schedule: {schedule}</Schedule>
    </CronJobLink>
  </GridCard>
);

CronJobCard.propTypes = {
  name: PropTypes.string.isRequired,
  schedule: PropTypes.string.isRequired
};

export default CronJobCard;
