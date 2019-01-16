import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';
import { LazyLog, ScrollFollow } from 'react-lazylog';

import LogsControl from '../components/LogsControl';
import { navigate } from '@reach/router';

const LogsContainer = styled.div`
  position: relative;
  height: 100%;
  margin: -16px;
  color: white;
  background: #222222;
`;

export default function Logs({
  namespace,
  name,
  selectedContainer = 0,
  onLogInit
}) {
  const { response, loading, error, query } = useAxios({
    url: `${process.env.API}/${namespace}/pods/${name}`,
    method: 'GET',
    trigger: name
  });

  useEffect(() => {
    onLogInit({ type: 'logs', namespace, resource: 'pods', name });
  }, []);

  const { data: pod } = response || {};

  if (loading) return <div>Loading...</div>;

  if (error) return <div>error</div>;

  if (!pod) return null;

  const {
    spec: { containers }
  } = pod;
  let container =
    containers[selectedContainer] && containers[selectedContainer].name;

  if (!container) return null;

  return (
    <LogsContainer>
      <ScrollFollow
        startFollowing={true}
        render={({ follow, onScroll }) => (
          <LazyLog
            url={`${
              process.env.API
            }/${namespace}/pods/${name}/${container}/logs/stream`}
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
        selected={container}
        containers={containers.map(container => container.name)}
        onSelect={selectedContainer =>
          navigate(
            `${containers.findIndex(
              container => container.name === selectedContainer
            )}`
          )
        }
      />
    </LogsContainer>
  );
}
