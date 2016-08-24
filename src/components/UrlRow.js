import React from 'react';

function UrlRow (url) {
  return (
    <tr key={url.id}>
      <td>{url.id}</td>
      <td>{url.desktopHits}&nbsp;/&nbsp;{url.desktopRedirects}</td>
      <td>{url.mobileHits}&nbsp;/&nbsp;{url.mobileRedirects}</td>
      <td>{url.tabletHits}&nbsp;/&nbsp;{url.tabletRedirects}</td>
    </tr>
  );
}

export default UrlRow;
