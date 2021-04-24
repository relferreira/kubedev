import React, { Fragment, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import Hotkeys from 'react-hot-keys';
import { EuiFieldSearch, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import { useConfigContext } from '../state-management/config-management';

const PageHeader = ({
  title,
  showSearch,
  search,
  showToggleList,
  onSearch,
  onRefresh,
  onBlur,
  children
}) => {
  const { config, changeConfig } = useConfigContext();
  const inputRef = useRef(null);

  const handleListStyleChange = () =>
    changeConfig({ listStyle: config.listStyle === 'grid' ? 'table' : 'grid' });

  const measuredRef = useCallback(input => {
    if (input !== null) {
      inputRef.current = input;
    }
  }, []);

  return (
    <div>
      <h1>{title}</h1>
      {showSearch && (
        <Fragment>
          <Hotkeys
            keyName="ctrl+shift+f,command+shift+f"
            onKeyUp={() => inputRef.current.focus()}
          >
            <EuiFlexGroup direction="row" alignItems="center">
              <EuiFlexItem>
                <EuiFieldSearch
                  type="text"
                  placeholder="Search"
                  fullWidth={true}
                  isClearable={true}
                  incremental={true}
                  append="ctrl+shift+f"
                  value={search}
                  onChange={event => onSearch(event.target.value)}
                  onSearch={event => onSearch(event)}
                  inputRef={measuredRef}
                  onKeyDown={event => {
                    if (event.key === 'Escape' || event.key === 'ArrowDown') {
                      inputRef.current.blur();
                    }
                  }}
                />
              </EuiFlexItem>
              {/* <EuiFlexItem grow={false}>
                <EuiFlexGroup direction="row">{children}</EuiFlexGroup>
              </EuiFlexItem> */}
            </EuiFlexGroup>
          </Hotkeys>
        </Fragment>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showSearch: PropTypes.bool.isRequired,
  search: PropTypes.string,
  showToggleList: PropTypes.bool,
  onSearch: PropTypes.func,
  onRefresh: PropTypes.func
};

PageHeader.defaultProps = {
  showSearch: false,
  showToggleList: true
};

export default PageHeader;
