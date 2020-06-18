import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useWorker } from 'react-hooks-worker';
import Downshift from 'downshift';
import Fuse from 'fuse.js';
import { navigate, Link } from '@reach/router';
import Hotkeys from 'react-hot-keys';

import { primaryDark, fontColorWhite } from '../util/colors';
import Input from '../components/Input';
import {
  formatSearchResponse,
  getSelectedNamespace,
  formatSearchCommand,
  shouldRefreshSearch,
  isSearchCommand
} from '../state-management/general-managements';
import Icon from '../components/Icon';
import { addHistory, getHistory } from '../state-management/history-management';
import CustomTooltip from '../components/CustomTooltip';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 60px;
  padding: 16px;
  background: ${props => props.theme.header};
  color: white;
  box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.1), 0 0.1rem 0.8rem rgba(0, 0, 0, 0.2);
  overflow: inherit;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 204px;
  height: 100%;
`;

const Image = styled.svg`
  height: 100%;
`;

const Title = styled.h1`
  margin-left: 16px;
  font-size: 24px;
`;

const InputContainer = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: ${({ focus }) => (focus ? '90%' : '500px')};
  border-radius: 3px;
  background: ${props => props.theme.background};

  box-shadow: ${({ focus }) =>
    focus ? '0px 2px 2px rgba(0, 0, 0, 0.25)' : null};

  input {
    width: 100%;
    height: 40px;
    padding: 16px;
    border: none;
    background: transparent;
    color: ${props => props.theme.sidebarFontColor};
    outline: none;
  }

  svg {
    margin-left: 7px;
    fill: ${props => props.theme.sidebarFontColor};
    opacity: 0.54;
  }
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
`;

const AutoCompleteContainer = styled.div`
  flex: 1;
  z-index: 1;
`;

const AutoComplete = styled.div`
  position: absolute;
  width: 100%;
  max-height: 500px;
  top: 38px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.sidebarFontColor};
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  overflow: auto;
`;

const SearchItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: ${props =>
    props.highlighted ? primaryDark : props.theme.background};
  color: ${props =>
    props.highlighted ? fontColorWhite : props.theme.sidebarFontColor};
  font-size: 14px;

  span {
    font-size: 12px;
  }
`;

const Backdrop = styled.div`
  display: ${props => (props.show ? 'inherit' : 'none')};
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.8;
`;

const HeaderIcon = styled(Icon)`
  margin-left: 16px;
  fill: ${props => props.theme.headerIcon};
