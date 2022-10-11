DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
CREATE TABLE countries (
  country_id SMALLSERIAL PRIMARY KEY,
  iso_numeric CHAR(3),
  iso_a3 CHAR(3),
  iso_a2 CHAR(2),
  name_en TEXT NOT NULL,
  name_long_en VARCHAR(300)
);
CREATE TABLE organizations_u (
  organization_id SMALLSERIAL PRIMARY KEY,
  organization_name TEXT NOT NULL,
  country SMALLSERIAL REFERENCES countries(country_id),
  website TEXT
);
CREATE TABLE sponsorgroups (
  sponsorgroup_id SMALLSERIAL PRIMARY KEY,
  sponsorgroup_name TEXT NOT NULL
);
CREATE TABLE sponsors_u (
  sponsor_id SERIAL PRIMARY KEY,
  organization SMALLINT NOT NULL REFERENCES organizations_u(organization_id),
  sponsorgroup SMALLINT NOT NULL REFERENCES sponsorgroups(sponsorgroup_id)
);
CREATE TABLE departments (
  department_id CHAR(3) PRIMARY KEY,
  department_name TEXT NOT NULL
);
CREATE TABLE programs (
  program_id VARCHAR(10) PRIMARY KEY,
  program_name TEXT NOT NULL
);
CREATE TABLE programs_departments (
  program_id VARCHAR(10) NOT NULL REFERENCES programs(program_id),
  department_id CHAR(3) NOT NULL REFERENCES departments(department_id),
  amount FLOAT NOT NULL,
  -- amount indicates which share possibly several department hold on a program
  PRIMARY KEY (program_id, department_id)
);
CREATE TABLE contacts_u (
  contact_id CHAR(9) PRIMARY KEY,
  year_of_birth DATE,
  gender CHAR(1) CHECK (gender IN ('f', 'm', 'd')),
  nationality SMALLINT REFERENCES countries(country_id)
);
CREATE TABLE employees_u (
  m_id INTEGER PRIMARY KEY,
  contact_id CHAR(9) REFERENCES contacts_u(contact_id),
  employment_start DATE CHECK (employment_start > '1950-01-01'),
  employment_end DATE CHECK (employment_end > employment_start)
);
--flights only from 2019
CREATE TABLE flights2019 (
  travel_id SMALLSERIAL PRIMARY KEY,
  passenger_name VARCHAR(300),
  m_id INTEGER REFERENCES employees_u(m_id),
  class CHAR(3),
  route TEXT [],
  distance FLOAT CHECK (distance > 0),
  airline VARCHAR(300),
  order_date DATE CHECK (order_date < departure_date),
  departure_date DATE CHECK (
    departure_date > '2018-01-01'
    AND departure_date < '2020-01-01'
  ),
  arrival_date DATE CHECK (
    arrival_date > '2019-01-01'
    AND arrival_date < '2021-01-01'
  ),
  product_type VARCHAR(100),
  ref1 CHAR(8),
  ref2 CHAR(4),
  ticket_count SMALLINT,
  totalSales MONEY,
  emissions_t FLOAT CHECK (emissions_t > 0),
  compensation MONEY
);
-- the students table also includes special type of students "alumni"
CREATE TABLE students_u (
  application_id VARCHAR(15) PRIMARY KEY,
  contact CHAR(9) REFERENCES contacts_u(contact_id),
  itc_student_id VARCHAR(20),
  city VARCHAR(50),
  level_code VARCHAR(10),
  program_id VARCHAR(10) REFERENCES programs(program_id),
  -- use ENUM for level_code?
  home_university INTEGER REFERENCES organizations_u(organization_id),
  department_id CHAR(3) REFERENCES departments(department_id),
  application_status VARCHAR(30) CHECK (
    application_status IN (
      'Alumnus',
      'Candidate',
      'Student',
      'Cancelled/Rejected'
    )
  ),
  enrollment_start DATE CHECK (enrollment_start > '1950-01-01'),
  enrollment_end DATE CHECK (enrollment_end > enrollment_start),
  certification_date DATE CHECK (
    certification_date > enrollment_start
    AND certification_date <= enrollment_end
  )
);
-- use enum instead of "in" constraint
-- mapping of application_status
-- Candidate > 07 - Candidate, 10 - Reserve Candidate, 13 -Admitted Candidate
-- Cancelled/Rejected >  22 - Cancelled by Candidate, 34 - Cancelled by Student, 36 - Cancelled by ITC, 19 - Rejected by ITC, 16 - Rejected by Sponsor, 04 - Not accepted
-- Student >  28 - Student Extramuraal, 27 - Student Intramuraal, 29 - Student Distance Education
CREATE TABLE projects_u (
  project_id SERIAL PRIMARY KEY,
  project_name TEXT NOT NULL,
  name_short TEXT,
  proposal_type VARCHAR,
  project_type VARCHAR(100),
  project_status VARCHAR(100),
  client_funding_agency SMALLINT REFERENCES organizations_u(organization_id),
  lead_organisation SMALLINT REFERENCES organizations_u(organization_id),
  proposal_start DATE,
  proposal_end DATE,
  proposal_submission_deadline DATE,
  submission_budget FLOAT NOT NULL,
  submission_budget_itc FLOAT NOT NULL,
  submission_cm FLOAT NOT NULL,
  submission DATE,
  proposol_po INTEGER REFERENCES employees_u(m_id),
  proposal_pl INTEGER REFERENCES employees_u(m_id),
  proposal_pa INTEGER REFERENCES employees_u(m_id)
);
CREATE TABLE projects_organizations_u (
  project_id INTEGER NOT NULL REFERENCES projects_u(project_id),
  organization_id INTEGER NOT NULL REFERENCES organizations_u(organization_id),
  PRIMARY KEY (project_id, organization_id)
);
CREATE TABLE projects_countries_u (
  project_id INTEGER NOT NULL REFERENCES projects_u(project_id),
  country_id INTEGER NOT NULL REFERENCES countries(country_id),
  PRIMARY KEY (project_id, country_id)
);
CREATE TABLE projects_departments_u (
  projects_departments_id SERIAL PRIMARY KEY,
  lead BOOLEAN NOT NULL,
  -- to assign each project to one lead departments
  project_id INTEGER NOT NULL REFERENCES projects_u(project_id),
  department_id CHAR(3) NOT NULL REFERENCES departments(department_id)
);
CREATE TABLE phdcandidates_u (
  candidate_id SMALLSERIAL PRIMARY KEY,
  contact_id CHAR(9) REFERENCES contacts_u(contact_id),
  department_1 CHAR(3) REFERENCES departments(department_id),
  department_2 CHAR(3) REFERENCES departments(department_id),
  sponsor INTEGER REFERENCES sponsors_u(sponsor_id),
  thesis_title TEXT,
  graduated BOOLEAN NOT NULL,
  phd_start DATE,
  phd_end DATE
);
--all travels regarding available back-to-office-reports 2000 until today
CREATE TABLE btors_u (
  btor_id SMALLSERIAL PRIMARY KEY,
  passenger_name VARCHAR(300),
  m_id INTEGER REFERENCES employees_u(m_id),
  department_id CHAR(3) REFERENCES departments(department_id),
  departure_date DATE CHECK (return_date > '1950-01-01'),
  return_date DATE CHECK (return_date > departure_date),
  destination SMALLINT REFERENCES countries(country_id),
  purpose_of_travel VARCHAR(100),
  -- TODO: requires recoding, and consequently a check constraint? current data holds 2,731 unique values
  budget FLOAT
);