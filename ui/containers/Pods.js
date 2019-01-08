import React, { useState } from 'react';
import useAxios from '@use-hooks/axios';
import PodCard from '../components/PodCard';

export default function Pods() {
  const { response, loading, error, query } = useAxios({
    url: `http://localhost:8080/pods`,
    method: 'GET',
    options: {
      params: { namespace: 'workers' }
    },
    trigger: null
  });

  const { data } = response || {};

  if (loading) return <div>Loading...</div>;
  console.log(data);
  return (
    <div>
      <h1>Pods</h1>
      {data &&
        data.items.map(({ metadata, status }) => (
          <PodCard
            key={metadata.name}
            name={metadata.name}
            state={status.phase}
          />
        ))}
    </div>
  );
}
