# Umaira Sadaf — Full-Stack Portfolio

A responsive, production-style personal portfolio for Umaira Sadaf, built with semantic HTML, CSS, vanilla JavaScript and a Node.js/Express backend.

## Included

- Responsive dark/gold portfolio UI
- Hero typing animation and scroll-reveal animations
- About, services, experience, skills, projects and contact sections
- CodeAlpha internship portfolio projects with live Vercel demos
- Project category filtering
- Mobile navigation
- API-driven profile and project content
- Working contact form backed by Express
- Contact messages persisted to `data/messages.json`
- Health endpoint at `/api/health`
- Basic request validation and API error handling

## Featured CodeAlpha projects

- Real-Time Collaboration App: https://realtime-collaboration-app.vercel.app
- Pulse Social Platform: https://pulse-social-platform-xi.vercel.app

## Run locally

Requirements: Node.js 18+ recommended.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

For development with Node's watch mode:

```bash
npm run dev
```

## API

- `GET /api/health` — server health check
- `GET /api/profile` — profile, services, skills and experience
- `GET /api/projects` — project data
- `POST /api/contact` — validates and stores contact messages

### Example contact request

```json
{
  "name": "Client Name",
  "email": "client@example.com",
  "message": "I would like to discuss a website project."
}
```

## Project structure

```text
umaira-portfolio/
├── data/
│   ├── messages.json
│   └── projects.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Contact

- Email: sadaffarid069@gmail.com
- Phone: 03176480080
- GitHub: https://github.com/humerasadaf59-lab
- LinkedIn: https://www.linkedin.com/in/umaira-sadaf-163aaa2a9

## Production note

The current contact backend persists messages to a local JSON file, which is appropriate for local development/demo hosting. For a production deployment, replace this persistence layer with PostgreSQL/Supabase/MongoDB and connect an email provider for notifications. Keep secrets in environment variables and never commit `.env` files.
