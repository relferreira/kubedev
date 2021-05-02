import React, { Fragment, useEffect, useRef } from 'react';

import Dialog from './Dialog';
import { useNavigate } from '@reach/router';
import { EuiSelectable, EuiHorizontalRule, EuiIcon } from '@elastic/eui';

function SearchDialog({
  namespace,
  isOpen,
  dialogItems,
  selected,
  loading,
  data,
  dialogRender,
  onDismiss
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      if (isOpen) inputRef.current.focus();
      else inputRef.current.blur();
    }
  }, [isOpen]);

  const handleOnSelect = selections => {
    let selection = selections.find(item => item.checked === 'on');

    if (selection && selection.callback) {
      let selectedItem = null;
      if (data) {
        const { items } = data;
        selectedItem = items.find(({ metadata }) => metadata.name === selected);
      }

      selection.callback(selection, selectedItem);
    } else if (selection && !selection.type) {
      navigate(`${selection.href}`);
      onDismiss();
    } else if (selection) {
      navigate(
        `/ui/${namespace}/${selection.type}/${selected}/${selection.href}`
      );
      onDismiss();
    } else {
      onDismiss();
    }
  };

  const renderIcon = option => {
    let type = 'dot';
    switch (option.value) {
      case 'Logs':
        type = 'filebeatApp';
        break;
      case 'Edit':
        type = 'managementApp';
        break;
      case 'Describe':
        type = 'monitoringApp';
        break;
    }

    return <EuiIcon type={type} size="m" style={{ marginRight: '8px' }} />;
  };

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} title={selected}>
      <EuiSelectable
        aria-label="Single selection example"
        options={
          dialogItems &&
          dialogItems.map(item => ({
            label: item.value,
            ...item,
            prepend: renderIcon(item)
          }))
        }
        searchable={true}
        onChange={handleOnSelect}
        singleSelection={true}
        listProps={{ bordered: false }}
        isLoading={loading}
        tabIndex={1}
        listProps={{ rowHeight: 64, showIcons: false }}
        height="full"
        searchProps={{
          inputRef: e => (inputRef.current = e)
        }}
      >
        {(list, search) => (
          <Fragment>
            {search}
            {list}
          </Fragment>
        )}
      </EuiSelectable>
    </Dialog>
  );
}

export default SearchDialog;
