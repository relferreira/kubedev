import React, { useRef, useEffect, useState } from 'react';
import Hotkeys from 'react-hot-keys';

import {
  EuiTable,
  EuiTableHeader,
  EuiTableBody,
  EuiTableRowCell,
  EuiTableRow,
  EuiTableHeaderCell,
  EuiLink,
  EuiTableHeaderCellCheckbox,
  EuiTableRowCellCheckbox,
  EuiCheckbox
} from '@elastic/eui';

function Table({
  columns,
  items,
  size,
  tableFocus,
  isSelectable = true,
  onSelect,
  selectedItems,
  setSelectedItems,
  showCheckbox = true
}) {
  const [selected, setSelected] = useState(isSelectable ? 0 : -1);
  const tableEl = useRef(null);
  const [reset, setReset] = useState(false);

  // useEffect(() => {
  //   if (tableEl && size > 0) {
  //     let rows = tableEl.current.querySelectorAll('tr');
  //     // rows.forEach((row, i) => {
  //     //   if (i === selected) {
  //     //     row.classList.add('selected');
  //     //     row.tabIndex = -1;
  //     //     row.focus();
  //     //   } else {
  //     //     row.classList.remove('selected');
  //     //     row.tabIndex = 0;
  //     //     row.blur();
  //     //   }
  //     // });
  //   }
  // }, [tableEl, selected, reset]);

  useEffect(() => {
    if (!!selected) setSelected(null);
  }, [size]);

  // useEffect(() => {
  //   if (!selected || selected > 0) setSelected(0);
  //   setReset(!reset);
  // }, [tableFocus]);

  const handleShortcut = keyName => {
    if (
      !isSelectable ||
      !document.activeElement.classList.contains('euiBody--headerIsFixed')
    )
      return;
    if (keyName === 'enter') {
      onSelect(selected);
      return;
    }

    let inc = selected;
    if (keyName === 'down' && selected < size - 1) inc += 1;
    else if (keyName === 'up' && selected > 0) inc -= 1;

    setSelected(inc);
  };

  const handleClick = index => {
    if (!isSelectable) return true;
    setSelected(index);
    onSelect(index);
  };

  const isItemSelected = item => {
    return (
      selectedItems &&
      selectedItems.length > 0 &&
      selectedItems.find(i => i === item[0])
    );
  };

  const toggleItem = (e, item) => {
    e.stopPropagation();
    if (isItemSelected(item))
      setSelectedItems(selectedItems.filter(i => i !== item[0]));
    else setSelectedItems(selectedItems.concat(item[0]));
  };

  const areAllItemsSelected = () => {
    return (
      selectedItems &&
      selectedItems.length > 0 &&
      selectedItems.length === items.length
    );
  };

  const toggleAll = () => {
    if (areAllItemsSelected()) setSelectedItems([]);
    else setSelectedItems(items.map(item => item[0]));
  };

  const renderHeaderCells = () => {
    const headers = [];
    if (showCheckbox)
      headers.push([
        <EuiTableHeaderCellCheckbox key="select-all">
          <EuiCheckbox
            id="selectAllCheckbox"
            checked={areAllItemsSelected()}
            onChange={toggleAll}
            type="inList"
          />
        </EuiTableHeaderCellCheckbox>
      ]);

    columns.forEach((column, columnIndex) => {
      headers.push(
        <EuiTableHeaderCell
          key={column.id || column.label}
          align={column.align}
          width={column.width}
          // onSort={(e, i) => {
          //   console.log(e, i);
          // }}
          // isSorted={column.isSorted}
          // isSortAscending={true}
          // isSortAscending={this.sortableProperties.isAscendingByName(column.id)}
          // mobileOptions={column.mobileOptions}
        >
          {column.label || column}
        </EuiTableHeaderCell>
      );
    });
    return headers.length ? headers : null;
  };

  const renderRows = () => {
    const renderRow = (item, index) => {
      let cells = [];
      if (showCheckbox)
        cells.push([
          <EuiTableRowCellCheckbox key={`${item[0]}-checkbox`}>
            <EuiCheckbox
              // id={`${item.id}-checkbox`}
              checked={isItemSelected(item)}
              onChange={e => toggleItem(e, item)}
              type="inList"
            />
          </EuiTableRowCellCheckbox>
        ]);
      columns.forEach((column, key) =>
        cells.push(
          <EuiTableRowCell
            key={key}
            align={column.align}
            truncateText={false}
            textOnly={true}
            onClick={() => key === 0 && handleClick(index)}
          >
            {key === 0 ? (
              <EuiLink color="text">{item[key]}</EuiLink>
            ) : (
              item[key]
            )}
          </EuiTableRowCell>
        )
      );

      return (
        <EuiTableRow
          key={item[0]}
          isSelected={index === selected}
          isSelectable={true}
          hasActions={true}
        >
          {cells}
        </EuiTableRow>
      );
    };

    return items.map(renderRow);
  };

  return (
    <Hotkeys
      keyName="up,down,enter"
      allowRepeat={true}
      onKeyDown={handleShortcut}
    >
      <EuiTable id="teste">
        <EuiTableHeader>{renderHeaderCells()}</EuiTableHeader>

        <EuiTableBody bodyRef={tableEl}>{renderRows()}</EuiTableBody>
      </EuiTable>
    </Hotkeys>
  );
}

export default Table;
