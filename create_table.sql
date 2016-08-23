DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short TEXT NOT NULL,
  desktop TEXT,
  mobile TEXT,
  tablet TEXT,
  desktopHits INTEGER,
  mobileHits INTEGER,
  tabletHits INTEGER,
  desktopRedirects INTEGER,
  mobileRedirects INTEGER,
  tabletRedirects INTEGER,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
