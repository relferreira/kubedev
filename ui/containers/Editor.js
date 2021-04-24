import React, { useState, useMemo, useEffect } from 'react';
import ControlledEditor, { DiffEditor } from '@monaco-editor/react';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import EditControl from '../components/EditControl';

const yaml = require('js-yaml');

function Editor(props) {
  const [text, setText] = useState('');
  const [original, setOriginal] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);

  const { data: response } = useSWR(
    props.type !== 'new'
      ? [props.namespace, `${props.action} ${props.type} ${props.name}`]
      : null,
    (namespace, command) =>
      kubectl.exec(
        namespace,
        command,
        props.action === 'describe' ? false : true
      ),
    { suspense: true }
  );

  const handleEditorWillMount = monaco => {
    monaco.editor.defineTheme('my-cool-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        {
          token: 'type',
          foreground: '4fc1ff'
        },
        {
          token: 'string.yaml',
          foreground: 'ce9178'
        }
      ],
      colors: { 'editor.background': '#1D1E24' }
    });
  };

  const handleDiff = () => {
    if (props.type === 'new') {
      handleSave();
      return;
    }

    setLoadingSave(true);
    kubectl
      .exec(props.namespace, `get ${props.type} ${props.name}`)
      .then(response => {
        const { data } = response || {};

        if (!data) return null;

        let value = yaml.safeDump(data);
        setOriginal(value);
        setLoadingSave(false);
      });
  };

  const handleSave = () => {
    setLoadingSave(true);
    kubectl
      .apply(props.namespace, { yaml: text })
      .then(() => {
        alert('Saved with succes');
        setOriginal('');
        setLoadingSave(false);
      })
      .catch(e => {
        //TODO improve error message
        console.error(e);
        setOriginal('');
        setLoadingSave(false);
      });
  };

  useMemo(() => {
    const { data } = response || {};

    if (!data) return null;

    let value = data.yaml ? data.yaml : yaml.safeDump(data);
    setText(value);
  }, []);

  const EditorComponent = original ? DiffEditor : ControlledEditor;

  return (
    <div
      style={{
        position: 'relative',
        margin: '-24px',
        height: 'calc(100vh - 49px)',
        overflow: 'hidden'
      }}
    >
      <EditorComponent
        height="100%"
        language="yaml"
        theme="my-cool-theme"
        original={original}
        modified={text}
        value={text}
        beforeMount={handleEditorWillMount}
        onChange={(value, e) => setText(value)}
      />

      {props.action !== 'describe' && (
        <EditControl
          onDiff={handleDiff}
          confirm={!!original}
          loading={loadingSave}
          onCancel={() => setOriginal('')}
          onConfirm={() => handleSave()}
        />
      )}
    </div>
  );
}

export default Editor;
