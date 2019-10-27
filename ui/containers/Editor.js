import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/yaml';
import 'brace/theme/dracula';
import EditControl from '../components/EditControl';

const yaml = require('js-yaml');

const EditorContainer = styled.div`
  position: relative;
  height: 100%;
`;

function Editor({}) {
  let info = {
    metadata: {
      name: 'operations-api',
      namespace: 'operations',
      selfLink:
        '/apis/apps/v1beta2/namespaces/operations/deployments/operations-api',
      uid: '27f29d2d-e607-11e9-b551-f62a59a78b84',
      resourceVersion: '23938485',
      generation: 4,
      creationTimestamp: '2019-10-03T17:56:42Z',
      labels: {
        app: 'operations-api'
      },
      annotations: {
        'deployment.kubernetes.io/revision': '3',
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"apps/v1beta1","kind":"Deployment","metadata":{"annotations":{},"name":"operations-api","namespace":"operations"},"spec":{"replicas":1,"template":{"metadata":{"labels":{"app":"operations-api"}},"spec":{"containers":[{"env":[{"name":"OMNI_ENV","value":"prd"},{"name":"METAINFOAPI_URL","value":"http://10.0.0.111"},{"name":"SERVICEBUS_NAMESPACE_METAINFO","value":"omni-meta-info-bus"},{"name":"SERVICEBUS_SAS_KEY_METAINFO","value":"RootManageSharedAccessKey"},{"name":"SERVICEBUS_SAS_VALUE_METAINFO","valueFrom":{"secretKeyRef":{"key":"SERVICEBUS_SAS_VALUE_METAINFO","name":"integrations-secret"}}},{"name":"MONGO_HOST","value":"mongodb://panthera-b.2xvkcf4ni2puzpn0pjqb51zvzc.bx.internal.cloudapp.net:27017"},{"name":"MONGO_DB","value":"modeling"},{"name":"ES_HOST","value":"10.0.0.211"},{"name":"ES_PORT","value":"9200"},{"name":"EXTRACTIONAPI_URL","value":"http://extraction-api.api.svc.cluster.local"},{"name":"ML_BINARY_API","value":"http://api-ml-binary-book-classifier.api.svc.cluster.local"},{"name":"ML_BOOK_GENRE_API","value":"http://api-ml-book-genre.api.svc.cluster.local"},{"name":"ML_ENTITY_API","value":"http://api-ml-entity-classifier.api.svc.cluster.local"},{"name":"ML_EMBEDDINGS_API","value":"http://api-embedding-word2vec.api.svc.cluster.local"}],"image":"omnilogic.azurecr.io/operations-api:v31","name":"operations-api","ports":[{"containerPort":8080}],"resources":{"limits":{"cpu":"1500m","memory":"3000Mi"},"requests":{"cpu":1,"memory":"1000Mi"}},"volumeMounts":[{"mountPath":"/opz/data","name":"operations-data"}]}],"volumes":[{"azureFile":{"readOnly":false,"secretName":"files-secret","shareName":"reports"},"name":"operations-data"}]}}}}\n',
        'kubernetes.io/change-cause':
          'kubectl set image deploy operations-api operations-api=omnilogic.azurecr.io/operations-api:v32 --record=true'
      }
    },
    spec: {
      replicas: 2,
      selector: {
        matchLabels: {
          app: 'operations-api'
        }
      },
      template: {
        metadata: {
          creationTimestamp: null,
          labels: {
            app: 'operations-api'
          }
        },
        spec: {
          volumes: [
            {
              name: 'operations-data',
              azureFile: {
                secretName: 'files-secret',
                shareName: 'reports'
              }
            }
          ],
          containers: [
            {
              name: 'operations-api',
              image: 'omnilogic.azurecr.io/operations-api:v32',
              ports: [
                {
                  containerPort: 8080,
                  protocol: 'TCP'
                }
              ],
              env: [
                {
                  name: 'OMNI_ENV',
                  value: 'prd'
                },
                {
                  name: 'METAINFOAPI_URL',
                  value: 'http://10.0.0.111'
                },
                {
                  name: 'SERVICEBUS_NAMESPACE_METAINFO',
                  value: 'omni-meta-info-bus'
                },
                {
                  name: 'SERVICEBUS_SAS_KEY_METAINFO',
                  value: 'RootManageSharedAccessKey'
                },
                {
                  name: 'SERVICEBUS_SAS_VALUE_METAINFO',
                  valueFrom: {
                    secretKeyRef: {
                      name: 'integrations-secret',
                      key: 'SERVICEBUS_SAS_VALUE_METAINFO'
                    }
                  }
                },
                {
                  name: 'MONGO_HOST',
                  value:
                    'mongodb://panthera-b.2xvkcf4ni2puzpn0pjqb51zvzc.bx.internal.cloudapp.net:27017'
                },
                {
                  name: 'MONGO_DB',
                  value: 'modeling'
                },
                {
                  name: 'ES_HOST',
                  value: '10.0.0.211'
                },
                {
                  name: 'ES_PORT',
                  value: '9200'
                },
                {
                  name: 'EXTRACTIONAPI_URL',
                  value: 'http://extraction-api.api.svc.cluster.local'
                },
                {
                  name: 'ML_BINARY_API',
                  value:
                    'http://api-ml-binary-book-classifier.api.svc.cluster.local'
                },
                {
                  name: 'ML_BOOK_GENRE_API',
                  value: 'http://api-ml-book-genre.api.svc.cluster.local'
                },
                {
                  name: 'ML_ENTITY_API',
                  value: 'http://api-ml-entity-classifier.api.svc.cluster.local'
                },
                {
                  name: 'ML_EMBEDDINGS_API',
                  value: 'http://api-embedding-word2vec.api.svc.cluster.local'
                }
              ],
              resources: {
                limits: {
                  cpu: '1500m',
                  memory: '3000Mi'
                },
                requests: {
                  cpu: '1',
                  memory: '1000Mi'
                }
              },
              volumeMounts: [
                {
                  name: 'operations-data',
                  mountPath: '/opz/data'
                }
              ],
              terminationMessagePath: '/dev/termination-log',
              terminationMessagePolicy: 'File',
              imagePullPolicy: 'IfNotPresent'
            }
          ],
          restartPolicy: 'Always',
          terminationGracePeriodSeconds: 30,
          dnsPolicy: 'ClusterFirst',
          securityContext: {},
          schedulerName: 'default-scheduler'
        }
      },
      strategy: {
        type: 'RollingUpdate',
        rollingUpdate: {
          maxUnavailable: '25%',
          maxSurge: '25%'
        }
      },
      revisionHistoryLimit: 2,
      progressDeadlineSeconds: 600
    },
    status: {
      observedGeneration: 4,
      replicas: 2,
      updatedReplicas: 2,
      readyReplicas: 2,
      availableReplicas: 2,
      conditions: [
        {
          type: 'Progressing',
          status: 'True',
          lastUpdateTime: '2019-10-07T22:50:11Z',
          lastTransitionTime: '2019-10-03T17:56:42Z',
          reason: 'NewReplicaSetAvailable',
          message:
            'ReplicaSet "operations-api-f5b9b5fc" has successfully progressed.'
        },
        {
          type: 'Available',
          status: 'True',
          lastUpdateTime: '2019-10-07T23:05:16Z',
          lastTransitionTime: '2019-10-07T23:05:16Z',
          reason: 'MinimumReplicasAvailable',
          message: 'Deployment has minimum availability.'
        }
      ]
    }
  };
  let value = yaml.safeDump(info);

  const handleSave = () => {};

  return (
    <EditorContainer>
      <AceEditor
        mode="yaml"
        theme="dracula"
        value={value}
        //   onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        style={{
          width: '100%',
          height: '100%'
          // margin: '-16px -16px -16px -16px'
        }}
      />
      <EditControl onSave={handleSave} />
    </EditorContainer>
  );
}

export default Editor;
