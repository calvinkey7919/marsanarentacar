-- Enable UUID generation.  Supabase enables this extension by default.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------
-- ENUMS
-- Define enums up front so they can be referenced by tables.
CREATE TYPE role_enum AS ENUM ('ADMIN', 'OPS', 'CORPORATE');
CREATE TYPE vehicle_status_enum AS ENUM (
  'AVAILABLE',
  'RENTED',
  'LEASED',
  'MAINTENANCE',
  'OUT_OF_SERVICE',
  'IN_SERVICE'
);
CREATE TYPE contract_type_enum AS ENUM ('LEASE', 'RENTAL_FRAMEWORK');
CREATE TYPE contract_status_enum AS ENUM ('DRAFT', 'ACTIVE', 'ENDED');
CREATE TYPE assignment_status_enum AS ENUM ('ACTIVE', 'ENDED');
CREATE TYPE request_type_enum AS ENUM ('MAINTENANCE', 'SERVICE', 'SUPPORT', 'OTHER');
CREATE TYPE request_priority_enum AS ENUM ('LOW', 'MED', 'HIGH', 'URGENT');
CREATE TYPE request_status_enum AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');
CREATE TYPE booking_type_enum AS ENUM ('RENTAL', 'CHAUFFEUR');
CREATE TYPE booking_status_enum AS ENUM ('HOLD', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- --------------------------------------------------
-- TABLES

-- Corporates: top‑level tenant representation.
CREATE TABLE IF NOT EXISTS corporates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Branches: physical locations for vehicles.
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Profiles: extend Supabase auth.users with role and corporate assignment.
-- Each row in auth.users must have a corresponding profile for application roles.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role role_enum NOT NULL,
  corporate_id UUID REFERENCES corporates(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Vehicles: the fleet.
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vin TEXT,
  plate_no TEXT,
  make TEXT,
  model TEXT,
  year INT,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  status vehicle_status_enum DEFAULT 'AVAILABLE' NOT NULL,
  odometer INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Contracts: high‑level agreements between Marsana and corporates.
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id UUID REFERENCES corporates(id) ON DELETE CASCADE,
  contract_no TEXT NOT NULL,
  type contract_type_enum NOT NULL,
  start_date DATE,
  end_date DATE,
  status contract_status_enum DEFAULT 'DRAFT' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ContractVehicleAssignments: link vehicles to contracts.
CREATE TABLE IF NOT EXISTS contract_vehicle_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  status assignment_status_enum DEFAULT 'ACTIVE' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE (vehicle_id, contract_id)
);

-- Requests: corporate support/service requests.
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id UUID REFERENCES corporates(id) ON DELETE CASCADE,
  created_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  type request_type_enum NOT NULL,
  priority request_priority_enum DEFAULT 'MED' NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status request_status_enum DEFAULT 'OPEN' NOT NULL,
  assigned_to_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Request comments: conversation thread for requests.
CREATE TABLE IF NOT EXISTS request_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  author_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Bookings: future extension to track rentals and chauffeur bookings.
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type booking_type_enum NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  corporate_id UUID REFERENCES corporates(id) ON DELETE SET NULL,
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  status booking_status_enum DEFAULT 'HOLD' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  CHECK (end_datetime > start_datetime)
);

-- Indices to speed up lookups.
CREATE INDEX IF NOT EXISTS idx_vehicles_branch ON vehicles(branch_id);
CREATE INDEX IF NOT EXISTS idx_contracts_corporate ON contracts(corporate_id);
CREATE INDEX IF NOT EXISTS idx_requests_corporate ON requests(corporate_id);
CREATE INDEX IF NOT EXISTS idx_requests_assigned_to ON requests(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_request_comments_request ON request_comments(request_id);