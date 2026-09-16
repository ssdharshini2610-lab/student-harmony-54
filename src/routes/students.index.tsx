import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Eye, Pencil, Search, Trash2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { StudentForm } from "@/components/StudentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DEPARTMENTS,
  YEARS,
  deleteStudent,
  gradeOf,
  studentsQueryOptions,
  updateStudent,
  type Student,
  type StudentInput,
} from "@/lib/students";

export const Route = createFileRoute("/students/")({
  head: () => ({
    meta: [
      { title: "All Students | Student Management System" },
      {
        name: "description",
        content:
          "Search, sort and manage every student record — view details, edit information or delete a student.",
      },
      { property: "og:title", content: "All Students | Student Management System" },
      {
        property: "og:description",
        content: "Browse the full student register with search, filters, sorting and quick actions.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentsQueryOptions),
  errorComponent: ({ error }) => (
    <AppLayout title="All Students">
      <p role="alert" className="text-sm text-destructive">
        {error.message}
      </p>
    </AppLayout>
  ),
  notFoundComponent: () => (
    <AppLayout title="All Students">
      <p className="text-sm text-muted-foreground">No students found.</p>
    </AppLayout>
  ),
  component: StudentsPage,
});

type SortKey = "name" | "student_id" | "marks" | "attendance_percentage";

function StudentsPage() {
  const { data: students } = useSuspenseQuery(studentsQueryOptions);
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [year, setYear] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const [viewing, setViewing] = useState<Student | null>(null);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: studentsQueryOptions.queryKey });

  const editMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: StudentInput }) => updateStudent(id, values),
    onSuccess: async () => {
      toast.success("Student updated successfully");
      setEditing(null);
      await refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: async () => {
      toast.success("Student deleted");
      setDeleting(null);
      await refresh();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = students.filter((s) => {
      const matchesTerm =
        term === "" ||
        s.name.toLowerCase().includes(term) ||
        s.student_id.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term);
      const matchesDept = department === "all" || s.department === department;
      const matchesYear = year === "all" || s.year === year;
      return matchesTerm && matchesDept && matchesYear;
    });

    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const result =
        typeof av === "number" || typeof bv === "number"
          ? Number(av) - Number(bv)
          : String(av).localeCompare(String(bv));
      return sortAsc ? result : -result;
    });
  }, [students, search, department, year, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortAsc((prev) => !prev);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <AppLayout
      title="All Students"
      subtitle={`${students.length} record${students.length === 1 ? "" : "s"} in the database`}
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID or email"
                className="pl-9"
                aria-label="Search students"
              />
            </div>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-56" aria-label="Filter by department">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-36" aria-label="Filter by year">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    Year {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link to="/students/new">
                <UserPlus className="size-4" />
                Add student
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead onClick={() => toggleSort("student_id")}>Student ID</SortableHead>
                  <SortableHead onClick={() => toggleSort("name")}>Name</SortableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <SortableHead onClick={() => toggleSort("attendance_percentage")}>
                    Attendance
                  </SortableHead>
                  <SortableHead onClick={() => toggleSort("marks")}>Marks</SortableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No students match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.student_id}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.department}</TableCell>
                      <TableCell>{s.year}</TableCell>
                      <TableCell>{Number(s.attendance_percentage).toFixed(1)}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {Number(s.marks).toFixed(1)}
                          <Badge variant="secondary">{gradeOf(Number(s.marks))}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`View ${s.name}`}
                            onClick={() => setViewing(s)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${s.name}`}
                            onClick={() => setEditing(s)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${s.name}`}
                            onClick={() => setDeleting(s)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
            <DialogDescription>Student ID {viewing?.student_id}</DialogDescription>
          </DialogHeader>
          {viewing ? (
            <div className="space-y-4">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Department" value={viewing.department} />
                <Detail label="Year" value={`Year ${viewing.year}`} />
                <Detail label="Email" value={viewing.email} />
                <Detail label="Phone" value={viewing.phone} />
                <Detail label="Grade" value={gradeOf(Number(viewing.marks))} />
                <Detail
                  label="Added on"
                  value={new Date(viewing.created_at).toLocaleDateString()}
                />
              </dl>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">
                    {Number(viewing.attendance_percentage).toFixed(1)}%
                  </span>
                </div>
                <Progress value={Number(viewing.attendance_percentage)} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Marks</span>
                  <span className="font-medium">{Number(viewing.marks).toFixed(1)} / 100</span>
                </div>
                <Progress value={Number(viewing.marks)} />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit student</DialogTitle>
            <DialogDescription>Update the details and save your changes.</DialogDescription>
          </DialogHeader>
          {editing ? (
            <StudentForm
              submitLabel="Update student"
              pending={editMutation.isPending}
              defaultValues={{
                student_id: editing.student_id,
                name: editing.name,
                department: editing.department,
                year: editing.year,
                email: editing.email,
                phone: editing.phone,
                attendance_percentage: Number(editing.attendance_percentage),
                marks: Number(editing.marks),
              }}
              onSubmit={(values) => editMutation.mutate({ id: editing.id, values })}
              onCancel={() => setEditing(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `${deleting.name} (${deleting.student_id}) will be permanently removed from the database. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleting) deleteMutation.mutate(deleting.id);
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}

function SortableHead({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
      >
        {children}
        <ArrowUpDown className="size-3" />
      </button>
    </TableHead>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words text-foreground">{value}</dd>
    </div>
  );
}
