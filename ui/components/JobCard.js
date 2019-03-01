import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import StatusIcon from './StatusIcon';
import GridCard from './GridCard';

const PodTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 16px;
`;

const PodInfo = styled.div`
  display: flex;
  margin-top: 10px;

  span {
    flex: 0 0 200px;
  }
`;

const JobCard = ({ name, state, number }) => (
  <GridCard>
    <StatusIcon state={state} />
    <PodTextContainer>
      <span>{name}</span>
      <PodInfo>
        {state && number && (
          <span>
            {state}: {number}
          </span>
        )}
      </PodInfo>
    </PodTextContainer>
  </GridCard>
);

JobCard.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.string,
  number: PropTypes.number
};

export default JobCard;
