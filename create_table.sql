DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short TEXT NOT NULL,
  desktop TEXT,
  mobile TEXT,
  tablet TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

INSERT INTO urls (short, desktop, mobile, tablet, createdAt, updatedAt)
VALUES ('a', 'b', 'c', 'd', datetime(), datetime());
