const typingWords = ['AI Marketing Intern', 'Full-Stack Web Developer', 'Programmer', 'AI Fluency', 'Machine Learning'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typingText = document.getElementById('typingText');

function typeEffect() {
  if (!typingText) return;
  const word = typingWords[wordIndex];
  typingText.textContent = deleting
    ? word.slice(0, charIndex - 1)
    : word.slice(0, charIndex + 1);

  charIndex += deleting ? -1 : 1;
  let delay = deleting ? 55 : 95;

  if (!deleting && charIndex === word.length) {
    deleting = true;
    delay = 1300;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % typingWords.length;
    delay = 300;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuToggle.textContent = isOpen ? '×' : '☰';
});

navLinks?.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.textContent = '☰';
  })
);

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

async function loadProfile() {
  const profile = await fetchJson('/api/profile');

  document.getElementById('objectiveText').textContent = profile.objective;

  document.getElementById('servicesGrid').innerHTML = profile.services.map((service, index) => `
    <article class="service-card reveal">
      <div class="service-icon">${String(index + 1).padStart(2, '0')}</div>
      <h3>${service}</h3>
      <p>Practical, user-focused solutions tailored to your project requirements.</p>
    </article>
  `).join('');

  document.getElementById('skillsList').innerHTML = profile.skills
    .map(skill => `<span class="skill">${skill}</span>`)
    .join('');

  document.getElementById('experienceList').innerHTML = profile.experience.map(item => `
    <article class="timeline-item reveal">
      <h3>${item.role} — ${item.organization}</h3>
      <p class="period">${item.period}</p>
      <ul>${item.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
    </article>
  `).join('');

  activateReveal();
}

let allProjects = [];

async function loadProjects() {
  allProjects = await fetchJson('/api/projects');

  const categories = ['All', ...new Set(allProjects.map(project => project.category))];
  document.getElementById('filters').innerHTML = categories.map((category, index) => `
    <button class="filter ${index === 0 ? 'selected' : ''}" data-category="${category}">
      ${category}
    </button>
  `).join('');

  document.querySelectorAll('.filter').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      renderProjects(button.dataset.category);
    });
  });

  renderProjects('All');
}

function renderProjects(category) {
  const projects = category === 'All'
    ? allProjects
    : allProjects.filter(project => project.category === category);

  document.getElementById('projectsGrid').innerHTML = projects.map(project => {
    const links = [];

    if (project.demo) {
      links.push(`<a class="project-link" href="${project.demo}" target="_blank" rel="noopener noreferrer">${project.label || 'Live Demo'} ↗</a>`);
    }

    if (project.github) {
      links.push(`<a class="project-link secondary-link" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`);
    }

    return `
      <article class="project-card reveal">
        <div>
          <p class="project-meta">${project.category}${project.internship ? ` • ${project.internship}` : ''}</p>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>
        <div class="project-links">${links.join('')}</div>
      </article>
    `;
  }).join('');

  activateReveal();
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function activateReveal() {
  document.querySelectorAll('.reveal:not(.show)').forEach(element => revealObserver.observe(element));
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.45 });

document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));

const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', async event => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(form).entries());

  status.textContent = 'Sending...';
  status.className = 'form-status';
  button.disabled = true;
  button.textContent = 'Sending...';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to send message.');

    status.textContent = result.message;
    status.className = 'form-status success';
    form.reset();
  } catch (error) {
    status.textContent = error.message || 'Could not send the message. Please email me directly.';
    status.className = 'form-status error';
  } finally {
    button.disabled = false;
    button.textContent = 'Send Message';
  }
});

Promise.all([loadProfile(), loadProjects()]).catch(error => {
  console.error('Portfolio loading error:', error);
  const status = document.getElementById('formStatus');
  if (status) status.textContent = 'Some portfolio data could not be loaded. Please refresh the page.';
});
