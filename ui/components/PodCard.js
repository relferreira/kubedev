import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Card from './Card';
import bug from '../assets/bug.svg';
import logs from '../assets/logs.svg';
import info from '../assets/info.svg';
import {
  fontColor,
  successColor,
  errorColor,
  warningColor,
  neutralColor
} from '../util/colors';
import { Link } from '@reach/router';

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

const PodStatus = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${props => {
    switch (props.state) {
      case 'Pending':
        return;
      case 'Running' || 'Succeeded':
        return successColor;
      case 'Failed':
        return errorColor;
      case 'Pending':
        return warningColor;
      case 'Unknown':
        return neutralColor;
      default:
        return successColor;
    }
  }};
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

const PodCard = ({ name, state, containers, runningContainers, age }) => (
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
      <img src={info} />
      <img src={bug} />
      <Link to={`${name}/logs`}>
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
