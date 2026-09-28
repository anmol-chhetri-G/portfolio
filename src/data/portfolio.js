/**
 * Single source of truth for everything on the site.
 * Edit the values below — no component changes required.
 */

export const profile = {
  name: 'Your Name',
  role: 'Your Role',
  tagline: 'A one-line summary of what you build and why it matters.',
  bio: [
    'Replace this paragraph with two or three sentences about your background, the problems you like to solve, and what you are looking for next.',
    'Keep it concrete. What do you work on day to day, and what have you shipped that you are proud of?',
  ],
  location: 'City, Country',
  email: 'you@example.com',
  resumeUrl: '#',
  links: [
    { label: 'GitHub', href: 'https://github.com/your-handle' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle' },
    { label: 'Email', href: 'mailto:you@example.com' },
  ],
}

export const projects = [
  {
    slug: 'project-one',
    title: 'Project One',
    blurb: 'Short description shown on the project card.',
    description:
      'Longer description shown on the detail page. Explain the problem, your approach, and the outcome.',
    tech: ['React', 'TypeScript', 'Vite'],
    year: '2026',
    repo: 'https://github.com/your-handle/project-one',
    live: 'https://example.com',
  },
  {
    slug: 'project-two',
    title: 'Project Two',
    blurb: 'Short description shown on the project card.',
    description:
      'Longer description shown on the detail page. Explain the problem, your approach, and the outcome.',
    tech: ['Node.js', 'PostgreSQL'],
    year: '2025',
    repo: 'https://github.com/your-handle/project-two',
    live: '',
  },
  {
    slug: 'project-three',
    title: 'Project Three',
    blurb: 'Short description shown on the project card.',
    description:
      'Longer description shown on the detail page. Explain the problem, your approach, and the outcome.',
    tech: ['Python', 'React'],
    year: '2024',
    repo: 'https://github.com/your-handle/project-three',
    live: '',
  },
]

export const skills = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
  { group: 'Frontend', items: ['React', 'Vite', 'CSS', 'Accessibility'] },
  { group: 'Backend', items: ['Node.js', 'REST APIs', 'PostgreSQL'] },
  { group: 'Tooling', items: ['Git', 'Vercel', 'Cloudflare', 'Testing'] },
]

export const experience = [
  {
    role: 'Your Job Title',
    org: 'Company Name',
    period: '2024 — Present',
    points: ['What you did there, in one line.', 'A measurable outcome, with numbers if you have them.'],
  },
  {
    role: 'Previous Job Title',
    org: 'Previous Company',
    period: '2022 — 2024',
    points: ['What you did there, in one line.', 'A measurable outcome, with numbers if you have them.'],
  },
]
