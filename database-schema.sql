-- Enable UUID extension
create extension if not exists "uuid-ossp";

create table
  public.profile (
    id uuid not null,
    created_at timestamp with time zone not null default now(),
    display_name text null,
    email text null,
    dob date null,
    school text null,
    role text null,
    updated_at timestamp without time zone null default now(),
    is_profile_complete boolean null,
    constraint profile_pkey primary key (id),
    constraint profile_id_fkey foreign key (id) references auth.users (id)
  ) tablespace pg_default;

-- Create applications table
create table applications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profile(id) on delete cascade not null,
    -- Basic Info
    phone_number text,
    address text,
    citizenship text,
    is_student boolean,
    study_level text,
    graduation_year int,
    major text,
    -- Experience
    attended_mlh boolean,
    technical_skills text[],
    programming_languages text[],
    hackathon_experience boolean,
    hackathon_experience_desc text,
    -- Team & Goals
    has_team boolean,
    needs_teammates boolean,
    desired_teammate_skills text,
    goals text,
    heard_from text,
    -- Support Needs
    needs_sponsorship boolean,
    accessibility_needs boolean,
    accessibility_desc text,
    dietary_restrictions boolean,
    dietary_desc text,
    -- Emergency Contact
    emergency_contact_name text,
    emergency_contact_phone text,
    emergency_contact_relation text,
    -- Demographics
    tshirt_size text,
    ethnicity text[],
    underrepresented boolean,
    -- Status & Resume
    status text default 'Under Review' check (status in ('Under Review', 'Accepted', 'Rejected')),
    resume_url text,
    -- Agreements
    mlh_code_of_conduct boolean,
    mlh_data_sharing boolean,
    mlh_communications boolean,
    info_accurate boolean,
    understands_admission boolean,
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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