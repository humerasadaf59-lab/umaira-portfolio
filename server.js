const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const dataDirectory = path.join(__dirname, 'data');
const messagesFile = path.join(dataDirectory, 'messages.json');
const projectsFile = path.join(dataDirectory, 'projects.json');

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

const profile = {
  name: 'Umaira Sadaf',
  title: 'AI Marketing Intern | Full-Stack Web Developer | Computer Science Student',
  education: 'BS Computer Science — 6th Semester',
  institution: 'Government Graduate College, Vehari',
  cgpa: '3.84 / 4.00',
  email: 'sadaffarid069@gmail.com',
  phone: '03176480080',
  portfolio: 'https://humerasadaf59-lab.github.io',
  github: 'https://github.com/humerasadaf59-lab',
  linkedin: 'https://linkedin.com/in/umairasadaf-163aaa2a9',
  objective: 'AI Marketing Intern with FlyRank AI, building AI Fluency across marketing workflows including LLM-assisted content evaluation, AI-driven campaign research and applied machine-learning fundamentals. Seeking to grow into a full-time AI Marketing role while combining AI fluency with hands-on software development and full-stack web engineering.',
  skills: [
    'AI Fluency and LLM tools',
    'AI Marketing and campaign research',
    'Prompt engineering and A/B testing',
    'Machine Learning fundamentals',
    'C++ / OOP / Data Structures',
    'JavaScript, React and Node.js',
    'Git and GitHub',
    'REST APIs and web development',
    'Technical communication and SEO'
  ],
  experience: [
    {
      role: 'AI Marketing Intern',
      organization: 'FlyRank AI Internship Program',
      period: 'Jul 2026 – Present',
      details: [
        "Completing FlyRank AI's AI Marketing track and applying AI fluency and LLM tools to marketing research and content tasks.",
        'Evaluating AI/LLM marketing drafts weekly and improving content quality.',
        'Building foundational machine-learning knowledge for marketing analytics use cases.',
        'Working toward a verifiable FlyRank credential and capstone project.'
      ]
    },
    {
      role: 'Full Stack Web Development Intern',
      organization: 'CodeAlpha',
      period: 'Internship Portfolio Projects',
      details: [
        'Built and deployed production-style full-stack web projects as part of the CodeAlpha internship portfolio.',
        'Delivered a real-time collaboration application and a social platform with live hosted demos.'
      ]
    },
    {
      role: 'Intern',
      organization: 'InternGrow.official',
      period: 'Aug 2026 – Present',
      details: [
        'Completed hands-on C++ development tasks, including a banking transaction engine, secure authentication system and automated semester CGPA planner.',
        'Applied object-oriented programming and data structures to real project scenarios.'
      ]
    },
    {
      role: 'Team Lead',
      organization: 'HACKTHONYPERU — Tecnología e Innovación',
      period: 'Aug 2026 – Present',
      details: [
        'Led a team building an urban heat island analysis tool using the FortGuard Temperature API.',
        'Delivered a Streamlit demo and recommendations for tree planting and cooling-center placement.'
      ]
    }
  ],
  certifications: [
    'HP Certified — AI Business Professional (HP LIFE)',
    'Saylor Academy Certificate — Software Engineering',
    'Anthropic — Claude 101, Claude Platform, Claude Cowork, Agent Skills and Claude on Google Cloud'
  ],
  services: [
    'Website Development',
    'AI Fluency Consulting',
    'AI Marketing Support',
    'Machine Learning Prototypes',
    'Frontend and Full-Stack Development',
    'Programming Projects'
  ]
};

function ensureDataFiles() {
  if (!fs.existsSync(dataDirectory)) fs.mkdirSync(dataDirectory, { recursive: true });
  if (!fs.existsSync(messagesFile)) fs.writeFileSync(messagesFile, '[]');
  if (!fs.existsSync(projectsFile)) fs.writeFileSync(projectsFile, '[]');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

ensureDataFiles();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'umaira-sadaf-portfolio', timestamp: new Date().toISOString() });
});

app.get('/api/profile', (req, res) => {
  res.json(profile);
});

app.get('/api/projects', (req, res) => {
  res.json(readJson(projectsFile));
});

app.post('/api/contact', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }

  if (name.length > 80 || email.length > 160 || message.length > 3000) {
    return res.status(400).json({ success: false, message: 'Please keep your message within the allowed length.' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  const messages = readJson(messagesFile);
  messages.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    message,
    createdAt: new Date().toISOString()
  });
  writeJson(messagesFile, messages);

  return res.status(201).json({ success: true, message: 'Thank you! Your message has been received.' });
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const PORT = process.env.PORT || 3001;
if (require.main === module) 
module.exports = app;

