import React, { Fragment, useState } from 'react';
import styled from '@emotion/styled';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/yaml';
import 'brace/theme/dracula';

import * as kubectl from '../kubectl';
import EditControl from '../components/EditControl';
import Button from '../components/Button';

const yaml = require('js-yaml');

const EditorContainer = styled.div`
  position: relative;
  height: 100%;
`;

function Editor(props) {
  const [text, setText] = useState('');
  if (props.type !== 'new') {
    const { response, loading, query } = kubectl.exec(
      props.namespace,
      `get ${props.type} ${props.name}`,
      (err, response) => {
        if (response) {
          const { data } = response || {};

          if (!data) return null;

          let value = yaml.safeDump(data);
          value += `\n\n\n`; //TODO HACK
          setText(value);
        }
      }
    );

    if (loading) return <div>Loading...</div>;
  }

  const handleSave = () => {
    let json = yaml.safeLoad(text);
    kubectl.apply(props.namespace, json).then(() => alert('Saved with succes'));
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
        }}
      />
      <EditControl onSave={handleSave} />
    </EditorContainer>
  );
}

export default Editor;
