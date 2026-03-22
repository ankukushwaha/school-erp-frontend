export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  academicsOverview: '/academics/overview',
  academics: '/academics/academic-year',
  acedmicCalendar: '/academics/acedmic-calendar',
  classManagement: '/academics/classManagement',
  sectionManagement: '/academics/SectionManagement',
  subjectEntry: '/academics/subjectEntry',
  subjectMapping: '/academics/subject-mapping',
  admission: '/admission/dashboard',
  admissionOverview: '/admission/overview',
  enquiryFormPage: '/admission/enquiry-form',
  enquiryListPage: '/admission/enquiries-list',
  StudentRegistration: '/admission/student-registration',
  students: '/students',
  fees: '/fees',
  setting: '/setting/SettingsPage',
  attendance: '/attendance',
  profile: '/profile',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
