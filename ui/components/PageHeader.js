import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Icon from './Icon';
import Input from './Input';

const PageHeaderContainer = styled.div`
  display: flex;
  align-items: center;

  h1 {
    flex: 1;
  }
`;

const RefreshIcon = styled(Icon)`
  margin-right: 5px;
`;

const PageHeader = ({
  title,
  showSearch,
  search,
  onSearch,
  onRefresh,
  children
}) => (
  <PageHeaderContainer>
    <h1>{title}</h1>
    {showSearch && (
      <Fragment>
        <RefreshIcon onClick={onRefresh}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </RefreshIcon>
        <Input
          value={search}
          placeholder="Search"
          onChange={event => onSearch(event.target.value)}
        />
      </Fragment>
    )}
    {children}
  </PageHeaderContainer>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showSearch: PropTypes.bool.isRequired,
  search: PropTypes.string,
  onSearch: PropTypes.func,
  onRefresh: PropTypes.func
};

PageHeader.defaultProps = {
  showSearch: false
};

export default PageHeader;
