import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/yaml';
import 'brace/theme/dracula';

import * as kubectl from '../kubectl';
import EditControl from '../components/EditControl';

const yaml = require('js-yaml');

const EditorContainer = styled.div`
  position: relative;
  height: 100%;
`;

function Editor({}) {
  const { response, loading, query } = kubectl.exec(
    'operations',
    'get deploy operations-api'
  );

  const { data } = response || {};

  if (loading) return <div>Loading...</div>;

  if (!data) return null;

  let value = yaml.safeDump(data);

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
