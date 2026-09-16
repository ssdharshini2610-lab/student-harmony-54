CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id text NOT NULL UNIQUE,
  name text NOT NULL,
  department text NOT NULL DEFAULT 'AI & Data Science',
  year text NOT NULL DEFAULT 'I',
  email text NOT NULL,
  phone text NOT NULL,
  attendance_percentage numeric(5,2) NOT NULL DEFAULT 0 CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
  marks numeric(5,2) NOT NULL DEFAULT 0 CHECK (marks >= 0 AND marks <= 100),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Anyone can add students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update students" ON public.students FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete students" ON public.students FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER students_set_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.students (student_id, name, department, year, email, phone, attendance_percentage, marks) VALUES
('AIDS21001', 'Aarav Krishnan', 'AI & Data Science', 'III', 'aarav.krishnan@college.edu', '9876543210', 92.50, 88.00),
('AIDS21002', 'Dharshini Ramesh', 'AI & Data Science', 'III', 'dharshini.ramesh@college.edu', '9845123670', 96.00, 93.50),
('AIDS22014', 'Karthik Subramani', 'AI & Data Science', 'II', 'karthik.subramani@college.edu', '9791234508', 78.25, 71.00),
('CSE21045', 'Meera Nair', 'Computer Science', 'III', 'meera.nair@college.edu', '9701456789', 85.00, 80.75),
('ECE22033', 'Rohan Verma', 'Electronics & Communication', 'II', 'rohan.verma@college.edu', '9812345670', 68.50, 62.25);