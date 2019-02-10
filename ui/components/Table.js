import React from 'react';
import styled from '@emotion/styled';

const Table = styled.table`
  width: 100%;
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  color: ${props => props.theme.containerFont};

  tr {
    border-bottom: 1px solid ${props => props.theme.tableBorder};
  }

  td,
  th {
    padding: 15px 10px;
    display: table-cell;
    text-align: left;
    vertical-align: middle;
    border-radius: 2px;
  }
`;

export default Table;
