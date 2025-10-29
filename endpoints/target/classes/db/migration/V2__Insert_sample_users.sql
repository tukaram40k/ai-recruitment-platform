-- Insert sample admin users
INSERT INTO users (name, email, role, info) VALUES 
('Admin One', 'admin1@example.com', 'ROLE_ADMIN', 'System Administrator with full access privileges.'),
('Admin Two', 'admin2@example.com', 'ROLE_ADMIN', 'System Administrator with full access privileges.');

-- Insert sample recruiters
INSERT INTO users (name, email, role, info) VALUES 
('Jane Smith', 'janesmith1@company.com', 'ROLE_RECRUITER', 'HR Professional with 5 years of experience in talent acquisition.'),
('Michael Johnson', 'michaeljohnson2@company.com', 'ROLE_RECRUITER', 'HR Professional with 3 years of experience in talent acquisition.'),
('Sarah Williams', 'sarahwilliams3@company.com', 'ROLE_RECRUITER', 'HR Professional with 7 years of experience in talent acquisition.'),
('David Brown', 'davidbrown4@company.com', 'ROLE_RECRUITER', 'HR Professional with 4 years of experience in talent acquisition.'),
('Emily Davis', 'emilydavis5@company.com', 'ROLE_RECRUITER', 'HR Professional with 6 years of experience in talent acquisition.'),
('Robert Miller', 'robertmiller6@company.com', 'ROLE_RECRUITER', 'HR Professional with 8 years of experience in talent acquisition.'),
('Jessica Wilson', 'jessicawilson7@company.com', 'ROLE_RECRUITER', 'HR Professional with 2 years of experience in talent acquisition.'),
('William Moore', 'williammoore8@company.com', 'ROLE_RECRUITER', 'HR Professional with 9 years of experience in talent acquisition.'),
('Ashley Taylor', 'ashleytaylor9@company.com', 'ROLE_RECRUITER', 'HR Professional with 1 years of experience in talent acquisition.'),
('James Anderson', 'jamesanderson10@company.com', 'ROLE_RECRUITER', 'HR Professional with 10 years of experience in talent acquisition.'),
('Amanda Thomas', 'amandathomas11@company.com', 'ROLE_RECRUITER', 'HR Professional with 4 years of experience in talent acquisition.'),
('Christopher Jackson', 'christopherjackson12@company.com', 'ROLE_RECRUITER', 'HR Professional with 6 years of experience in talent acquisition.'),
('Stephanie White', 'stephaniewhite13@company.com', 'ROLE_RECRUITER', 'HR Professional with 3 years of experience in talent acquisition.'),
('Daniel Harris', 'danielharris14@company.com', 'ROLE_RECRUITER', 'HR Professional with 7 years of experience in talent acquisition.'),
('Jennifer Martin', 'jennifermartin15@company.com', 'ROLE_RECRUITER', 'HR Professional with 5 years of experience in talent acquisition.'),
('Matthew Thompson', 'matthewthompson16@company.com', 'ROLE_RECRUITER', 'HR Professional with 8 years of experience in talent acquisition.'),
('Elizabeth Garcia', 'elizabethgarcia17@company.com', 'ROLE_RECRUITER', 'HR Professional with 2 years of experience in talent acquisition.'),
('Anthony Rodriguez', 'anthonyrodriguez18@company.com', 'ROLE_RECRUITER', 'HR Professional with 9 years of experience in talent acquisition.');

