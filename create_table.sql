DROP TABLE IF EXISTS urls;

CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  long TEXT NOT NULL,
  desktop TEXT,
  mobile TEXT,
  tablet TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

INSERT INTO urls (long, desktop, mobile, tablet, createdAt, updatedAt)
VALUES ('a', 'b', 'c', 'd', datetime(), datetime());
