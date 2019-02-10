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
`;

const PodIcon = styled.svg`
  margin-left: 16px;
  cursor: pointer;
  fill: ${props => props.theme.containerFont};
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
        <PodIcon
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </PodIcon>
      </Link>
      {/* <img src={bug} /> */}
      <Link to={`${name}/logs/container/0`}>
        <PodIcon
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-4 4v3c0 .22-.03.47-.07.7l-.1.65-.37.65c-.72 1.24-2.04 2-3.46 2s-2.74-.77-3.46-2l-.37-.64-.1-.65C8.03 15.48 8 15.23 8 15v-4c0-.23.03-.48.07-.7l.1-.65.37-.65c.3-.52.72-.97 1.21-1.31l.57-.39.74-.18c.31-.08.63-.12.94-.12.32 0 .63.04.95.12l.68.16.61.42c.5.34.91.78 1.21 1.31l.38.65.1.65c.04.22.07.47.07.69v1zm-6 2h4v2h-4zm0-4h4v2h-4z" />
        </PodIcon>
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
