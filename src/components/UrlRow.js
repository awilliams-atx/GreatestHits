import React from 'react';

function UrlRow (row) {
  return (
    <tr key={row.id}>
      <td>{row.id}</td>
      <td>{row.desktopHits}</td>
      <td>{row.mobileHits}</td>
      <td>{row.tabletHits}</td>
    </tr>
  );
}

export default UrlRow;
