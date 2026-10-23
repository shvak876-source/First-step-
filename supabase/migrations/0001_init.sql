-- =====================================================================
--  הצעד הראשון – סכמת מסד הנתונים
--  להרצה ב-Supabase: SQL Editor → New query → להדביק ולהריץ.
-- =====================================================================

-- ---------- פרופילים ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  age_confirmed_at timestamptz,
  -- הסכמה לדיוור (חוק התקשורת, סעיף 30א) – ברירת מחדל: לא
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- יצירת פרופיל אוטומטית בהרשמה (השם ואישור הגיל מגיעים מ-user_metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, age_confirmed_at, marketing_opt_in)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    case when (new.raw_user_meta_data ->> 'age_confirmed') = 'true' then now() else null end,
    coalesce((new.raw_user_meta_data ->> 'marketing_opt_in') = 'true', false)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- רכישות ----------
-- נכתבות רק מהשרת (webhook) עם service role. המשתמש יכול רק לקרוא את שלו.
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null default 'stripe',
  provider_session_id text not null unique,
  provider_payment_id text,
  amount_agorot integer not null,
  currency text not null default 'ILS',
  status text not null check (status in ('paid', 'refunded')),
  customer_email text,
  customer_name text,
  terms_version text not null,
  terms_accepted_at timestamptz not null,
  receipt_url text,
  invoice_number text,
  invoice_url text,
  refunded_at timestamptz,
  -- מתי נשלח ללקוח מסמך פרטי העסקה באימייל
  order_email_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists purchases_user_id_idx on public.purchases (user_id);
create index if not exists purchases_payment_id_idx on public.purchases (provider_payment_id);

alter table public.purchases enable row level security;

create policy "purchases: read own" on public.purchases
  for select using (auth.uid() = user_id);

-- ---------- התקדמות בשיעורים ----------
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

alter table public.lesson_progress enable row level security;

create policy "progress: read own" on public.lesson_progress
  for select using (auth.uid() = user_id);

create policy "progress: insert own" on public.lesson_progress
  for insert with check (auth.uid() = user_id);

create policy "progress: delete own" on public.lesson_progress
  for delete using (auth.uid() = user_id);

-- ---------- תיעוד צפייה ראשונה בשיעור ----------
-- משמש לבחינת בקשות ביטול (האם נצפה תוכן דיגיטלי) – ראו מדיניות הביטול.
create table if not exists public.lesson_views (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_slug text not null,
  first_viewed_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

alter table public.lesson_views enable row level security;

create policy "views: read own" on public.lesson_views
  for select using (auth.uid() = user_id);

create policy "views: insert own" on public.lesson_views
  for insert with check (auth.uid() = user_id);

-- ---------- בקשות ביטול עסקה ----------
-- הודעת ביטול דרך האתר (חוק הגנת הצרכן מחייב לאפשר ביטול באותה דרך שבה בוצעה ההזמנה).
create table if not exists public.cancellation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  purchase_id uuid not null references public.purchases (id) on delete cascade,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'refunded')),
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

alter table public.cancellation_requests enable row level security;

create policy "cancellations: read own" on public.cancellation_requests
  for select using (auth.uid() = user_id);

create policy "cancellations: insert own" on public.cancellation_requests
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.purchases p where p.id = purchase_id and p.user_id = auth.uid())
  );

-- ---------- אחסון סרטונים ----------
-- bucket פרטי. אין policies למשתמשים – קישורים חתומים נוצרים רק בשרת
-- (service role) אחרי בדיקה שהמשתמש רכש את הקורס.
insert into storage.buckets (id, name, public)
values ('course-videos', 'course-videos', false)
on conflict (id) do nothing;
