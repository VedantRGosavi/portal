-- Enable UUID extension
create extension if not exists "uuid-ossp";

create table
  public.profile (
    id uuid not null,
    created_at timestamp with time zone not null default now(),
    display_name text null,
    email text null,
    school text null,
    role text null,
    age bigint null,
    updated_at timestamp without time zone null default now(),
    is_profile_complete boolean null,
    constraint profile_pkey primary key (id),
    constraint profile_id_fkey foreign key (id) references auth.users (id)
  ) tablespace pg_default;

-- Enable RLS on profile table
alter table profile enable row level security;

-- Create profile policies
create policy "Users can create their own profile"
  on profile for insert
  with check (auth.uid() = id);

create policy "Users can view own profile"
  on profile for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profile for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on profile for select
  using (
    exists (
      select 1 from profile
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all profiles"
  on profile for update
  using (
    exists (
      select 1 from profile
      where id = auth.uid() and role = 'admin'
    )
  );

create table
  public.applications (
    id uuid not null default extensions.uuid_generate_v4 (),
    user_id uuid not null,
    phone_number text null,
    address text null,
    citizenship text null,
    study_level text null,
    graduation_year integer null,
    major text null,
    attended_mlh boolean null,
    technical_skills text[] null,
    programming_languages text[] null,
    hackathon_experience boolean null,
    hackathon_experience_desc text null,
    has_team boolean null,
    needs_teammates boolean null,
    desired_teammate_skills text null,
    goals text null,
    heard_from text null,
    needs_sponsorship boolean null,
    accessibility_needs boolean null,
    accessibility_desc text null,
    dietary_restrictions boolean null,
    dietary_desc text null,
    emergency_contact_name text null,
    emergency_contact_phone text null,
    emergency_contact_relation text null,
    tshirt_size text null,
    ethnicity text[] null,
    underrepresented boolean null,
    status text null default 'Under Review'::text,
    resume_url text null,
    mlh_code_of_conduct boolean null,
    mlh_data_sharing boolean null,
    mlh_communications boolean null,
    info_accurate boolean null,
    understands_admission boolean null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    school text null,
    linkedin_url text null,
    github_url text null,
    portfolio_url text null,
    school_email text null,
    first_name text null,
    last_name text null,
    constraint applications_pkey primary key (id),
    constraint unique_user_application unique (user_id),
    constraint applications_user_id_fkey foreign key (user_id) references profile (id) on update cascade on delete cascade,
    constraint applications_status_check check (
      (
        status = any (
          array[
            'Draft'::text,
            'Under Review'::text,
            'Accepted'::text,
            'Rejected'::text
          ]
        )
      )
    )
  ) tablespace pg_default;

create index if not exists idx_applications_user_id on public.applications using btree (user_id) tablespace pg_default;

create trigger handle_applications_updated_at before
update on applications for each row
execute function handle_updated_at ();

-- Create RLS policies

-- Applications policies
alter table applications enable row level security;

create policy "Users can view own application"
    on applications for select
    using (auth.uid() = user_id);

create policy "Users can insert own application"
    on applications for insert
    with check (auth.uid() = user_id);

create policy "Users can update own application"
    on applications for update
    using (auth.uid() = user_id);

create policy "Admins can view all applications"
    on applications for select
    using (
        exists (
            select 1 from profile
            where id = auth.uid() and role = 'admin'
        )
    );

create policy "Admins can update all applications"
    on applications for update
    using (
        exists (
            select 1 from profile
            where id = auth.uid() and role = 'admin'
        )
    );

-- Create storage bucket for resumes
insert into storage.buckets (id, name, public) 
values ('resumes', 'resumes', false);

-- Storage policy for resumes
create policy "Users can upload their own resume"
    on storage.objects for insert
    with check (
        bucket_id = 'resumes' and 
        auth.uid()::text = (storage.foldername(name))[1]
    );

create policy "Users can update their own resume"
    on storage.objects for update
    using (
        bucket_id = 'resumes' and 
        auth.uid()::text = (storage.foldername(name))[1]
    );

create policy "Users can read their own resume"
    on storage.objects for select
    using (
        bucket_id = 'resumes' and 
        auth.uid()::text = (storage.foldername(name))[1]
    );

create policy "Admins can read all resumes"
    on storage.objects for select
    using (
        bucket_id = 'resumes' and
        exists (
            select 1 from profile
            where id = auth.uid() and role = 'admin'
        )
    );

-- Create function to handle updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
    before update on profile
    for each row
    execute function handle_updated_at();

create trigger handle_applications_updated_at
    before update on applications
    for each row
    execute function handle_updated_at();