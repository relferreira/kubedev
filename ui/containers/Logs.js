import React from 'react';
import styled from '@emotion/styled';
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
  return (
    <LogsContainer>
      <ScrollFollow
        startFollowing={true}
        render={({ follow, onScroll }) => (
          <LazyLog
            url={`http://localhost:8080/pods/${name}/logs/stream?namespace=workers`}
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
      <LogsControl name={name} />
    </LogsContainer>
  );
}
