-- Insert sample interviews for candidates
-- Note: user_id references are based on the order of candidates inserted (starting from id 21, since 2 admins + 18 recruiters = 20)

INSERT INTO interviews (user_id, position, score) VALUES 
-- Scored interviews (candidates have been evaluated)
(21, 'Senior Java Developer', 85),
(22, 'Full Stack Developer', 92),
(23, 'Frontend Developer', 78),
(24, 'Backend Developer', 88),
(25, 'DevOps Engineer', 81),
(26, 'Data Scientist', 95),
(27, 'Product Manager', 73),
(28, 'UI/UX Designer', 87),
(29, 'Quality Assurance Engineer', 82),
(30, 'System Administrator', 76),
(31, 'Database Administrator', 90),
(32, 'Business Analyst', 84),
(33, 'Project Manager', 79),
(34, 'Technical Lead', 91),
(35, 'Software Architect', 89),

-- Unscored interviews (pending evaluation)
(36, 'Mobile Developer', 0),
(37, 'Cloud Engineer', 0),
(38, 'Security Engineer', 0),
(39, 'Machine Learning Engineer', 0),
(40, 'Software Developer', 0),
(41, 'Senior Java Developer', 0);