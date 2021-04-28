import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  EuiSearchBar,
  EuiSpacer,
  EuiButtonIcon,
  EuiButton,
  EuiPopover,
  EuiContextMenuPanel,
  EuiConfirmModal,
  EuiContextMenuItem
} from '@elastic/eui';

import * as kubectl from '../kubectl';
import SearchDialog from '../components/SearchDialog';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import Table from '../components/Table';

export default function NewTableInfo({
  title,
  type,
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
  const [search, setSearch] = useState(sessionStorage.getItem('search') || '');
  const [showDialog, setShowDialog] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tableFocus, setTableFocus] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isContextMenuOpen, setContextMenuOpen] = useState(false);
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
    setSelected(null);
    onDialogClose && onDialogClose();
  };

  const handleSearch = text => {
    setSearch(text);
    sessionStorage.setItem('search', text);
  };

  const handleDelete = () => {
    console.log(`delete ${type} ${selectedItems.join(' ')}`);
    setDeleting(true);
    kubectl
      .exec(namespace, `delete ${type} ${selectedItems.join(' ')}`, false)
      .then(() => {
        setConfirmModalOpen(false);
        setSelectedItems([]);
        revalidate();
      })
      .catch(alert)
      .finally(() => setDeleting(false));
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
        onSearch={handleSearch}
        onRefresh={() => revalidate()}
        onBlur={() => setTableFocus(!tableFocus)}
      >
        {selectedItems && selectedItems.length > 0 && (
          <EuiPopover
            id="contextMenuExample"
            button={
              <EuiButtonIcon
                display="empty"
                iconSize="l"
                size="l"
                iconType="boxesVertical"
                color="text"
                aria-label="More"
                onClick={() => setContextMenuOpen(true)}
              />
            }
            isOpen={isContextMenuOpen}
            closePopover={() => setContextMenuOpen(false)}
            panelPaddingSize="none"
            anchorPosition="downLeft"
          >
            <EuiContextMenuPanel
              initialPanelId={0}
              size="m"
              items={[
                <EuiContextMenuItem
                  key="trash"
                  icon="trash"
                  iconColor="danger"
                  onClick={() => {
                    setContextMenuOpen(false);
                    setConfirmModalOpen(true);
                  }}
                >
                  Delete
                </EuiContextMenuItem>
              ]}
            />
          </EuiPopover>
        )}

        <EuiButtonIcon
          iconType="refresh"
          iconSize="l"
          size="l"
          color="text"
          aria-label="Refresh"
          onClick={() => revalidate()}
        />
      </PageHeader>
      <EuiSpacer size="m" />
      <Table
        columns={headers}
        items={formatItems(items)}
        onSelect={index => openDialog(items[index].metadata.name)}
        size={items.length}
        tableFocus={tableFocus}
        isDialogOpen={showDialog}
        isSelectable={!selected}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <SearchDialog
        isOpen={showDialog}
        onDismiss={closeDialog}
        dialogItems={dialogItems}
        selected={selected}
        loading={dialogLoading}
        data={data}
      />
      {confirmModalOpen && (
        <EuiConfirmModal
          title={`Delete ${type}`}
          onCancel={() => setConfirmModalOpen(false)}
          onConfirm={handleDelete}
          cancelButtonText="No, don't do it"
          confirmButtonText="Yes, do it"
          buttonColor="danger"
          isLoading={deleting}
        >
          <p>Are you sure you want to do this?</p>
          <ul>
            {selectedItems.map(item => (
              <li>{item}</li>
            ))}
          </ul>
        </EuiConfirmModal>
      )}
    </div>
  );
}
