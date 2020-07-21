import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Fuse from 'fuse.js';
import styled from '@emotion/styled';
import Downshift from 'downshift';

import * as kubectl from '../kubectl';
import Dialog from '../components/Dialog';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import Table from '../components/Table';
import Input from '../components/Input';
import { primaryDark, fontColorWhite } from '../util/colors';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;

  button {
    width: 100%;
  }

  a {
    margin-bottom: 16px;
  }
`;

const ModalSearch = styled(Input)`
  width: 100%;
`;

const ModalList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  cursor: pointer;
`;

const ModalListItem = styled.li`
  padding: 16px;
  background: ${props =>
    props.highlighted ? primaryDark : props.theme.background};
  color: ${props =>
    props.highlighted ? fontColorWhite : props.theme.sidebarFontColor};
  font-size: 14px;
`;

export default function NewTableInfo({
  title,
  namespace,
  command,
  formatHeader,
  formatItems,
  dialogItems,
  dialogLoading,
  navigate,
  onDialogClose,
  children
}) {
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tableFocus, setTableFocus] = useState(true);
  const { data: response, revalidate, isValidating } = useSWR(
    [namespace, command],
    kubectl.exec,
    { suspense: true }
  );

  useEffect(() => {
    setTableFocus(!tableFocus);
  }, [dialogItems]);

  const openDialog = item => {
    setShowDialog(true);
    setSelected(item);
  };

  const closeDialog = () => {
    setShowDialog(false);
    onDialogClose();
  };

  const handleOnSelect = selection => {
    if (selection && selection.callback) {
      const { items } = data;
      let selectedItem = items.find(
        ({ metadata }) => metadata.name === selected
      );
      selection.callback(selectedItem);
    } else if (selection && selection.full) {
      navigate(`${selection.href}`);
    } else if (selection) {
      navigate(`${selected}/${selection.href}`);
    } else {
      onDismiss();
    }
  };

  const { data } = response || {};

  // TODO validate error

  let fuse = new Fuse(data.items, {
    keys: ['metadata.name']
  });

  let headers = formatHeader();
  let items = search ? fuse.search(search, { limit: 10 }) : data.items;

  return (
    <div>
      {isValidating && <ProgressBar />}
      <PageHeader
        title={title}
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
        onBlur={() => setTableFocus(!tableFocus)}
      />
      <Table
        onSelect={index => openDialog(items[index].metadata.name)}
        size={items.length}
        tableFocus={tableFocus}
      >
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formatItems(items).map(item => (
            <tr key={item[0]} onClick={() => openDialog(item[0])}>
              {item.map((value, i) => (
                <td key={`${item[0]} ${headers[i]} ${value}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Dialog
        isOpen={showDialog}
        onDismiss={closeDialog}
        title={selected}
        width="500px"
      >
        <DialogContainer>
          <Downshift
            key={JSON.stringify(dialogItems)}
            onChange={handleOnSelect}
            itemToString={item => (item ? item.value : '')}
          >
            {({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              inputValue,
              highlightedIndex
            }) => (
              <div>
                <label {...getLabelProps()}></label>
                <ModalSearch
                  {...getInputProps({
                    placeholder: dialogLoading ? 'Loading...' : 'Search',
                    onKeyDown: event => {
                      if (event.key === 'Escape') {
                        event.nativeEvent.preventDownshiftDefault = true;
                      }
                    }
                  })}
                />
                <ModalList {...getMenuProps()}>
                  {!dialogLoading &&
                    dialogItems
                      .filter(
                        item =>
                          !inputValue ||
                          item.value
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                      )
                      .map((item, index) => (
                        <ModalListItem
                          {...getItemProps({
                            key: item.value,
                            index,
                            item,
                            highlighted: highlightedIndex === index
                          })}
                        >
                          {item.value}
                        </ModalListItem>
                      ))}
                </ModalList>
              </div>
            )}
          </Downshift>
        </DialogContainer>
      </Dialog>
    </div>
  );
}
