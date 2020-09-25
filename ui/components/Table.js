import React, { useRef, useEffect, useState } from 'react';
import Hotkeys from 'react-hot-keys';
import styled from '@emotion/styled';
import { primaryDark } from '../util/colors';

const TableContainer = styled.table`
  width: 100%;
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  color: ${props => props.theme.containerFont};

  tr {
    border-bottom: 1px solid ${props => props.theme.tableBorder};
    outline: none;
  }

  tr.selected {
    border-left: 4px solid ${primaryDark};
    outline: none;
    background: ${props => props.theme.header};
    color: ${props => props.theme.containerFont};
  }

  td,
  th {
    padding: 15px 10px;
    display: table-cell;
    text-align: left;
    vertical-align: middle;
    border-radius: 2px;
  }

  a {
    text-decoration: none;
  }
`;

function Table({ children, size, tableFocus, onSelect }) {
  const [selected, setSelected] = useState(0);
  const tableEl = useRef(null);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (tableEl && size > 0) {
      let rows = tableEl.current.querySelectorAll('tbody tr');
      rows.forEach((row, i) => {
        if (i === selected) {
          row.classList.add('selected');
          row.tabIndex = -1;
          row.focus();
        } else {
          row.classList.remove('selected');
          row.tabIndex = 0;
          row.blur();
        }
      });
    }
  }, [tableEl, selected, reset]);

  useEffect(() => {
    if (!!selected) setSelected(null);
  }, [size]);

  useEffect(() => {
    if (!selected || selected > 0) setSelected(0);
    setReset(!reset);
  }, [tableFocus]);

  const handleShortcut = keyName => {
    if (keyName === 'enter') {
      onSelect(selected);
      return;
    }

    let inc = selected;
    if (keyName === 'down' && selected < size - 1) inc += 1;
    else if (keyName === 'up' && selected > 0) inc -= 1;

    setSelected(inc);
  };

  return (
    <Hotkeys
      keyName="up,down,enter"
      allowRepeat={true}
      onKeyDown={handleShortcut}
    >
      <TableContainer ref={tableEl}>{children}</TableContainer>
    </Hotkeys>
  );
}

export default Table;
