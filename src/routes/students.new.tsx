import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { StudentForm } from "@/components/StudentForm";
import { Card, CardContent } from "@/components/ui/card";
import { createStudent, studentsQueryOptions, type StudentInput } from "@/lib/students";

export const Route = createFileRoute("/students/new")({
  head: () => ({
    meta: [
      { title: "Add Student | Student Management System" },
      {
        name: "description",
        content:
          "Add a new student record with validated ID, name, department, year, email, phone, attendance and marks.",
      },
      { property: "og:title", content: "Add Student | Student Management System" },
      {
        property: "og:description",
        content: "Register a new student into the department records with full field validation.",
      },
    ],
  }),
  component: AddStudentPage,
});

function AddStudentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: StudentInput) => createStudent(values),
    onSuccess: async () => {
      toast.success("Student added successfully");
      await queryClient.invalidateQueries({ queryKey: studentsQueryOptions.queryKey });
      navigate({ to: "/students" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <AppLayout title="Add Student" subtitle="Enter the student's details and save the record">
      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <StudentForm
            submitLabel="Save student"
            pending={mutation.isPending}
            onSubmit={(values) => mutation.mutate(values)}
            onCancel={() => navigate({ to: "/students" })}
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
