/* ────────────────────────────────────────────────────────────────
   All site text and links live here.

   TODO(Yogesh): fill in the empty strings / nulls marked TODO.
   Anything left empty is hidden automatically, so nothing on the
   site looks broken in the meantime.
   ──────────────────────────────────────────────────────────────── */

export const PROFILE = {
  name: 'Yogesh Ahlawat',
  firstName: 'Yogesh',
  lastName: 'Ahlawat',
  tagline: 'I turn ideas into working products — on screens and on circuit boards.',
  location: 'Delhi, India',
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/yogesh001-gif',
  linkedin: 'https://www.linkedin.com/in/yogeshahlawat/',
  email: '', // TODO: e.g. 'you@gmail.com' (shown as a mailto link)
  resume: '', // TODO: e.g. '/resume.pdf' (put the PDF in /public) or a Google Drive link
};

export const ACADEMIC_PROFILE = {
  program: 'B.Tech ECE',
  college: 'Maharaja Agrasen Institute of Technology',
  collegeShort: 'MAIT',
  admissionYear: 2024,
  graduationYear: 2028,
  firstSemesterStartMonth: 7, // odd semesters start in July/August
  totalSemesters: 8,
};

export const ROLES = [
  'Full-Stack Developer',
  'Embedded Systems Builder',
  'IoT Tinkerer',
  'Problem Solver',
];

export const EDUCATION = [
  {
    title: 'B.Tech — Electronics & Communication',
    date: '2024 — 2028',
    place: 'Maharaja Agrasen Institute of Technology (MAIT), Delhi',
    current: true,
  },
  {
    title: 'Class 12 — Science (PCM)',
    date: '2023',
    place: 'New Pragati Senior Secondary School, Jind',
  },
];

export const INTERESTS = ['Full-stack web', 'Embedded & IoT', 'Applied AI', 'Product design'];

/* Projects
   github / live: set to a URL, or null to hide the button.
   TODO(Yogesh): add the exact repo URLs for Khushi Fashion, Buskiबात and TrafficX. */
export const PROJECTS = [
  {
    id: 'finance',
    title: 'AI Personal Finance Advisor',
    year: '2025',
    kind: 'AI · Web app',
    icon: 'chart',
    colors: ['#4338ca', '#a78bfa'],
    description:
      'An AI-powered finance coach that tracks transactions, optimises budgets and suggests investments based on what you can actually afford.',
    features: [
      'AI analysis of spending with budget optimisation',
      'Investment suggestions matched to capacity',
      'Income vs expense charts and spending patterns',
      'Tax-saving strategy recommendations',
    ],
    tech: ['Node.js', 'MongoDB', 'Chart.js', 'AI APIs', 'JavaScript'],
    github: 'https://github.com/yogesh001-gif/ai-finance-advisor',
    live: null,
  },
  {
    id: 'khushi',
    title: 'Khushi Fashion',
    year: '2025',
    kind: 'E-commerce',
    icon: 'bag',
    colors: ['#b45309', '#fbbf24'],
    description:
      'A modern storefront for a fashion brand with smooth product browsing, filters, cart management and a polished mobile-first checkout flow.',
    features: [
      'Responsive catalogue with filters',
      'Cart and checkout flow',
      'Micro-animations throughout',
      'Mobile-first layout',
    ],
    tech: ['React', 'Node.js', 'Tailwind CSS', 'JavaScript'],
    github: null, // TODO: repo URL
    live: null,
  },
  {
    id: 'buskibaat',
    title: 'Buskiबात',
    year: '2025',
    kind: 'Real-time social',
    icon: 'chat',
    colors: ['#0369a1', '#38bdf8'],
    description:
      'A real-time chat and community platform — instant messaging, rich media sharing and channels for focused discussions.',
    features: [
      'Real-time messaging over WebSockets',
      'Rich media sharing with previews',
      'Community channels and threads',
      'Responsive, mobile-friendly UI',
    ],
    tech: ['React', 'Spring Boot', 'WebSocket', 'JavaScript'],
    github: null, // TODO: repo URL
    live: null,
  },
  {
    id: 'aws',
    title: 'AWS × MAIT',
    year: '2025',
    kind: 'Official platform',
    icon: 'cloud',
    colors: ['#15803d', '#4ade80'],
    description:
      'The digital home of the AWS × MAIT partnership — cloud curriculum, AWS Academy integration and certification pathways for students.',
    features: [
      'AWS Academy and Educate showcase',
      'Cloud certification pathways',
      'Student resource hub',
      'Fast, responsive static build',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'AWS'],
    github: null,
    live: 'https://aws-mait.netlify.app',
  },
];

export const HARDWARE_PROJECT = {
  id: 'trafficx',
  title: 'TrafficX',
  subtitle: 'Smart adaptive traffic system',
  year: '2025',
  description:
    'An IoT traffic controller that measures queue length at every approach with HC-SR04 ultrasonic sensors and lets an ESP32 re-time the signals in real time — busy roads get longer greens, empty ones don’t hold anyone up.',
  steps: [
    { title: 'Sense', text: 'HC-SR04 sensors ping each lane to estimate how many vehicles are waiting.' },
    { title: 'Decide', text: 'The ESP32 compares density across approaches every cycle.' },
    { title: 'Adapt', text: 'Green time scales with demand, within safe min/max limits.' },
  ],
  tech: ['C++', 'ESP32', 'HC-SR04', 'IoT', 'Arduino'],
  github: null, // TODO: repo URL
  live: null,
};

