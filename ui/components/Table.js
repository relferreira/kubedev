import React, { useRef, useEffect, useState } from 'react';
import Hotkeys from 'react-hot-keys';
import moment from 'moment';

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
  EuiCheckbox,
  SortableProperties
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
  showCheckbox = true,
  sortProperties,
  isSortable = true
}) {
  const [selected, setSelected] = useState(isSelectable ? 0 : -1);
  const tableEl = useRef(null);
  const [sortedColumn, setSortedColumn] = useState('name');
  const [reset, setReset] = useState(false);
  const [sortableProperties, setSortableProperties] = useState(
    isSortable &&
      (sortProperties ||
        new SortableProperties(
          [
            {
              name: 'name',
              getValue: item => item.name.toLowerCase(),
              isAscending: true
            },
            {
              name: 'age',
              getValue: item => item.age.toLowerCase(),
              isAscending: false
            }
          ],
          'name'
        ))
  );
  const [_, rerender] = useState({});

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
      selectedItems.find(i => i === item.name)
    );
  };

  const toggleItem = (e, item) => {
    e.stopPropagation();
    if (isItemSelected(item))
      setSelectedItems(selectedItems.filter(i => i !== item.name));
    else setSelectedItems(selectedItems.concat(item.name));
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
    else setSelectedItems(items.map(item => item.name));
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
          onSort={() => column.sorted && onSort(column.id)}
          isSorted={sortedColumn === column.id}
          isSortAscending={
            isSortable && sortableProperties.isAscendingByName(column.id)
          }
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
          <EuiTableRowCellCheckbox key={`${item.name}-checkbox`}>
            <EuiCheckbox
              // id={`${item.id}-checkbox`}
              checked={isItemSelected(item)}
              onChange={e => toggleItem(e, item)}
              type="inList"
            />
          </EuiTableRowCellCheckbox>
        ]);
      columns.forEach((column, key) => {
        let newCell;
        if (column.render) {
          newCell = (
            <EuiTableRowCell
              key={key}
              align={column.align}
              truncateText={false}
              textOnly={true}
              onClick={() => key === 0 && handleClick(index)}
            >
              {column.render(item[column.id])}
            </EuiTableRowCell>
          );
        } else if (column.type === 'date') {
          newCell = (
            <EuiTableRowCell
              key={key}
              align={column.align}
              truncateText={false}
              textOnly={true}
              onClick={() => key === 0 && handleClick(index)}
            >
              {moment(item[column.id]).fromNow(true)}
            </EuiTableRowCell>
          );
        } else {
          newCell = (
            <EuiTableRowCell
              key={key}
              align={column.align}
              truncateText={false}
              textOnly={true}
              onClick={() => key === 0 && handleClick(index)}
            >
              {key === 0 ? (
                <EuiLink color="text">{item[column.id]}</EuiLink>
              ) : (
                item[column.id]
              )}
            </EuiTableRowCell>
          );
        }

        cells.push(newCell);
      });

      return (
        <EuiTableRow
          key={item.name}
          isSelected={index === selected}
          isSelectable={true}
          hasActions={true}
        >
          {cells}
        </EuiTableRow>
      );
    };

    let sortedItems = isSortable ? sortableProperties.sortItems(items) : items;

    return sortedItems.map(renderRow);
  };

  const onSort = prop => {
    sortableProperties.sortOn(prop);
    setSortedColumn(prop);
    setSelectedItems([]);
    setSelected(0);
    rerender({});
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
