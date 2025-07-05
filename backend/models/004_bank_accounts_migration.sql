CREATE TABLE bank_accounts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  account_holder_name TEXT,
  account_number TEXT,
  routing_number TEXT,
  created_at DATETIME,
  FOREIGN KEY(user_id) REFERENCES users(id)
);