import React, { Fragment, useState } from 'react';
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

function Editor({ namespace, type, name }) {
  const [text, setText] = useState('');

  if (type !== 'new') {
    const { response, loading, query } = kubectl.get(
      'operations',
      'get deploy operations-api',
      (err, response) => {
        if (response) {
          const { data } = response || {};

          if (!data) return null;

          let value = yaml.safeDump(data);
          setText(value);
        }
      }
    );

    if (loading) return <div>Loading...</div>;
  }

  const handleSave = () => {
    let json = yaml.safeLoad(text);
    kubectl.apply(namespace, json).then(console.log);
  };

  return (
    <EditorContainer>
      <AceEditor
        mode="yaml"
        theme="dracula"
        value={text}
        onChange={value => setText(value)}
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
