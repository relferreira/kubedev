import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { EuiSearchBar, EuiSpacer } from '@elastic/eui';

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
  children,
  filterFields = ['metadata.name']
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

  let headers = formatHeader();

  let options = {
    defaultFields: filterFields
  };
  const items = EuiSearchBar.Query.execute(search, data.items, options);

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
      <EuiSpacer size="m" />
      <Table
        columns={headers}
        items={formatItems(items)}
        onSelect={index => openDialog(items[index].metadata.name)}
        size={items.length}
        tableFocus={tableFocus}
        isDialogOpen={showDialog}
      />
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
