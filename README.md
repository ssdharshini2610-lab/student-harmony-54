# Student Management System

## Project Overview

The Student Management System is a web-based application developed for managing student information efficiently.

The system allows users to add, view, update, and delete student records. It also provides a dashboard containing student statistics such as total students, average marks, average attendance, and department distribution.

The application uses a modern web interface with a PostgreSQL database for storing student information.

## Live Application

https://student-harmony-54.lovable.app

## GitHub Repository

https://github.com/ssdharshini2610-lab/student-harmony-54

## Objectives

- To develop a web-based student management system.
- To maintain student records digitally.
- To implement CRUD operations.
- To provide search and filtering facilities.
- To display student performance statistics.
- To store student information in a PostgreSQL database.
- To provide a simple and user-friendly interface.

## Features

### Dashboard

The dashboard displays:

- Total number of students
- Average marks
- Average attendance
- Department distribution
- Recent student records
- Student performance charts

### Add Student

Users can add a new student by entering:

- Student ID
- Name
- Department
- Year
- Email
- Phone
- Attendance Percentage
- Marks

### View Students

The system displays all student records in a table.

It supports:

- Search
- Filtering
- Sorting
- View details
- Edit
- Delete

### Edit Student

Existing student information can be modified and the changes are stored in the database.

### Delete Student

Student records can be deleted after confirmation.

### Student Details

Complete information about an individual student can be viewed using the student details option.

## CRUD Operations

| Operation | Function |
|-----------|----------|
| Create | Add a new student |
| Read | View student records |
| Update | Modify student information |
| Delete | Remove a student record |

All CRUD operations are connected to the database.

## Form Validation

The application validates:

- Unique Student ID
- Student name
- Email address
- Phone number
- Attendance percentage between 0 and 100
- Marks between 0 and 100

## Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- HTML
- CSS
- JavaScript

### Database

- Supabase
- PostgreSQL

### Version Control

- Git
- GitHub

## Database Schema

### Students Table

| Field | Data Type | Description |
|-------|-----------|-------------|
| student_id | String | Unique student ID |
| name | Text | Student name |
| department | Text | Student department |
| year | Text/Number | Academic year |
| email | Text | Student email |
| phone | Text | Student phone number |
| attendance_percentage | Numeric | Attendance percentage |
| marks | Numeric | Student marks |
| created_at | Timestamp | Record creation date |

## Application Architecture

```text
User
  ↓
Web Application
  ↓
React Frontend
  ↓
Database Connection
  ↓
Supabase PostgreSQL
