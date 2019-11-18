import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { ControlledEditor, DiffEditor } from '@monaco-editor/react';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import EditControl from '../components/EditControl';

const yaml = require('js-yaml');

const EditorContainer = styled.div`
  position: relative;
  height: 100%;
`;

function Editor(props) {
  const [text, setText] = useState('');
  const [original, setOriginal] = useState('');
  const { data: response } = useSWR(
    props.type !== 'new'
      ? [props.namespace, `get ${props.type} ${props.name}`]
      : null,
    kubectl.exec,
    { suspense: true }
  );

  const handleDiff = () => {
    if (props.type == 'new') {
      handleSave();
      return;
    }

    kubectl
      .exec(props.namespace, `get ${props.type} ${props.name}`)
      .then(response => {
        const { data } = response || {};

        if (!data) return null;

        let value = yaml.safeDump(data);
        setOriginal(value);
      });
  };

  const handleSave = () => {
    let json = yaml.safeLoad(text);
    kubectl.apply(props.namespace, json).then(() => {
      alert('Saved with succes');
      setOriginal('');
    });
  };

  useMemo(() => {
    const { data } = response || {};

    if (!data) return null;

    let value = yaml.safeDump(data);
    setText(value);
  }, []);

  const EditorComponent = original ? DiffEditor : ControlledEditor;

  return (
    <EditorContainer>
      <EditorComponent
        height="100%"
        language="yaml"
        theme="vs-dark"
        original={original}
        modified={text}
        value={text}
        onChange={(ev, value) => setText(value)}
      />
      <EditControl
        onDiff={handleDiff}
        confirm={!!original}
        onCancel={() => setOriginal('')}
        onConfirm={() => handleSave()}
      />
    </EditorContainer>
  );
}

export default Editor;
