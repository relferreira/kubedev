import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import Fuse from 'fuse.js';

import * as kubectl from '../kubectl';
import SearchDialog from '../components/SearchDialog';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import Table from '../components/Table';

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
    onDialogClose && onDialogClose();
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
      <SearchDialog
        isOpen={showDialog}
        onDismiss={closeDialog}
        dialogItems={dialogItems}
        selected={selected}
        loading={dialogLoading}
        data={data}
      />
    </div>
  );
}
