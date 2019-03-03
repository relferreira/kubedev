import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';

import ServiceCard from '../components/ServiceCard';
import {
  getPublicIP,
  listServices
} from '../state-management/services-management';
import { filterSearch } from '../state-management/general-managements';
import PageHeader from '../components/PageHeader';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Services({ namespace }) {
  const [search, setSearch] = useState('');
  const { response, loading, query } = listServices(namespace);

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  return (
    <div>
      <PageHeader
        title="Services"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => query()}
      />
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
