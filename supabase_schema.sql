-- Wklej to w Supabase > SQL Editor > New Query > Run

-- Tabela logow symulacji
create table if not exists logs (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  user_name text not null,
  module text not null,
  persona_name text not null,
  scenario text,
  total_score integer,
  summary text,
  best_moment text,
  worst_moment text,
  scores jsonb,
  transcript text
);

-- Tabela custom person (domyslne sa w kodzie aplikacji)
create table if not exists personas (
  id text primary key,
  created_at timestamptz default now(),
  name text not null,
  type text not null default 'B2B',
  difficulty integer default 3,
  tag text,
  prompt text,
  neg jsonb,
  clos jsonb
);

-- Wlacz Row Level Security (wymagane przez Supabase)
alter table logs enable row level security;
alter table personas enable row level security;

-- Pozwol na wszystko dla anon (brak logowania w aplikacji)
create policy "anon full access logs" on logs for all to anon using (true) with check (true);
create policy "anon full access personas" on personas for all to anon using (true) with check (true);