export const TECH_STACK = [
  { name: 'C++', category: 'Languages', color: '#5b8fd6' },
  { name: 'C', category: 'Languages', color: '#A8B9CC' },
  { name: 'Java', category: 'Languages', color: '#ED8B00' },
  { name: 'JavaScript', category: 'Languages', color: '#F7DF1E' },
  { name: 'Python', category: 'Languages', color: '#4B8BBE' },
  { name: 'React', category: 'Frontend', color: '#61DAFB' },
  { name: 'Tailwind', category: 'Frontend', color: '#38BDF8' },
  { name: 'HTML5', category: 'Frontend', color: '#E34F26' },
  { name: 'CSS3', category: 'Frontend', color: '#2965f1' },
  { name: 'Node.js', category: 'Backend', color: '#5FA04E' },
  { name: 'Spring Boot', category: 'Backend', color: '#6DB33F' },
  { name: 'MongoDB', category: 'Backend', color: '#47A248' },
  { name: 'Git', category: 'Tools', color: '#F05032' },
  { name: 'VS Code', category: 'Tools', color: '#3b9ce0' },
  { name: 'Arduino', category: 'Hardware', color: '#00979D' },
  { name: 'ESP32', category: 'Hardware', color: '#E7352C' },
];

export const TECH_CATEGORIES = ['Languages', 'Frontend', 'Backend', 'Tools', 'Hardware'];

/* Certificates — thumbnails are pre-generated in /public/certificates.
   `original` is the untouched file (PDF or PNG) for "Open original". */
export const CERTIFICATIONS = [
  {
    id: 'career-essentials-genai',
    title: 'Career Essentials in Generative AI',
    issuer: 'Microsoft & LinkedIn',
    date: 'Jul 2025',
    tag: 'Learning path',
    original: '/certificates-pic/CertificateOfCompletion_Career Essentials in Generative AI by Microsoft and LinkedIn (1).pdf',
  },
  {
    id: 'intro-ai',
    title: 'Introduction to Artificial Intelligence',
    issuer: 'LinkedIn Learning',
    date: 'Jul 2025',
    tag: 'AI',
    original: '/certificates-pic/CertificateOfCompletion_Introduction to Artificial Intelligence (1).pdf',
  },
  {
    id: 'ethics-genai',
    title: 'Ethics in the Age of Generative AI',
    issuer: 'LinkedIn Learning',
    date: 'Jul 2025',
    tag: 'AI',
    original: '/certificates-pic/CertificateOfCompletion_Ethics in the Age of Generative AI (1).pdf',
  },
  {
    id: 'genai-online-search',
    title: 'Generative AI: The Evolution of Thoughtful Online Search',
    issuer: 'LinkedIn Learning',
    date: 'Jul 2025',
    tag: 'AI',
    original: '/certificates-pic/CertificateOfCompletion_Generative AI The Evolution of Thoughtful Online Search.pdf',
  },
  {
    id: 'm365-copilot',
    title: 'Learning Microsoft 365 Copilot for Work',
    issuer: 'LinkedIn Learning',
    date: 'Jul 2025',
    tag: 'Productivity',
    original: '/certificates-pic/CertificateOfCompletion_Learning Microsoft 365 Copilot for Work.pdf',
  },
  {
    id: 'streamlining-copilot',
    title: 'Streamlining Your Work with Microsoft Copilot',
    issuer: 'LinkedIn Learning',
    date: 'Jul 2025',
    tag: 'Productivity',
    original: '/certificates-pic/CertificateOfCompletion_Streamlining Your Work with Microsoft Copilot.pdf',
  },
  {
    id: 'participation',
    title: 'The AI Hiring Show: Vibe Coding, Power Hiring',
    issuer: 'Rabbitt Learning',
    date: 'Aug 2025',
    tag: 'Participation',
    original: '/certificates-pic/Certification_Of_Participation.png',
  },
  {
    id: 'cpp',
    title: 'C++ Programming for Beginners',
    issuer: 'GUVI × HCL',
    date: 'Apr 2025',
    tag: 'Programming',
    original: '/certificates-pic/C++Programing.png',
  },
  {
    id: 'chatgpt-everyone',
    title: 'ChatGPT for Everyone',
    issuer: 'GUVI × HCL',
    date: 'Dec 2024',
    tag: 'AI',
    original: '/certificates-pic/ChatGPTforeveryone.png',
  },
  {
    id: 'html5-js-css3',
    title: 'HTML & CSS',
    issuer: 'GUVI × HCL',
    date: 'May 2024',
    tag: 'Web',
    original: '/certificates-pic/PrograminginHTML5withJAVAscriptandCSS3.png',
  },
];

/* Sections, in scroll order. Each one is a "station" the 3D camera flies to. */
export const SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'trafficx', label: 'TrafficX' },
  { id: 'skills', label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];
