import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Card from './Card';
import logs from '../assets/logs.svg';
import info from '../assets/info.svg';
import { fontColor } from '../util/colors';
import { Link } from '@reach/router';
import PodStatus from './PodStatus';

const CustomCard = styled(Card)`
  display: flex;
  align-items: center;
  // height: 74px;
  padding: 16px;
  margin-bottom: 16px;

  grid-column: span 12;
  @media screen and (min-width: 720px) {
    grid-column: span 6;
    margin: 16px;
  }
`;

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

const PodButtons = styled.div`
  display: flex;

  img {
    margin-left: 16px;
    color: ${fontColor};
    cursor: pointer;
  }
`;

const PodCard = ({ name, state }) => (
  <CustomCard>
    <PodStatus state={state} />
    <PodTextContainer>
      <span>{name}</span>
      <PodInfo>
        <span>{state}</span>
        {/* <span>Containers: 1/1</span> */}
        {/* {`${runningContainers}/${containers}`}</span> */}
        {/* <span>Age: {age}</span> */}
      </PodInfo>
    </PodTextContainer>
    <PodButtons>
      <Link to={`${name}/info`}>
        <img src={info} />
      </Link>
      {/* <img src={bug} /> */}
      <Link to={`${name}/logs/container/0`}>
        <img src={logs} />
      </Link>
    </PodButtons>
  </CustomCard>
);

PodCard.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  runningContainers: PropTypes.number.isRequired,
  containers: PropTypes.number.isRequired,
  age: PropTypes.string.isRequired
};

export default PodCard;
