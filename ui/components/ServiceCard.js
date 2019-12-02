import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import GridCard from './GridCard';
import Icon from './Icon';
import { Link } from '@reach/router';

const ServiceCardContainer = styled(GridCard)`
  cursor: pointer;
`;

const ServiceLink = styled(Link)`
  width: 100%;
  color: inherit;
  text-decoration: none;
`;

const ServiceInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ServiceIPs = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  span {
    flex: 1;
    margin-left: 5px;
  }
`;

const ServiceCard = ({ name, clusterIP, publicIP }) => (
  <ServiceCardContainer>
    <ServiceLink to={`${name}/get`}>
      <ServiceInfo>
        <span>{name}</span>
        <ServiceIPs>
          <Icon
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6m0-2C9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96C18.67 6.59 15.64 4 12 4z" />
          </Icon>
          <span>{clusterIP}</span>
          {publicIP && (
            <Icon
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M11 5v5.59H7.5l4.5 4.5 4.5-4.5H13V5h-2zm-5 9c0 3.31 2.69 6 6 6s6-2.69 6-6h-2c0 2.21-1.79 4-4 4s-4-1.79-4-4H6z" />
            </Icon>
          )}
          {publicIP && <span>{publicIP}</span>}
        </ServiceIPs>
      </ServiceInfo>
    </ServiceLink>
  </ServiceCardContainer>
);

ServiceCard.propTypes = {
  name: PropTypes.string.isRequired,
  clusterIP: PropTypes.string.isRequired,
  publicIP: PropTypes.string
};

export default ServiceCard;
