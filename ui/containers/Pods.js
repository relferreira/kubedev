import React, { useState, Fragment } from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';

import { useConfigContext } from '../state-management/config-management';
import PodCard from '../components/PodCard';
import Table from '../components/Table';
import {
  getContainersReady,
  getContainersRestarts
} from '../state-management/pod-management';
import TableInfo from './TableInfo';
import Button from '../components/Button';
import Dialog from '../components/Dialog';

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
          <Link to={`${selected}/logs`} tabIndex={1}>
            <Button tabIndex={-1}>Logs</Button>
          </Link>
          <Link to={`${selected}/edit`} tabIndex={1}>
            <Button tabIndex={-1}>Edit</Button>
          </Link>
          <Link to={`${selected}/get`} tabIndex={2}>
            <Button tabIndex={-1}>Info</Button>
          </Link>
        </DialogContainer>
      </Dialog>
    </Fragment>
  );
}
