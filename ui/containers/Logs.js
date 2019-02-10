import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';
import { LazyLog, ScrollFollow } from 'react-lazylog';

import LogsControl from '../components/LogsControl';
import { navigate } from '@reach/router';
import { darkLight } from '../util/colors';
import { getPodInfo } from '../state-management/pods-management';

const LogsContainer = styled.div`
  position: relative;
  height: 100%;
  margin: -16px;
  color: white;
  background: ${props => props.theme.background};
`;

const LogText = styled(LazyLog)`
  background: ${props => props.theme.background};
`;

export default function Logs({
  namespace,
  name,
  selectedContainer = 0,
  onLogInit
}) {
  const [following, setFollowing] = useState(false);
  const { response, loading, error } = getPodInfo(namespace, name);

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
        style={{ background: darkLight }}
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
            follow={following}
            extraLines={5}
            containerStyle={{ background: darkLight }}
            style={{ background: darkLight }}
          />
        )}
      />
      <LogsControl
        selected={container}
        containers={containers.map(container => container.name)}
        following={following}
        onFollow={() => setFollowing(following => !following)}
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