-- Insert sample candidates
INSERT INTO users (name, email, role, info, cv) VALUES 
('John Doe', 'johndoe1@gmail.com', 'ROLE_CANDIDATE', 'Software Developer', 'Experienced professional with 5+ years in software development. Skilled in Java, Spring Boot, and microservices architecture.'),
('Alice Johnson', 'alicejohnson2@yahoo.com', 'ROLE_CANDIDATE', 'Senior Java Developer', 'Passionate developer with expertise in modern web technologies. Strong background in React, Node.js, and cloud platforms.'),
('Bob Wilson', 'bobwilson3@hotmail.com', 'ROLE_CANDIDATE', 'Full Stack Developer', 'Senior engineer with proven track record in enterprise applications. Specializes in system design and team leadership.'),
('Carol Smith', 'carolsmith4@outlook.com', 'ROLE_CANDIDATE', 'Frontend Developer', 'Full-stack developer with experience in both frontend and backend technologies. Committed to clean code and best practices.'),
('David Brown', 'davidbrown5@gmail.com', 'ROLE_CANDIDATE', 'Backend Developer', 'Results-driven professional with strong analytical skills. Experience in agile methodologies and continuous integration.'),
('Eva Davis', 'evadavis6@yahoo.com', 'ROLE_CANDIDATE', 'DevOps Engineer', 'Creative problem solver with expertise in user experience design. Strong collaboration and communication skills.'),
('Frank Miller', 'frankmiller7@hotmail.com', 'ROLE_CANDIDATE', 'Data Scientist', 'Detail-oriented engineer with focus on performance optimization and scalability. Experience with distributed systems.'),
('Grace Wilson', 'gracewilson8@outlook.com', 'ROLE_CANDIDATE', 'Product Manager', 'Innovative developer passionate about emerging technologies. Strong foundation in computer science fundamentals.'),
('Henry Taylor', 'henrytaylor9@gmail.com', 'ROLE_CANDIDATE', 'UI/UX Designer', 'Experienced team player with leadership capabilities. Proven ability to deliver complex projects on time.'),
('Ivy Anderson', 'ivyanderson10@yahoo.com', 'ROLE_CANDIDATE', 'Quality Assurance Engineer', 'Versatile professional with broad technical skills. Adaptable to new technologies and changing requirements.'),
('Jack Thomas', 'jackthomas11@hotmail.com', 'ROLE_CANDIDATE', 'System Administrator', 'Experienced professional with 5+ years in software development. Skilled in Java, Spring Boot, and microservices architecture.'),
('Kate Jackson', 'katejackson12@outlook.com', 'ROLE_CANDIDATE', 'Database Administrator', 'Passionate developer with expertise in modern web technologies. Strong background in React, Node.js, and cloud platforms.'),
('Leo White', 'leowhite13@gmail.com', 'ROLE_CANDIDATE', 'Business Analyst', 'Senior engineer with proven track record in enterprise applications. Specializes in system design and team leadership.'),
('Mia Harris', 'miaharris14@yahoo.com', 'ROLE_CANDIDATE', 'Project Manager', 'Full-stack developer with experience in both frontend and backend technologies. Committed to clean code and best practices.'),
('Noah Martin', 'noahmartin15@hotmail.com', 'ROLE_CANDIDATE', 'Technical Lead', 'Results-driven professional with strong analytical skills. Experience in agile methodologies and continuous integration.'),
('Olivia Thompson', 'oliviathompson16@outlook.com', 'ROLE_CANDIDATE', 'Software Architect', 'Creative problem solver with expertise in user experience design. Strong collaboration and communication skills.'),
('Paul Garcia', 'paulgarcia17@gmail.com', 'ROLE_CANDIDATE', 'Mobile Developer', 'Detail-oriented engineer with focus on performance optimization and scalability. Experience with distributed systems.'),
('Quinn Rodriguez', 'quinnrodriguez18@yahoo.com', 'ROLE_CANDIDATE', 'Cloud Engineer', 'Innovative developer passionate about emerging technologies. Strong foundation in computer science fundamentals.'),
('Ruby Martinez', 'rubymartinez19@hotmail.com', 'ROLE_CANDIDATE', 'Security Engineer', 'Experienced team player with leadership capabilities. Proven ability to deliver complex projects on time.'),
('Sam Hernandez', 'samhernandez20@outlook.com', 'ROLE_CANDIDATE', 'Machine Learning Engineer', 'Versatile professional with broad technical skills. Adaptable to new technologies and changing requirements.'),
('Tina Lopez', 'tinalopez21@gmail.com', 'ROLE_CANDIDATE', 'Software Developer', 'Experienced professional with 5+ years in software development. Skilled in Java, Spring Boot, and microservices architecture.'),
('Uma Gonzalez', 'umagonzalez22@yahoo.com', 'ROLE_CANDIDATE', 'Senior Java Developer', 'Passionate developer with expertise in modern web technologies. Strong background in React, Node.js, and cloud platforms.'),
('Victor Wilson', 'victorwilson23@hotmail.com', 'ROLE_CANDIDATE', 'Full Stack Developer', 'Senior engineer with proven track record in enterprise applications. Specializes in system design and team leadership.'),
('Wendy Anderson', 'wendyanderson24@outlook.com', 'ROLE_CANDIDATE', 'Frontend Developer', 'Full-stack developer with experience in both frontend and backend technologies. Committed to clean code and best practices.'),
('Xavier Thomas', 'xavierthomas25@gmail.com', 'ROLE_CANDIDATE', 'Backend Developer', 'Results-driven professional with strong analytical skills. Experience in agile methodologies and continuous integration.'),
('Yara Jackson', 'yarajackson26@yahoo.com', 'ROLE_CANDIDATE', 'DevOps Engineer', 'Creative problem solver with expertise in user experience design. Strong collaboration and communication skills.'),
('Zoe White', 'zoewhite27@hotmail.com', 'ROLE_CANDIDATE', 'Data Scientist', 'Detail-oriented engineer with focus on performance optimization and scalability. Experience with distributed systems.'),
('Adam Harris', 'adamharris28@outlook.com', 'ROLE_CANDIDATE', 'Product Manager', 'Innovative developer passionate about emerging technologies. Strong foundation in computer science fundamentals.'),
('Bella Martin', 'bellamartin29@gmail.com', 'ROLE_CANDIDATE', 'UI/UX Designer', 'Experienced team player with leadership capabilities. Proven ability to deliver complex projects on time.'),
('Chris Thompson', 'christhompson30@yahoo.com', 'ROLE_CANDIDATE', 'Quality Assurance Engineer', 'Versatile professional with broad technical skills. Adaptable to new technologies and changing requirements.');