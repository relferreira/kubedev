import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import StatusIcon from './StatusIcon';
import GridCard from './GridCard';
import { Link } from '@reach/router';

const JobLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
`;

const JobTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 16px;
`;

const JobInfo = styled.div`
  display: flex;
  margin-top: 10px;

  span {
    flex: 0 0 200px;
  }
`;

const JobCard = ({ name, state, number }) => (
  <GridCard>
    <JobLink to={`${name}`}>
      <StatusIcon state={state} />
      <JobTextContainer>
        <span>{name}</span>
        <JobInfo>
          {state && number && (
            <span>
              {state}: {number}
            </span>
          )}
        </JobInfo>
      </JobTextContainer>
    </JobLink>
  </GridCard>
);

JobCard.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.string,
  number: PropTypes.number
};

export default JobCard;
