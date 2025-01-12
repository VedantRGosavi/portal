Below is a concise plan.md-style document that outlines tasks for the Backend Developer (Supabase) and the Frontend Developer (Next.js + TailwindCSS + shadcn UI). This plan captures all the core steps without including actual code, but it provides enough detail so each developer knows exactly what to do.

Plan for RocketHacks Application Portal

1. Overview
	•	Goal: Build a simple hackathon application portal (called RocketHacks) where participants:
	1.	Sign up / log in via email.
	2.	Provide basic profile data on first sign-in (Full Name, Email, University/School, DOB).
	3.	Complete a multi-step application form (questions + resume PDF upload).
	4.	Save the form and/or Submit it, tracking status as “Under Review,” “Accepted,” or “Rejected.”
	•	Admin Side: Admins can log in to review applications in a simple dashboard with sorting/filtering and status updates.
	•	Tech Stack:
	•	Frontend: Next.js (TypeScript), TailwindCSS, shadcn UI, Deployed on Vercel.
	•	Backend: Supabase (Database, Auth, Storage).
	•	Auth: Supabase Auth (email-based signup and login, optional Google/GitHub if desired).
	•	Storage: Supabase Storage for resume PDFs.
	•	Design: Modern, minimal, responsive (mobile, tablet, desktop). Primary colors: space black, light blue (#005CB9), gold (#FFDA00).

2. Backend Developer Tasks (Supabase)
	1.	Create Supabase Project
	•	Set up a new project in the Supabase dashboard.
	•	Note the SUPABASE_URL and ANON_KEY.
	2.	Database Schema
	•	profiles table:
	•	Columns for user_id (UUID, references auth.users), full_name, dob, school, role (default 'applicant'), created_at.
	•	Use role to differentiate admin vs. applicant.
	•	applications table:
	•	Columns to store all application form fields (e.g., phone number, address, question responses, etc.).
	•	A status column with default 'Under Review'.
	•	resume_url for storing the path to the uploaded resume.
	•	Timestamps (created_at, updated_at).
	3.	Row-Level Security (RLS) Policies
	•	Enable RLS on both profiles and applications.
	•	Create a policy so that:
	•	Normal users can only select/insert/update rows where user_id = their own Supabase auth.user().id.
	•	Admins (where role='admin' in profiles) can read and update all rows.
	4.	Auth Configuration
	•	In Supabase Auth settings, enable email confirmations so users must verify via a magic link.
	•	(Optional) Enable Google/GitHub providers if desired.
	5.	Supabase Storage
	•	Create a Storage Bucket (e.g., resumes) for uploaded PDFs.
	•	Set the bucket policy so that only authenticated users can upload.
	•	Provide the path (e.g., resumes/{userId}.pdf) for storing resumes.
	6.	Admin Role Setup
	•	Decide how to assign admin role. For example, manually update certain profiles.role to 'admin' in the database.
	•	Ensure the RLS policy grants them broader read/write access.
	7.	Transactional Email (Optional)
	•	If you plan to send a confirmation email upon application submission:
	•	Integrate with a service like SendGrid.
	•	Store the API key in Supabase Functions or a serverless endpoint.
	•	For bulk emails (e.g., acceptance/rejection notifications), you can do it manually or via a custom admin endpoint later.

3. Frontend Developer Tasks (Next.js + TailwindCSS + shadcn UI)
	1.	Project Setup
	•	Create a Next.js (TypeScript) app (e.g., npx create-next-app@latest --ts).
	•	Install and configure TailwindCSS + shadcn UI.
	•	Set up environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) in a .env.local file (not committed).
	2.	Supabase Client
	•	Create a file (e.g., src/lib/supabaseClient.ts) to initialize the Supabase client with the environment vars.
	•	Export the client for use across the app.
	3.	Auth Pages
	•	Signup page:
	1.	Collect Email, Password, plus basic fields (Name, DOB, School).
	2.	Call supabase.auth.signUp({ email, password }).
	3.	On success, insert user’s additional info into profiles if needed.
	4.	Show a “Verify your email” message.
	•	Login page:
	1.	Email + password fields.
	2.	Call supabase.auth.signInWithPassword({ email, password }).
	3.	On success, redirect to the user’s dashboard or application page.
	4.	User Dashboard & Profile
	•	After login, direct the user to a dashboard or directly to the application form if they haven’t completed it.
	•	Show current status of their application if already submitted.
	5.	Application Form
	•	Implement all 38 questions plus optional fields.
	•	Provide a progress bar or step indicator.
	•	“Save for Later” → upsert partial application data to applications in Supabase.
	•	“Submit Application” → finalize data, set status = 'Under Review'.
	•	Resume Upload: Restrict to PDF files, then call:
	•	supabase.storage.from('resumes').upload('resumes/{userId}.pdf', file).
	•	Save the returned file URL/path in applications.resume_url.
	6.	Admin Dashboard
	•	Check if profile.role === 'admin'; otherwise restrict access.
	•	Display all applications in a table: name, email, school, status, etc.
	•	Provide filters: by name, university, status.
	•	Allow an admin to change status to “Accepted,” “Rejected,” or “Under Review.”
	7.	Styling & Responsiveness
	•	Use Tailwind and shadcn UI for a modern, minimal UI.
	•	Theme: space black background, subtle usage of #005CB9 (light blue) and #FFDA00 (gold) for highlights.
	•	Ensure forms and dashboards work well on mobile, tablet, and desktop.
	8.	Deployment
	•	Deploy the Next.js app to Vercel.
	•	Set up environment variables in Vercel’s project settings (Supabase URL, anon key).
	•	Test the full flow (signup → verify email → fill application → upload resume → admin review).

4. Testing & Verification
	1.	Backend Testing
	•	Verify Row-Level Security:
	•	A normal user should only see/update their own profiles and applications.
	•	An admin can read/update all.
	•	Check auth flows: email confirmation, password reset, etc.
	•	Ensure resume PDFs are accessible only to authenticated users (or admins).
	2.	Frontend Testing
	•	Signup & Login: Confirm email/password flows.
	•	Application Form: Confirm all fields and conditional questions (e.g., “If yes, then show additional text input”).
	•	Save for Later: Confirm partial application data is stored.
	•	Submit: Confirm final data is saved with status = 'Under Review'.
	•	Admin: Confirm the dashboard displays all applications; admin can update statuses.
	3.	Final Review
	•	Confirm that the styling meets the brand requirements (dark theme, accent colors).
	•	Confirm that the site is responsive on phones, tablets, and desktops.

5. Summary of Responsibilities
	•	Backend Developer (Supabase)
	•	Configure project, database schema, RLS policies, and storage bucket.
	•	Handle auth settings (email confirmations) and ensure the role system is in place for admin vs. applicant.
	•	(Optional) Set up any email notification logic (transactional or bulk).
	•	Frontend Developer (Next.js)
	•	Build signup/login pages using Supabase Auth.
	•	Implement the multi-step application form + “Save for Later” + “Submit.”
	•	Integrate resume uploads with Supabase Storage.
	•	Create user dashboard (show application status) and admin dashboard (view/filter/update statuses).
	•	Style everything using TailwindCSS + shadcn UI, ensuring a modern, responsive interface.

With these steps, both developers have a clear roadmap for building the RocketHacks application portal.