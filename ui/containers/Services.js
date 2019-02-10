import React from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import ServiceCard from '../components/ServiceCard';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Services({ namespace }) {
  const { response, loading, error, query } = useAxios({
    url: `${process.env.API}/${namespace}/services`,
    method: 'GET',
    trigger: namespace
  });

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const getPublicIP = loadBalancer => {
    if (loadBalancer && loadBalancer.ingress) return loadBalancer.ingress[0].ip;
    return null;
  };

  const {
    data: { items }
  } = response || {};
  console.log(items);
  return (
    <div>
      <h1>Services</h1>
      <ServicesGrid>
        {items &&
          items.map(({ metadata, spec, status }) => (
            <ServiceCard
              key={metadata.name}
              name={metadata.name}
              clusterIP={spec.clusterIP}
              publicIP={getPublicIP(status.loadBalancer)}
            />
          ))}
      </ServicesGrid>
    </div>
  );
}