`;

const worker = new Worker('../workers/search.js');

export default function Header({ location }) {
  const [searchDate, setSearchDate] = useState(new Date());
  const [historyDate, setHistoryDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [namespace, setNamespace] = useState('');
  const [type, setType] = useState('pods');
  const [focus, setFocus] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);
  const [history, setHistory] = useState([]);
  const { result } = useWorker(worker, searchDate);
  const inputRef = useRef(null);

  useEffect(() => {
    setHistory(getHistory());
  }, [historyDate]);

  const handleFocus = () => {
    setFocus(true);

    let date = new Date();
    setHistoryDate(date);
    if (!result || shouldRefreshSearch(result.id)) setSearchDate(date);
  };

  const handleBlur = () => {
    inputRef.current.blur();
    setFocus(false);
    setHistoryMode(false);
  };

  const handleSearchInput = event => {
    let search = event.target.value;
    setSearchInput(search);
    let { namespace, type, name = null } = formatSearchCommand(search);

    setNamespace(namespace);
    setType(type);

    setSearch(name || search);
  };

  const handleShortcut = keyName => {
    inputRef.current.focus();
    if (keyName === 'command+shift+k' || keyName === 'ctrl+shift+k') {
      setSearchInput(`kubectl -n ${getSelectedNamespace(location)} `);
    } else if (keyName === 'command+shift+y' || keyName === 'ctrl+shift+y') {
      resetInput();
      setHistoryMode(true);
    } else {
      resetInput();
    }
  };

  const handleSelect = selection => {
    inputRef.current.blur();

    let {
      namespace = getSelectedNamespace(location),
      type,
      name,
      action
    } = formatSearchCommand(searchInput);

    namespace = selection ? selection.namespace : namespace;
    type = selection ? selection.type : type;
    let path = `/${namespace}/${type}`;

    name = selection ? selection.name : name;

    if (selection && !action) action = 'get';

    if (name && action) {
      path = `${path}/${name}/${action}`;
    }

    navigate(path);

    if (selection) {
      let searchArgs = searchInput.split(' ');
      searchArgs = searchArgs.slice(0, searchArgs.length - 1);
      searchArgs.push(name);
      setSearchInput(searchArgs.join(' '));
    }

    let search = selection && selection.search ? selection.search : searchInput;
    addHistory({ namespace, type, name, action, search });
  };

  const handleCommandIconClick = () => handleShortcut('command+shift+k');

  const handleHistoryIconClick = () => handleShortcut('command+shift+y');

  const handleInputKeyDown = event => {
    if (event.key === 'Escape') {
      event.nativeEvent.preventDownshiftDefault = true;
      resetInput();
      handleBlur();
    }
  };

  const resetInput = () => {
    setSearchInput('');
    setSearch('');
    setNamespace('');
    setType('');
  };

  const items = useMemo(() => formatSearchResponse(result, namespace, type), [
    result && result.id,
    namespace,
    type
  ]);

  let searchItems = historyMode ? history : items;

  let fuse = new Fuse(searchItems, {
    keys: ['type', 'namespace', 'name']
  });

  let searchResults = fuse.search(search, { limit: 10 });

  if (historyMode && searchResults.length === 0) searchResults = history;

  return (
    <Hotkeys
      keyName="ctrl+k,ctrl+shift+k,ctrl+shift+y,command+k,command+shift+k,command+shift+y"
      onKeyUp={handleShortcut}
    >
      <HeaderContainer>
        <LogoContainer>
          <Image
            width="29"
            height="50"
            viewBox="0 0 29 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.76113 22.7864L6.91373 13.658L19.6839 40.8717L15.5313 50L2.76113 22.7864Z"
              fill="#9BE7FF"
            />
            <path
              d="M18.9256 30.458L28.6004 33.0977L15.8302 5.88402L6.15537 3.24431L18.9256 30.458Z"
              fill="#64B5F6"
            />
          </Image>

          <Title>KubeDev</Title>
        </LogoContainer>

        <Backdrop show={focus} />
        <AutoCompleteContainer>
          <Downshift
            onChange={handleSelect}
            itemToString={item => (item ? item.name : '')}
          >
            {({
              getInputProps,
              getItemProps,
              getLabelProps,
              highlightedIndex,
              selectedItem
            }) => (
              <div>
                <InputContainer
                  focus={focus}
                  onSubmit={event => {
                    event.preventDefault();
                    handleSelect();
                  }}
                >
                  <SearchIcon {...getLabelProps({ 'aria-label': 'search' })}>
                    {!isSearchCommand(searchInput) && !historyMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        <path d="M0 0h24v24H0z" fill="none" />
                      </svg>
                    ) : !historyMode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        <path fill="none" d="M0 0h24v24H0V0z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                      </svg>
                    )}
                  </SearchIcon>
                  <Input
                    {...getInputProps({
                      placeholder: 'Search',
                      onFocus: handleFocus,
                      onBlur: handleBlur,
                      value: searchInput,
                      onChange: handleSearchInput,
                      onKeyDown: handleInputKeyDown
                    })}
                    ref={inputRef}
                  />
                  {focus ? (
                    <AutoComplete>
                      {searchResults.map((item, index) => (
                        <SearchItem
                          {...getItemProps({
                            key: `${item.type}-${item.namespace}-${item.name}`,
                            index,
                            item,
                            highlighted: highlightedIndex === index,
                            selected: selectedItem === item
                          })}
                        >
                          <strong>{item.name || item.search}</strong>
                          <span>
                            {item.namespace} - {item.type}
                          </span>
                        </SearchItem>
                      ))}
                    </AutoComplete>
                  ) : null}
                </InputContainer>
              </div>
            )}
          </Downshift>
        </AutoCompleteContainer>
        <CustomTooltip label="History">
          <HeaderIcon onClick={handleHistoryIconClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
          </HeaderIcon>
        </CustomTooltip>
        <CustomTooltip label="Run Command">
          <HeaderIcon onClick={handleCommandIconClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              <path fill="none" d="M0 0h24v24H0V0z" />
            </svg>
          </HeaderIcon>
        </CustomTooltip>
        <CustomTooltip label="New Resource">
          <Link to={`${getSelectedNamespace(location)}/new`}>
            <HeaderIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </HeaderIcon>
          </Link>
        </CustomTooltip>
      </HeaderContainer>
    </Hotkeys>
  );
}
