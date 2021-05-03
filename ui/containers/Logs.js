import React, { useState, useEffect } from 'react';
import { LazyLog, ScrollFollow } from 'react-lazylog';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import LogsControl from '../components/LogsControl';

export default function Logs({ namespace, name, onLogInit }) {
  const [selectedContainer, selectContainer] = useState(0);
  const [following, setFollowing] = useState(true);
  const { data: response } = useSWR(
    [namespace, `get pod ${name}`],
    kubectl.exec,
    { suspense: true, revalidateOnFocus: false }
  );

  useEffect(() => {
    onLogInit({ type: 'logs', namespace, resource: 'pods', name });
  }, []);

  const { data: pod } = response || {};

  if (!pod) return null;

  const {
    spec: { containers }
  } = pod;
  let container =
    containers[selectedContainer] && containers[selectedContainer].name;

  if (!container) return null;

  return (
    <div
      style={{
        position: 'relative',
        margin: '-24px',
        height: 'calc(100vh - 49px)',
        overflow: 'hidden'
      }}
    >
      <ScrollFollow
        startFollowing={true}
        render={({ follow, onScroll }) => (
          <LazyLog
            url={`${process.env.API}/${namespace}/pods/${name}/${container}/logs/stream`}
            stream
            formatPart={e => {
              let response = JSON.parse(e.replace('data:', ''));
              return response.content;
            }}
            selectableLines={true}
            enableSearch={true}
            follow={following}
            extraLines={5}
            containerStyle={{ background: '#1D1E24' }}
            style={{ background: '#1D1E24' }}
          />
        )}
      />
      <LogsControl
        selected={container}
        containers={containers.map(container => container.name)}
        following={following}
        onFollow={() => setFollowing(following => !following)}
        onSelect={selectedContainer =>
          selectContainer(
            containers.findIndex(
              container => container.name === selectedContainer
            )
          )
        }
      />
    </div>
  );
}
