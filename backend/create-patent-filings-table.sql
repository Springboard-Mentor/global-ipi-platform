-- Patent Filings Table Schema for Firebase Firestore
-- This is a documentation of the Firestore collection structure
-- Collection Name: patentFilings

/*
FIRESTORE COLLECTION: patentFilings

Document Structure:
{
  // User Information
  userId: string,              // Firebase Auth UID
  userEmail: string,           // User's email
  userName: string,            // User's display name
  
  // Applicant Information
  applicantInfo: {
    name: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    country: string,
    organizationName: string,   // Optional, for organizations
    applicantType: string,      // 'individual', 'organization', 'joint'
  },
  
  // Invention Details
  inventionDetails: {
    title: string,
    field: string,              // Field of invention
    description: string,        // Detailed description
    technicalProblem: string,
    proposedSolution: string,
    advantages: string,
    priorArt: string,           // Optional
  },
  
  // Patent Details
  patentDetails: {
    patentType: string,         // 'provisional', 'complete'
    filingType: string,         // 'national', 'international'
    priorityDate: string,       // ISO date string
    priorityNumber: string,
    claimsPriority: boolean,
    numberOfClaims: number,
    numberOfDrawings: number,
  },
  
  // Document URLs (Firebase Storage)
  documents: {
    descriptionFile: string,    // URL to PDF
    claimsFile: string,         // URL to PDF
    abstractFile: string,       // URL to PDF
    drawingsFile: string,       // URL to PDF (optional)
  },
  
  // Payment Information
  payment: {
    amount: number,
    currency: string,           // 'INR'
    paymentId: string,          // Razorpay payment ID
    orderId: string,            // Razorpay order ID
    signature: string,          // Razorpay signature
    status: string,             // 'completed', 'pending', 'failed'
    timestamp: string,          // ISO timestamp
  },
  
  // Status and Metadata
  status: string,               // 'submitted', 'under-review', 'approved', 'rejected'
  filingDate: timestamp,        // Firestore server timestamp
  createdAt: timestamp,         // Firestore server timestamp
  updatedAt: timestamp,         // Firestore server timestamp
}

INDEXES (Create in Firebase Console):
1. Composite Index: userId (Ascending) + status (Ascending) + filingDate (Descending)
2. Single Field Index: status (Ascending)
3. Single Field Index: filingDate (Descending)

SECURITY RULES (Update in Firebase Console):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patentFilings/{filingId} {
      // Allow users to read their own filings
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      
      // Allow users to create new filings
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      
      // Prevent updates and deletes by users (admin only)
      allow update, delete: if false;
    }
  }
}
*/

-- SQL Schema (For reference if using SQL database in backend)
CREATE TABLE IF NOT EXISTS patent_filings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    
    -- Applicant Information
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_address TEXT NOT NULL,
    applicant_city VARCHAR(100) NOT NULL,
    applicant_state VARCHAR(100) NOT NULL,
    applicant_pincode VARCHAR(10) NOT NULL,
    applicant_country VARCHAR(100) NOT NULL,
    organization_name VARCHAR(255),
    applicant_type ENUM('individual', 'organization', 'joint') NOT NULL,
    
    -- Invention Details
    invention_title VARCHAR(500) NOT NULL,
    invention_field VARCHAR(255) NOT NULL,
    invention_description TEXT NOT NULL,
    technical_problem TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    advantages TEXT NOT NULL,
    prior_art TEXT,
    
    -- Patent Details
    patent_type ENUM('provisional', 'complete') NOT NULL,
    filing_type ENUM('national', 'international') NOT NULL,
    priority_date DATE,
    priority_number VARCHAR(100),
    claims_priority BOOLEAN DEFAULT FALSE,
    number_of_claims INT NOT NULL,
    number_of_drawings INT,
    
    -- Document URLs
    description_file_url TEXT NOT NULL,
    claims_file_url TEXT NOT NULL,
    abstract_file_url TEXT NOT NULL,
    drawings_file_url TEXT,
    
    -- Payment Information
    payment_amount DECIMAL(10, 2) NOT NULL,
    payment_currency VARCHAR(3) DEFAULT 'INR',
    payment_id VARCHAR(255) NOT NULL,
    payment_order_id VARCHAR(255),
    payment_signature VARCHAR(255),
    payment_status ENUM('completed', 'pending', 'failed') NOT NULL,
    payment_timestamp TIMESTAMP,
    
    -- Status and Timestamps
    status ENUM('submitted', 'under-review', 'approved', 'rejected') DEFAULT 'submitted',
    filing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_filing_date (filing_date DESC),
    INDEX idx_user_status (user_id, status, filing_date DESC)
);
