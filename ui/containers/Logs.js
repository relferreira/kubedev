import React, { useState } from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';
import { LazyLog, ScrollFollow } from 'react-lazylog';

import LogsControl from '../components/LogsControl';

const LogsContainer = styled.div`
  position: relative;
  height: 100%;
  margin: -16px;
  color: white;
  background: #222222;
`;

export default function Logs({ name }) {
  const [selectedContainer, setSelectedContainer] = useState(0);
  const { response, loading, error, query } = useAxios({
    url: `${process.env.API}/workers/pods/${name}`,
    method: 'GET',
    trigger: null
  });

  const { data: pod } = response || {};

  if (loading) return <div>Loading...</div>;

  if (error) return <div>error</div>;

  if (!pod) return null;

  const {
    spec: { containers }
  } = pod;
  let container = containers[selectedContainer].name;

  return (
    <LogsContainer>
      <ScrollFollow
        startFollowing={true}
        render={({ follow, onScroll }) => (
          <LazyLog
            url={`${
              process.env.API
            }/workers/pods/${name}/${container}/logs/stream`}
            stream
            formatPart={e => {
              let response = JSON.parse(e.replace('data:', ''));
              return response.content;
            }}
            selectableLines={true}
            // follow={follow}
            // onScroll={onScroll}
            extraLines={5}
          />
        )}
      />
      <LogsControl
        containers={containers.map(container => container.name)}
        onSelect={selectedContainer =>
          setSelectedContainer(
            containers.findIndex(
              container => container.name === selectedContainer
            )
          )
        }
      />
    </LogsContainer>
  );
}
