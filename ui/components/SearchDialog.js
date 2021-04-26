import React, { Fragment } from 'react';

import Dialog from './Dialog';
import { useNavigate } from '@reach/router';
import { EuiSelectable } from '@elastic/eui';

function SearchDialog({
  isOpen,
  dialogItems,
  selected,
  loading,
  data,
  onDismiss
}) {
  const navigate = useNavigate();

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
      navigate(`${selection.type}/${selected}/${selection.href}`);
      onDismiss();
    } else {
      onDismiss();
    }
  };

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} title={selected}>
      <EuiSelectable
        aria-label="Single selection example"
        options={dialogItems.map(item => ({ label: item.value, ...item }))}
        searchable={true}
        onChange={handleOnSelect}
        singleSelection={true}
        listProps={{ bordered: false }}
        isLoading={loading}
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
