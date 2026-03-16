CREATE TABLE contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  company VARCHAR(150),
  project_type VARCHAR(100) NOT NULL,
  budget_range VARCHAR(100),
  timeline VARCHAR(100),
  message TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) DEFAULT 'new'
);