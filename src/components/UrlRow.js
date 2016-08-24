import React from 'react';

function UrlRow (row) {
  return (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.desktopHits}&nbsp;/&nbsp;{row.desktopRedirects}</td>
      <td>{row.mobileHits}&nbsp;/&nbsp;{row.mobileRedirects}</td>
      <td>{row.tabletHits}&nbsp;/&nbsp;{row.tabletRedirects}</td>
    </tr>
  );
}

export default UrlRow;
