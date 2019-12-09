import React, { useState, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import { useWorker } from 'react-hooks-worker';
import Downshift from 'downshift';
import Fuse from 'fuse.js';
import { navigate, Location, Link } from '@reach/router';
import Hotkeys from 'react-hot-keys';

import { primaryDark, fontColorWhite } from '../util/colors';
import logo from '../assets/logo.svg';
import Input from '../components/Input';
import {
  formatSearchResponse,
  getSelectedNamespace,
  getSearchType,
  getSearchAction,
  formatSearchCommand,
  shouldRefreshSearch,
  isSearchCommand
} from '../state-management/general-managements';
import Icon from '../components/Icon';

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

const Image = styled.img`
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
  top: 38px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.sidebarFontColor};
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  overflow: hidden;
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
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [namespace, setNamespace] = useState('');
  const [type, setType] = useState('pods');
  const [focus, setFocus] = useState(false);
  const { result, error } = useWorker(worker, searchDate);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setFocus(true);
    if (!result || shouldRefreshSearch(result.id)) setSearchDate(new Date());
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleSearchInput = event => {
    let search = event.target.value;
    setSearchInput(search);
    let { namespace, type, name = null } = formatSearchCommand(search);

    setNamespace(namespace);
    setType(type);

    setSearch(name || searchInput);
  };

  const handleShortcut = keyName => {
    inputRef.current.focus();
    if (keyName === 'command+shift+k' || keyName === 'ctrl+shift+k')
      setSearchInput(`kubectl -n ${getSelectedNamespace(location)} `);
    else setSearchInput('');
  };

  const handleSelect = selection => {
    inputRef.current.blur();

    let isCommand = isSearchCommand(searchInput);
    if (isCommand) {
      let { namespace = 'default', type, name, action } = formatSearchCommand(
        searchInput
      );
      namespace = selection ? selection.namespace : namespace;
      let path = `/${namespace}/${type}`;

      name = selection ? selection.name : name;
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
    } else if (selection) {
      let { type = 'get' } = formatSearchCommand(searchInput);

      navigate(
        `/${selection.namespace}/${selection.type}/${selection.name}/${type}`
      );
      setSearchInput(selection.name);
    }
  };

  const handleCommandIconClick = () => handleShortcut('command+shift+k');

  const items = useMemo(() => formatSearchResponse(result, namespace, type), [
    result && result.id,
    namespace,
    type
  ]);

  let fuse = new Fuse(items, {
    keys: ['type', 'namespace', 'name']
  });

  return (
    <Hotkeys
      keyName="ctrl+k,ctrl+shift+k,command+k,command+shift+k"
      onKeyUp={handleShortcut}
    >
      <HeaderContainer>
        <LogoContainer>
          <Image src={logo} alt="KubeDev logo" />
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
              isOpen,
              inputValue,
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
                    {!isSearchCommand(searchInput) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        <path d="M0 0h24v24H0z" fill="none" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                        <path fill="none" d="M0 0h24v24H0V0z" />
                      </svg>
                    )}
                  </SearchIcon>
                  <Input
                    {...getInputProps({
                      placeholder: 'Search',
                      onFocus: handleFocus,
                      onBlur: handleBlur,
                      value: searchInput,
                      onChange: handleSearchInput
                    })}
                    ref={inputRef}
                  />
                  {isOpen ? (
                    <AutoComplete>
                      {fuse.search(search, { limit: 10 }).map((item, index) => (
                        <SearchItem
                          {...getItemProps({
                            key: `${item.type}-${item.namespace}-${item.name}`,
                            index,
                            item,
                            highlighted: highlightedIndex === index,
                            selected: selectedItem === item
                          })}
                        >
                          <strong>{item.name}</strong>
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
      </HeaderContainer>
    </Hotkeys>
  );
}
