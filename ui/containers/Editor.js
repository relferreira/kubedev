import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import AceEditor from 'react-ace';
import useSWR from 'swr';

import 'brace/mode/yaml';
import 'brace/theme/dracula';

import * as kubectl from '../kubectl';
import EditControl from '../components/EditControl';

const yaml = require('js-yaml');

const EditorContainer = styled.div`
  position: relative;
  height: 100%;
`;

function Editor(props) {
  const [text, setText] = useState('');
  const { data: response } = useSWR(
    props.type !== 'new'
      ? [props.namespace, `get ${props.type} ${props.name}`]
      : null,
    kubectl.exec,
    { suspense: true }
  );

  const handleSave = () => {
    let json = yaml.safeLoad(text);
    kubectl.apply(props.namespace, json).then(() => alert('Saved with succes'));
  };

  useMemo(() => {
    const { data } = response || {};

    if (!data) return null;

    let value = yaml.safeDump(data);
    value += `\n\n\n`; //TODO HACK
    setText(value);
  }, []);

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
