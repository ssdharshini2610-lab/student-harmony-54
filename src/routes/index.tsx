import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Percent, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gradeOf, studentsQueryOptions, type Student } from "@/lib/students";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Student Management System" },
      {
        name: "description",
        content:
          "Live dashboard of student strength, average marks, average attendance and department distribution for the AI & Data Science department.",
      },
      { property: "og:title", content: "Dashboard | Student Management System" },
      {
        property: "og:description",
        content:
          "Track student strength, average marks and attendance across departments in one place.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentsQueryOptions),
  errorComponent: ({ error }) => (
    <AppLayout title="Dashboard">
      <p role="alert" className="text-sm text-destructive">
        {error.message}
      </p>
    </AppLayout>
  ),
  notFoundComponent: () => (
    <AppLayout title="Dashboard">
      <p className="text-sm text-muted-foreground">No data found.</p>
    </AppLayout>
  ),
  component: Dashboard,
});

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function Dashboard() {
  const { data: students } = useSuspenseQuery(studentsQueryOptions);

  const avgMarks = average(students.map((s) => Number(s.marks)));
  const avgAttendance = average(students.map((s) => Number(s.attendance_percentage)));

  const byDepartment = Object.entries(
    students.reduce<Record<string, number>>((acc, s) => {
      acc[s.department] = (acc[s.department] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const byYear = ["I", "II", "III", "IV"].map((year) => {
    const group = students.filter((s) => s.year === year);
    return {
      year: `Year ${year}`,
      marks: Number(average(group.map((s) => Number(s.marks))).toFixed(1)),
      attendance: Number(average(group.map((s) => Number(s.attendance_percentage))).toFixed(1)),
    };
  });

  const recent = students.slice(0, 5);

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Department of Artificial Intelligence & Data Science — student overview"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Users className="size-5" />}
          label="Total students"
          value={String(students.length)}
        />
        <StatCard
          icon={<TrendingUp className="size-5" />}
          label="Average marks"
          value={`${avgMarks.toFixed(1)} / 100`}
        />
        <StatCard
          icon={<Percent className="size-5" />}
          label="Average attendance"
          value={`${avgAttendance.toFixed(1)}%`}
        />
        <StatCard
          icon={<GraduationCap className="size-5" />}
          label="Departments"
          value={String(byDepartment.length)}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {students.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byDepartment}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {byDepartment.map((entry, i) => (
                      <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Year-wise marks &amp; attendance</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {students.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="year" fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis domain={[0, 100]} fontSize={12} stroke="var(--color-muted-foreground)" />
                  <Tooltip />
                  <Bar dataKey="marks" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently added students</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/students">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No students yet. Add your first student to get started.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((s: Student) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.student_id} · {s.department} · Year {s.year}
                    </p>
                  </div>
                  <Badge variant="secondary">{Number(s.marks).toFixed(0)} marks</Badge>
                  <Badge variant="outline">Grade {gradeOf(Number(s.marks))}</Badge>
                  <Badge variant="outline">
                    {Number(s.attendance_percentage).toFixed(0)}% attendance
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No data to display yet.
    </div>
  );
}
