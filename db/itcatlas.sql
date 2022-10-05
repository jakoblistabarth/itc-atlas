--
--
-- ************************************
-- tables which do not require updates
--
DROP TABLE IF EXISTS countries CASCADE;
CREATE TABLE countries (
  country_id SMALLSERIAL,
  iso_numeric CHAR(3),
  iso_a3 CHAR(3),
  iso_a2 CHAR(2),
  name_en VARCHAR(100) NOT NULL,
  name_long_en VARCHAR(300),
  PRIMARY KEY (country_id)
);
DROP TABLE IF EXISTS sponsorgroups CASCADE;
CREATE TABLE sponsorgroups (
  sponsorgroup_id SMALLSERIAL,
  sponsorgroup_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (sponsorgroup_id)
);
DROP TABLE IF EXISTS sponsors CASCADE;
CREATE TABLE sponsors (
  sponsor_id SMALLSERIAL,
  sponsor_name VARCHAR(100) NOT NULL,
  sponsorgroup_id INT NOT NULL,
  PRIMARY KEY (sponsor_id),
  FOREIGN KEY (sponsorgroup_id) REFERENCES sponsorgroups(sponsorgroup_id)
);
DROP TABLE IF EXISTS departments CASCADE;
CREATE TABLE departments (
  department_code CHAR(3) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (department_code)
);
DROP TABLE IF EXISTS programs CASCADE;
CREATE TABLE programs (
  program_code VARCHAR(10) NOT NULL,
  program_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (program_code)
);
DROP TABLE IF EXISTS programms_departments;
CREATE TABLE programms_departments (
  amount FLOAT NOT NULL,
  program_code VARCHAR(10) NOT NULL,
  department_code CHAR(3) NOT NULL,
  PRIMARY KEY (program_code, department_code),
  FOREIGN KEY (program_code) REFERENCES programs(program_code),
  FOREIGN KEY (department_code) REFERENCES departments(department_code),
  UNIQUE (department_code, program_code)
);
DROP TABLE IF EXISTS flights2019;
--flights only from 2019
CREATE TABLE flights2019 (
  travel_id SMALLSERIAL,
  passenger_name VARCHAR(300),
  m_id INTEGER,
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
  compensation MONEY,
  PRIMARY KEY (travel_id),
  FOREIGN KEY (m_id) REFERENCES staff(m_id)
);
--
--
-- ******************************
-- tables which update frequently
--

DROP TABLE IF EXISTS publications;
-- based on scopus export?
CREATE TABLE publications (
  publication_id SMALLSERIAL,
  title VARCHAR(200) NOT NULL,
  publicationName VARCHAR(200),
  cited_by_count SMALLINT NOT NULL,
  -- REMOVE IF NOT UPDATED REGULARLY
  affiliations VARCHAR(500),
  PRIMARY KEY (publication_id)
);
DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
  application_id VARCHAR(15) NOT NULL,
  contact_id CHAR(9) NOT NULL,
  itcstudent_id VARCHAR(20),
  date_of_birth DATE,
  city VARCHAR(50),
  gender CHAR(1) CHECK (gender IN ('f', 'm', 'd')),
  nationality SMALLINT,
  level_code VARCHAR(10),
  department_code CHAR(3),
  application_status VARCHAR(30) CHECK (
    gender IN (
      'Alumnus',
      'Candidate',
      'Student',
      'Cancelled/Rejected'
    )
  ),
  PRIMARY KEY (application_id),
  FOREIGN KEY (nationality) REFERENCES countries(country_id),
  FOREIGN KEY (department_code) REFERENCES departments(department_code)
);
-- mapping of application_status
-- Candidate > 07 - Candidate, 10 - Reserve Candidate, 13 -Admitted Candidate
-- Cancelled/Rejected >  22 - Cancelled by Candidate, 34 - Cancelled by Student, 36 - Cancelled by ITC, 19 - Rejected by ITC, 16 - Rejected by Sponsor, 04 - Not accepted
-- Student >  28 - Student Extramuraal, 27 - Student Intramuraal, 29 - Student Distance Education
DROP TABLE IF EXISTS staff CASCADE;
CREATE TABLE staff (
  m_id INTEGER NOT NULL,
  date_of_birth DATE CHECK (employment_end > employment_start),
  nationality SMALLINT,
  origin INTEGER,
  employment_start DATE CHECK (
    employment_start > '1950-01-01'
    AND employment_start > date_of_birth
  ),
  employment_end DATE CHECK (employment_end > employment_start),
  PRIMARY KEY (m_id),
  FOREIGN KEY (nationality) REFERENCES countries(country_id),
  FOREIGN KEY (origin) REFERENCES countries(country_id)
);
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
  project_id INTEGER NOT NULL,
  project_name VARCHAR(500) NOT NULL,
  name_short VARCHAR(100),
  proposal_type VARCHAR,
  project_type VARCHAR(100),
  project_status VARCHAR(100),
  client_funding_agency VARCHAR(200),
  lead_organisation VARCHAR(200),
  partners TEXT [],
  proposal_start DATE,
  proposal_end DATE,
  proposal_submission_deadline DATE,
  submission_budget FLOAT NOT NULL,
  submission_budget_itc FLOAT NOT NULL,
  submission_cm FLOAT NOT NULL,
  submission DATE,
  proposol_po INTEGER,
  proposal_pl INTEGER,
  proposal_pa INTEGER,
  PRIMARY KEY (project_id),
  FOREIGN KEY (proposol_po) REFERENCES staff(m_id),
  FOREIGN KEY (proposal_pl) REFERENCES staff(m_id),
  FOREIGN KEY (proposal_pa) REFERENCES staff(m_id)
);
DROP TABLE IF EXISTS project_countries;
CREATE TABLE project_countries (
  project_id INTEGER NOT NULL,
  country_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, country_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id),
  FOREIGN KEY (country_id) REFERENCES countries(country_id),
  UNIQUE (project_id, country_id)
);
DROP TABLE IF EXISTS projects_departments;
CREATE TABLE projects_departments (
  lead BOOLEAN NOT NULL,
  -- to assign each project to one lead departments
  project_id INTEGER NOT NULL,
  department_code CHAR(3) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(project_id),
  FOREIGN KEY (department_code) REFERENCES departments(department_code)
);
DROP TABLE IF EXISTS phdcandidates;
CREATE TABLE phdcandidates (
  candidate_id SMALLSERIAL,
  itcstudent_id INTEGER,
  nationality SMALLINT,
  department_1 CHAR(3),
  department_2 CHAR(3),
  sponsor_name VARCHAR(300),
  phd_start DATE,
  phd_end DATE,
  PRIMARY KEY (candidate_id),
  FOREIGN KEY (nationality) REFERENCES countries(country_id)
);
DROP TABLE IF EXISTS btors;
--all travels regarding available back-to-office-reports 2000 until today
CREATE TABLE btors (
  btor_id SMALLSERIAL,
  passenger_name VARCHAR(300),
  m_id INTEGER,
  department_code CHAR(3),
  departure_date DATE CHECK (return_date > '1950-01-01'),
  return_date DATE CHECK (return_date > departure_date),
  destination SMALLINT,
  purpose_of_travel VARCHAR(100),
  -- TODO: requires recoding, and consequently a check constraint? current data holds 2,731 unique values
  budget FLOAT,
  PRIMARY KEY (btor_id),
  FOREIGN KEY (department_code) REFERENCES departments(department_code),
  FOREIGN KEY (destination) REFERENCES countries(country_id),
  FOREIGN KEY (m_id) REFERENCES staff(m_id)
);