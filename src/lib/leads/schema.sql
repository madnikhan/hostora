CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  status TEXT NOT NULL,
  source TEXT NOT NULL,
  inquiry_type TEXT NOT NULL DEFAULT 'hospitality',
  assignee TEXT NOT NULL,
  company_name TEXT NOT NULL,
  demo_start TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS leads_email_lower_idx ON leads (LOWER(email));
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_inquiry_type_idx ON leads (inquiry_type);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_tawk_chat_id_idx ON leads ((data->>'tawkChatId'));
