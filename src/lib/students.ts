import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

export const DEPARTMENTS = [
  "AI & Data Science",
  "Computer Science",
  "Electronics & Communication",
  "Mechanical",
  "Civil",
] as const;

export const YEARS = ["I", "II", "III", "IV"] as const;

export type Student = {
  id: string;
  student_id: string;
  name: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  attendance_percentage: number;
  marks: number;
  created_at: string;
  updated_at: string;
};

export const studentSchema = z.object({
  student_id: z
    .string()
    .trim()
    .min(3, "Student ID must be at least 3 characters")
    .max(20, "Student ID is too long")
    .regex(/^[A-Za-z0-9-]+$/, "Only letters, numbers and hyphens allowed"),
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(80, "Name is too long"),
  department: z.string().min(1, "Select a department"),
  year: z.string().min(1, "Select a year"),
  email: z.string().trim().email("Enter a valid email address").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),
  attendance_percentage: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .min(0, "Must be 0 or more")
    .max(100, "Must be 100 or less"),
  marks: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .min(0, "Must be 0 or more")
    .max(100, "Must be 100 or less"),
});

export type StudentInput = z.infer<typeof studentSchema>;

export const studentsQueryOptions = queryOptions({
  queryKey: ["students"],
  queryFn: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Student[];
  },
});

function friendlyError(message: string) {
  if (message.toLowerCase().includes("duplicate key")) {
    return "That Student ID already exists. Please use a unique ID.";
  }
  return message;
}

export async function createStudent(input: StudentInput) {
  const { error } = await supabase.from("students").insert(input);
  if (error) throw new Error(friendlyError(error.message));
}

export async function updateStudent(id: string, input: StudentInput) {
  const { error } = await supabase.from("students").update(input).eq("id", id);
  if (error) throw new Error(friendlyError(error.message));
}

export async function deleteStudent(id: string) {
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw new Error(friendlyError(error.message));
}

export function gradeOf(marks: number) {
  if (marks >= 90) return "O";
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  return "F";
}
