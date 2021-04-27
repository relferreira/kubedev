import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  Fragment,
  useCallback
} from 'react';
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
import {
  EuiPopover,
  EuiText,
  EuiHeaderSectionItemButton,
  EuiAvatar,
  EuiHeader,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiSelectable,
  EuiSelectableTemplateSitewide,
  EuiSelectableMessage,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiBadge,
  EuiFieldSearch,
  EuiSearchBar
} from '@elastic/eui';
import * as kubectl from '../kubectl';
import useSWR from 'swr';
import SearchBar from '../components/SearchBar';
import SearchDialog from '../components/SearchDialog';

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

export default function Header({ location, onContextChange }) {
  const [searchDate, setSearchDate] = useState(new Date());
  const [historyDate, setHistoryDate] = useState(new Date());
  const [search, setSearch] = useState('api');
  const [searchInput, setSearchInput] = useState('');
  const [namespace, setNamespace] = useState('');
  const [type, setType] = useState('pods');
  const [focus, setFocus] = useState(false);
  const [historyMode, setHistoryMode] = useState(false);
  const [history, setHistory] = useState([]);
  const { result } = useWorker(worker, searchDate);
  // const [inputRef, setInputRef] = useState(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selected, setSelected] = useState({});
  const { data: response, revalidate, isValidating } = useSWR(
    ['default', 'config view'],
    kubectl.exec,
    { revalidateOnFocus: false, suspense: false }
  );

  // const measuredRef = useCallback(input => {
  //   if (input !== null) {
  //     inputRef.current = input;
  //   }
  // }, []);

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
    // inputRef.current.blur();
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
    buttonRef.current.click();
    if (inputRef && inputRef.current) {
      console.log(inputRef.current);
      inputRef.current.props.onFocus();
    }
    // inputRef.current.focus();
    // if (keyName === 'command+shift+k' || keyName === 'ctrl+shift+k') {
    //   setSearchInput(`kubectl -n ${getSelectedNamespace(location)} `);
    // } else if (keyName === 'command+shift+y' || keyName === 'ctrl+shift+y') {
    //   resetInput();
    //   setHistoryMode(true);
    // } else {
    //   resetInput();
    // }
  };

  const handleSelect = items => {
    let selection = items.find(item => item.checked === 'on');

    setSelected(selection);
    popoverRef.current.closePopover();
    setShowDialog(true);

    let {
      namespace = getSelectedNamespace(location),
      type,
      name,
      action
    } = formatSearchCommand(searchInput);

    namespace = selection ? selection.namespace : namespace;
    type = selection ? selection.type : type;
    let path = `/ui/${namespace}/${type}`;

    name = selection ? selection.name : name;

    if (selection && !action) action = 'edit';

    if (name && action) {
      path = `${path}/${name}/${action}`;
    }

    // navigate(path);

    if (selection) {
      let searchArgs = searchInput.split(' ');
      searchArgs = searchArgs.slice(0, searchArgs.length - 1);
      searchArgs.push(name);
      setSearchInput(searchArgs.join(' '));
    }

    let search = selection && selection.search ? selection.search : searchInput;
    addHistory({ namespace, type, name, action, search });
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleCommandIconClick = () => handleShortcut('command+shift+k');

  const handleHistoryIconClick = () => handleShortcut('command+shift+y');

  const handleAddIconClick = () =>
    navigate(`/ui/${getSelectedNamespace(location)}/new`);

  const handleInputKeyDown = event => {
    if (event.key === 'Escape') {
      event.nativeEvent.preventDownshiftDefault = true;
      resetInput();
      handleBlur();
    }
  };

  const handleContextSwitch = items => {
    let item = items.find(item => item.checked === 'on');
    kubectl
      .exec('default', `config use-context ${item.name}`, false)
      .then(() => kubectl.refreshContext())
      .then(() => {
        revalidate();
        setIsUserMenuVisible(false);
        onContextChange();
        navigate(`/ui`);
        setSearchDate(new Date());
      })
      .catch(console.error);
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

  return (
    <EuiHeader position="fixed">
      <EuiHeaderSection>
        <EuiHeaderSectionItemButton>
          <svg
            width="30"
            height="50"
            viewBox="0 0 30 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: '30px' }}
          >
            <path
              d="M2.76113 22.7864L6.91373 13.658L19.6839 40.8717L15.5313 50L2.76113 22.7864Z"
              fill="#9BE7FF"
            />
            <path
              d="M18.9256 30.458L28.6004 33.0977L15.8302 5.88402L6.15537 3.24431L18.9256 30.458Z"
              fill="#64B5F6"
            />
          </svg>
        </EuiHeaderSectionItemButton>
        <EuiHeaderSectionItem border="none">
          <span className="euiHeaderLogo__text" style={{ paddingLeft: 0 }}>
            KubeDev
          </span>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>

      <EuiHeaderSection side="right">
        <EuiHeaderSectionItem>
          <Hotkeys
            keyName="ctrl+k,ctrl+shift+k,ctrl+shift+y,command+k,command+shift+k,command+shift+y"
            onKeyUp={handleShortcut}
          >
            <EuiSelectableTemplateSitewide
              options={searchItems}
              onChange={handleSelect}
              // isPreFiltered={true}
              searchProps={{
                compressed: true
                // inputRef: measuredRef,
                // incremental: true,
                // value: search,
                // onChange: event =>
                //   console.log('oi') || setSearch(event.target.value)
                // onSearch: value => setSearch(value)
              }}
              popoverProps={{
                initialFocus: 'input[type=search]',
                hasArrow: false,
                ownFocus: true,
                ref: popoverRef
              }}
              popoverButton={
                <EuiHeaderSectionItemButton
                  aria-label="Sitewide search"
                  ref={buttonRef}
                >
                  <EuiIcon type="search" size="m" />
                </EuiHeaderSectionItemButton>
              }
              popoverFooter={
                <EuiText color="subdued" size="xs">
                  <EuiFlexGroup
                    alignItems="center"
                    gutterSize="s"
                    responsive={false}
                    wrap
                  >
                    <EuiFlexItem />
                    <EuiFlexItem grow={false}>Quickly search using</EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiBadge>Command + K</EuiBadge>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiText>
              }
            />
          </Hotkeys>
        </EuiHeaderSectionItem>
        <EuiHeaderSectionItem>
          <EuiPopover
            id="guideHeaderUserMenuExample"
            repositionOnScroll
            hasArrow={false}
            button={
              <EuiHeaderSectionItemButton
                aria-controls="guideHeaderSpacesMenuExample"
                aria-expanded={isUserMenuVisible}
                aria-haspopup="true"
                aria-label="Spaces menu"
                onClick={() => setIsUserMenuVisible(!isUserMenuVisible)}
              >
                <EuiAvatar
                  type="space"
                  name={
                    response &&
                    response.data &&
                    response.data['current-context']
                      ? response.data['current-context']
                          .replace(/-|_/, ' ')
                          .replace('k8s', '')
                          .split('')
                          .join(' ')
                          .toUpperCase()
                      : ''
                  }
                  initialsLength={2}
                  size="s"
                />
              </EuiHeaderSectionItemButton>
            }
            isOpen={isUserMenuVisible}
            anchorPosition="downRight"
            closePopover={() => setIsUserMenuVisible(false)}
          >
            {response && response.data && response.data.contexts && (
              <EuiSelectable
                aria-label="Single selection example"
                options={response.data.contexts.map(item => ({
                  label: item.name,
                  ...item
                }))}
                searchable={true}
                onChange={handleContextSwitch}
                singleSelection={true}
                listProps={{ bordered: true }}
                // isLoading={loading}
              >
                {(list, search) => (
                  <Fragment>
                    {search}
                    {list}
                  </Fragment>
                )}
              </EuiSelectable>
            )}
          </EuiPopover>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
      <SearchDialog
        isOpen={showDialog}
        onDismiss={closeDialog}
        dialogItems={[
          { value: 'Edit', type: selected.type, href: 'edit' },
          { value: 'Describe', type: selected.type, href: 'describe' }
        ]}
        selected={selected.name}
        // loading={dialogLoading}
        // data={data}
      />
    </EuiHeader>
  );
}
