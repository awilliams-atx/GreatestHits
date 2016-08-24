export function sortByMetric (urls, metric, direction) {
  if (direction) {
    return urls.sort((a, b) => {
      return b.attributes[metric] - a.attributes[metric];
    });
  } else {
    return urls.sort((a, b) => {
      return a.attributes[metric] - b.attributes[metric];
    });
  }
};
