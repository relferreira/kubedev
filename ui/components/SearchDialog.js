import React from 'react';
import styled from '@emotion/styled';
import Downshift from 'downshift';

import Dialog from './Dialog';
import Input from './Input';
import { primaryDark, fontColorWhite } from '../util/colors';
import { useNavigate } from '@reach/router';

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
  max-height: 500px;
  list-style: none;
  cursor: pointer;
  overflow: auto;
`;

const ModalListItem = styled.li`
  padding: 16px;
  background: ${props =>
    props.highlighted ? primaryDark : props.theme.background};
  color: ${props =>
    props.highlighted ? fontColorWhite : props.theme.sidebarFontColor};
  font-size: 14px;
`;

function SearchDialog({
  isOpen,
  dialogItems,
  selected,
  loading,
  data,
  onDismiss
}) {
  const navigate = useNavigate();

  const handleOnSelect = selection => {
    if (selection && selection.callback) {
      const { items } = data;
      let selectedItem = items.find(
        ({ metadata }) => metadata.name === selected
      );
      selection.callback(selectedItem);
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
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
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
                  placeholder: loading ? 'Loading...' : 'Search',
                  onKeyDown: event => {
                    if (event.key === 'Escape') {
                      event.nativeEvent.preventDownshiftDefault = true;
                    }
                  }
                })}
              />
              <ModalList {...getMenuProps()}>
                {!loading &&
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
  );
}

export default SearchDialog;
