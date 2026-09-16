# StudentSphere Pro

Build a complete, functional Student Management System web application for a B.Tech Artificial Intelligence & Data Science mini project with Lovable Cloud (Supabase PostgreSQL database).

Requirements:
- Database: Create a `students` table in Supabase PostgreSQL with fields: student_id (unique string), name (text), department (text, default to AI & Data Science or selectable), year (text/number), email (text), phone (text), attendance_percentage (numeric, 0-100), marks (numeric, 0-100), created_at. Seed with 5 realistic sample student records.
- All CRUD operations must connect directly to the database:
  1. CREATE: Add student with validation (unique student ID, required name, valid email, valid phone, attendance 0-100, marks 0-100).
  2. READ: View all students with search & filter, plus a dedicated student details view.
  3. UPDATE: Edit existing student details with form validation.
  4. DELETE: Delete student record with confirmation dialog.
- Pages/Views:
  1. Dashboard with summary cards (Total Students, Average Marks, Average Attendance), department distribution/charts, and recent students.
  2. Add Student form.
  3. View Students table with search, sorting, actions (view details, edit, delete).
  4. Edit Student modal or dedicated page.
  5. Student Details modal/view.
- UI/UX: Clean, professional, modern design suitable for an engineering college mini project using Tailwind CSS, toast notifications for success/error feedback, responsive layout with sidebar or top navbar navigation.
- Include a project README modal or documentation section detailing project title, description, features, technologies, database schema, CRUD operations, and setup instructions.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://student-harmony-54.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/29644496-e912-41d9-b074-5eddb4b0bc7b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
