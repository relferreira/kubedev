export const filterSearch = (data, search) => {
  if (data && data.items) {
    return data.items.filter(({ metadata }) =>
      metadata.name.startsWith(search)
    );
  }
  return [];
};
