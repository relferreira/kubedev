import React, { useState, Fragment } from 'react';
import styled from '@emotion/styled';
import { navigate } from '@reach/router';
import Downshift from 'downshift';

import { useConfigContext } from '../state-management/config-management';
import PodCard from '../components/PodCard';
import Table from '../components/Table';
import {
  getContainersReady,
  getContainersRestarts
} from '../state-management/pod-management';
import TableInfo from './TableInfo';
import Dialog from '../components/Dialog';
import Input from '../components/Input';
import { primaryDark, fontColorWhite } from '../util/colors';

const PodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

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

const items = [
  { value: 'Logs', href: 'logs' },
  { value: 'Edit', href: 'edit' },
  { value: 'Info', href: 'get' }
];

export default function Pods({ namespace }) {
  const { config } = useConfigContext();

  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const openDialog = item => {
    setShowDialog(true);
    setSelected(item);
  };
  const closeDialog = () => setShowDialog(false);

  return (
    <Fragment>
      <TableInfo title="Pods" namespace={namespace} command="get pods">
        {items =>
          config.listStyle === 'table' ? (
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Ready</th>
                  <th>Status</th>
                  <th>Restarts</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {items &&
                  items.map(({ metadata, status, spec }) => (
                    <tr
                      key={metadata.name}
                      onClick={() => openDialog(metadata.name)}
                    >
                      <td>
                        <a
                          href=""
                          onClick={event =>
                            event.preventDefault() && openDialog(metadata.name)
                          }
                        >
                          {metadata.name}
                        </a>
                      </td>
                      <td>{getContainersReady(spec, status)}</td>
                      <td>{status.phase}</td>
                      <td>{getContainersRestarts(status)}</td>
                      <td>{metadata.creationTimestamp}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <PodsGrid>
              {items &&
                items.map(({ metadata, status }) => (
                  <PodCard
                    key={metadata.name}
                    name={metadata.name}
                    state={status.phase}
                  />
                ))}
            </PodsGrid>
          )
        }
      </TableInfo>
      <Dialog
        isOpen={showDialog}
        onDismiss={closeDialog}
        title={selected}
        width="500px"
      >
        <DialogContainer>
          <Downshift
            onChange={selection =>
              selection
                ? navigate(
                    `/ui/${namespace}/pods/${selected}/${selection.href}`
                  )
                : onDismiss
            }
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
                <ModalSearch {...getInputProps({ placeholder: 'Search' })} />
                <ModalList {...getMenuProps()}>
                  {items
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
    </Fragment>
  );
}
