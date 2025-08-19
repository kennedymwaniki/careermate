export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  message: string;
  status: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  profile?: Profile;
  resumes: Resume[];
}

export interface Profile {
  id?: number;
  fullname?: string;
  image?: string;
  experience?: number;
  phone?: string;
  userId?: number;
  user?: User;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface Education {
  id?: number;
  degree: string;
  coursename: string;
  institution: string;
  startYear: number;
  endYear: number;
}

interface Experience {
  id?: number;
  title: string;
  companyName: string;
  startYear: number;
  endYear: number;
  duration: string;
}

export interface UserProfile {
  id: number;
  fullname: string;
  image: string;
  bio: string;
  skills: string[];
  phone: string;
  availability: string;
  experience: Experience[];
  education: Education[];
}

export interface Resume {
  id: number;
  userId: number;
  fileurl: string;
  filepath: string;
  createdAt?: string;
}
