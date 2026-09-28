/**
 * Single source of truth for everything on the site.
 * Edit the values below — no component changes required.
 */

export const profile = {
  name: 'Anmol Singh Chhetri',
  role: 'Cybersecurity Student · Blue Team Core, Red Team Curiosity',
  location: 'Kirtipur, Kathmandu, Nepal',
  email: 'anmolsinghchetri34@gmail.com',
  phone: '+977 9800532114',
  github: 'https://github.com/anmol-chhetri-G',
  // TODO: replace with your actual profile URL
  linkedin: 'https://www.linkedin.com/',
  summary:
    'I take an integrated approach to security — bridging offensive testing and defensive response. Deep-dive incident analysis and alert triage in Splunk, Elastic, and Wazuh, backed by hands-on practice in network reconnaissance and web vulnerability testing.',
  education: [
    {
      title: 'BSc (Hons) Ethical Hacking and Cybersecurity',
      place: 'Softwarica College of IT and E-Commerce / Coventry University',
      period: '2024 – Present',
    },
    {
      title: 'High School',
      place: 'Adarsh Madhyamik Vidhyalaya, Nepalgunj',
      period: '2022 – 2024',
    },
  ],
  skills: [
    { label: 'Languages', items: ['Python', 'C', 'Bash', 'Rust', 'PowerShell'] },
    {
      label: 'SIEM & Log Analysis',
      items: ['Splunk', 'Elastic', 'Wazuh', 'TryHackMe', 'Hack The Box', 'Hive'],
    },
    {
      label: 'Networking',
      items: ['TCP/IP', 'Subnetting', 'SSH', 'VTP', 'Ports & Protocols'],
    },
    { label: 'Systems', items: ['Linux', 'Windows', 'Cross-platform tooling'] },
  ],
  certs: [
    'Certified Cybersecurity Foundations (CORE)',
    'Certified Red Team Operations Manager (CRTOM)',
    'CAPIJ — Certified API Hacking Junior',
    'HackAstra Finalist — Ranked 12th',
  ],
  projects: [
    {
      slug: 'network-ids',
      title: 'Network Intrusion Detection System',
      blurb:
        'Real-time Python IDS for TCP/IP traffic monitoring with signature-based analysis to automate detection of unauthorized network probes.',
      description:
        'A real-time intrusion detection system written in Python that monitors TCP/IP traffic and applies signature-based analysis to flag unauthorized network probes automatically. Built to learn what reconnaissance looks like from the defender’s side of the wire.',
      tags: ['Python', 'TCP/IP', 'Signature Analysis'],
      // TODO: paste the repo URL, e.g. 'https://github.com/anmol-chhetri-G/network-ids'
      repo: '',
    },
    {
      slug: 'steganography',
      title: 'LSB Steganography Tool',
      blurb:
        'Python application for secure message embedding and extraction using least-significant-bit steganography.',
      description:
        'A Python application that hides messages inside images by manipulating least-significant bits, and extracts them back out without visibly altering the carrier. An exercise in how data exfiltration can hide in plain sight.',
      tags: ['Python', 'LSB', 'Cryptography'],
      // TODO: paste the repo URL
      repo: '',
    },
    {
      slug: 'keylogger',
      title: 'Cross-Platform Keylogger',
      blurb:
        'Educational keylogger using pynput for keystroke capture with OS detection — built to understand offensive monitoring techniques.',
      description:
        'A lab-environment keylogger using pynput for keystroke capture with OS detection across platforms. Built strictly for education: to understand the offensive monitoring techniques that endpoint defenders must detect and stop.',
      tags: ['Python', 'pynput', 'Recon'],
      // TODO: paste the repo URL
      repo: '',
    },
    {
      slug: 'password-manager',
      title: 'Password Manager',
      blurb:
        'Python-based credential storage manager emphasizing secure handling fundamentals and hands-on application development.',
      description:
        'A Python credential storage manager focused on secure handling fundamentals — a hands-on way to learn what separates careful secret management from the mistakes that lead to breaches.',
      tags: ['Python', 'Security', 'CLI'],
      // TODO: paste the repo URL
      repo: '',
    },
  ],
}
