import { ATSStatus } from "@/types/ats";

export const RETELL_AGENT_GENERAL_PROMPT = `You are an interviewer who is an expert in asking follow up questions to uncover deeper insights. You have to keep the interview for {{mins}} or short. 

The name of the person you are interviewing is {{name}}. 

The interview objective is {{objective}}.

These are some of the questions you can ask.
{{questions}}

Once you ask a question, make sure you ask a follow up question on it.

Follow the guidlines below when conversing.
- Follow a professional yet friendly tone.
- Ask precise and open-ended questions
- The question word count should be 30 words or less
- Make sure you do not repeat any of the questions.
- Do not talk about anything not related to the objective and the given questions.
- If the name is given, use it in the conversation.`;

export const INTERVIEWERS = {
  LISA: {
    name: "Alaa",
    rapport: 7,
    exploration: 10,
    empathy: 7,
    speed: 5,
    image: "/interviewers/hijab_female.png",
    description:
      "Hi! I'm Alaa, an enthusiastic and empathetic interviewer who loves to explore. With a perfect balance of empathy and rapport, I delve deep into conversations while maintaining a steady pace. Let's embark on this journey together and uncover meaningful insights!",
    audio: "Lisa.wav",
  },
  BOB: {
    name: "Noman",
    rapport: 7,
    exploration: 7,
    empathy: 10,
    speed: 5,
    image: "/interviewers/Bob.png",
    description:
      "Hi! I'm Noman, your go-to empathetic interviewer. I excel at understanding and connecting with people on a deeper level, ensuring every conversation is insightful and meaningful. With a focus on empathy, I'm here to listen and learn from you. Let's create a genuine connection!",
    audio: "Bob.wav",
  },
};

export const ATS_APPLICANTS = [
  {
    id: '1',
    name: 'Ahmad Medhat',
    email: 'ahmadmed7at77@gmail.com',
    position: 'Senior Mobile Developer',
    appliedAt: new Date('2024-01-15'),
    status: ATSStatus.NEW,
    score: 85,
    skills: ['ReactNative','React', 'TypeScript', 'Node.js', 'AWS'],
    experience: '5 years',
    education: 'BS Computer Science',
    notes: 'Strong ReactNative background, good communication skills'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    position: 'Full Stack Developer',
    appliedAt: new Date('2024-01-14'),
    status: ATSStatus.SCREENING,
    score: 92,
    skills: ['React', 'Python', 'Django', 'PostgreSQL'],
    experience: '4 years',
    education: 'MS Software Engineering',
    notes: 'Excellent technical skills, passed initial screening'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    position: 'Backend Developer',
    appliedAt: new Date('2024-01-13'),
    status: ATSStatus.INTERVIEW,
    score: 78,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
    experience: '6 years',
    education: 'BS Computer Engineering',
    notes: 'Strong backend experience, scheduled for technical interview'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    position: 'UI/UX Designer',
    appliedAt: new Date('2024-01-12'),
    status: ATSStatus.REJECTED,
    score: 65,
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    experience: '3 years',
    education: 'BA Design',
    notes: 'Good design skills but not the right fit for our current needs'
  },
  {
    id: '5',
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@email.com',
    position: 'DevOps Engineer',
    appliedAt: new Date('2024-01-11'),
    status: ATSStatus.HIRED,
    score: 95,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    experience: '7 years',
    education: 'BS Computer Science',
    notes: 'Perfect match for our infrastructure needs'
  }
]


export const BUSINESS_INFO = {
  name: '3AM',
  email: 'info@3am.com',
  phone: '+201121531670',
  address: '123 Main St, Cairo, Egypt',
  website: `https://${process.env.NEXT_PUBLIC_LIVE_URL}`,
  interviewUrl: `${process.env.NEXT_PUBLIC_LIVE_URL}/call/gradion-backend`
}

export const APP_COLORS = {
  PRIMARY: "#FF5E1F",
  PRIMARY_LIGHT: "#FF7A47",
}
