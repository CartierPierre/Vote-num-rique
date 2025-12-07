
export type UserRole = 'CITIZEN' | 'OFFICIAL';

export type ProposalStatus = 'DRAFT' | 'COUNCIL_REVIEW' | 'ARGUMENTATION' | 'VOTING' | 'CLOSED';

export interface VerificationReport {
  neutralSummary: string;
  factCheckAnalysis: string;
  sources: string[];
}

export interface Proposal {
  id: string;
  title: string;
  location: string;
  deadline: string;
  summary: string;
  pros: string[];
  cons: string[];
  imageUrl: string;
  status: ProposalStatus;
  verificationReport?: VerificationReport;
  // Raw arguments input by officials before AI processing
  rawMajorityArgs?: string;
  rawOppositionArgs?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export type VoteType = 'FOR' | 'AGAINST' | 'ABSTAIN' | null;

export enum AppStep {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  OFFICIAL_WORKSPACE = 'OFFICIAL_WORKSPACE', // New step for editing
  READING = 'READING',
  QUIZ = 'QUIZ',
  VOTING = 'VOTING',
  CONFIRMATION = 'CONFIRMATION'
}

export interface User {
  name: string;
  role: UserRole;
  franceConnectId: string;
}
