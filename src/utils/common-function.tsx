export const groupByKey = (array, key): Object => {
  return array ? array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {}) : {};
};

export const convertLongString = (string: string, firstLength: number = 500, lastLength: number = 0) => {
  if (!string) return ''
  if (string.length < firstLength) return string
  return `${string.substr(0, firstLength)}...${string.substr(string.length - lastLength, string.length)}`
}

export const _sortArray = (array, attributeToSort, ascSort = true, typeValue = "Number") => {
  return array.sort((a, b) => {
    if (typeValue === "Date") {
      const aValue = new Date(a[attributeToSort])
      const bValue = new Date(b[attributeToSort])
      const sortValue = aValue > bValue ? 1 : aValue === bValue ? 0 : -1
      return ascSort ? sortValue : -sortValue;
    } else {
      const sortValue = a[attributeToSort] - b[attributeToSort]
      return ascSort ? sortValue : -sortValue;
    }
  });
};