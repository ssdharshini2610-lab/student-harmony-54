import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Project Documentation | Student Management System" },
      {
        name: "description",
        content:
          "Project report for the Student Management System mini project: features, technologies, database schema, CRUD operations and setup instructions.",
      },
      { property: "og:title", content: "Project Documentation | Student Management System" },
      {
        property: "og:description",
        content:
          "Features, technologies, database schema and CRUD operations of the B.Tech AI & Data Science Student Management System mini project.",
      },
    ],
  }),
  component: DocsPage,
});

const SCHEMA: Array<[string, string, string]> = [
  ["id", "uuid (primary key)", "Auto-generated unique record identifier"],
  ["student_id", "text (unique, required)", "College roll number, must be unique"],
  ["name", "text (required)", "Full name of the student"],
  ["department", "text (default: AI & Data Science)", "Branch of study"],
  ["year", "text (I - IV)", "Current year of study"],
  ["email", "text (required)", "Validated college email address"],
  ["phone", "text (required)", "10-digit mobile number"],
  ["attendance_percentage", "numeric (0-100)", "Overall attendance percentage"],
  ["marks", "numeric (0-100)", "Aggregate marks out of 100"],
  ["created_at", "timestamptz", "Record creation time"],
  ["updated_at", "timestamptz", "Auto-updated on every edit"],
];

function DocsPage() {
  return (
    <AppLayout
      title="Project Documentation"
      subtitle="B.Tech Artificial Intelligence & Data Science — mini project report"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Title:</span> Student Management System
            </p>
            <p>
              <span className="font-medium text-foreground">Description:</span> A full-stack web
              application that allows a department to maintain student records — personal details,
              attendance and academic performance — with a live dashboard and complete create, read,
              update and delete functionality backed by a PostgreSQL database.
            </p>
            <p>
              <span className="font-medium text-foreground">Objective:</span> Demonstrate database
              design, validation, and a responsive user interface for academic record keeping.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Dashboard with total students, average marks and average attendance</li>
              <li>Department distribution and year-wise performance charts</li>
              <li>Recently added students list</li>
              <li>Add student form with full field validation</li>
              <li>Searchable, sortable, filterable student table</li>
              <li>Student details view with attendance and grade summary</li>
              <li>Edit student in a modal dialog</li>
              <li>Delete with confirmation dialog</li>
              <li>Toast notifications for every success and error</li>
              <li>Responsive layout with sidebar navigation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technologies used</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>React with TypeScript (front end)</li>
              <li>TanStack Router and TanStack Query (routing and data fetching)</li>
              <li>Tailwind CSS with a semantic design system (styling)</li>
              <li>React Hook Form and Zod (form handling and validation)</li>
              <li>Recharts (data visualisation)</li>
              <li>PostgreSQL database with row-level security (back end)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CRUD operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Create —</span> the Add Student form
              inserts a new row after validating a unique student ID, name, email, 10-digit phone,
              attendance and marks between 0 and 100.
            </p>
            <p>
              <span className="font-medium text-foreground">Read —</span> the Students page fetches
              all rows and supports search by name, ID or email, department and year filters, and
              sorting by name, marks or attendance. A details view shows one record.
            </p>
            <p>
              <span className="font-medium text-foreground">Update —</span> the edit dialog updates
              the selected row using the same validation rules; the updated timestamp is refreshed
              automatically by a database trigger.
            </p>
            <p>
              <span className="font-medium text-foreground">Delete —</span> removes the row after
              the user confirms in a dialog.
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Database schema — table: students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Column</th>
                    <th className="py-2 pr-4 font-medium">Type / constraint</th>
                    <th className="py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {SCHEMA.map(([col, type, desc]) => (
                    <tr key={col} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-mono text-xs text-foreground">{col}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{type}</td>
                      <td className="py-2 text-muted-foreground">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Setup instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Clone the project repository to your computer.</li>
              <li>
                Install dependencies with <code className="font-mono text-xs">npm install</code>.
              </li>
              <li>
                Add the database URL and public key to a{" "}
                <code className="font-mono text-xs">.env</code> file (already configured in the
                hosted version).
              </li>
              <li>
                Start the development server with{" "}
                <code className="font-mono text-xs">npm run dev</code>.
              </li>
              <li>Open the shown local address in a browser to use the application.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
