export type Session = {
  id: string;
  nationalId: string;
  phoneNumber: string;
  currentStep: number;
  createdAt: string;
  birthDate?: string;
};

export type Account = {
  username: string;
  password: string;
  nationalId: string;
  phoneNumber: string;
};

export type AuthSession = {
  username: string;
  loggedInAt: string;
};

export type PendingRegistration = {
  nationalId: string;
  phoneNumber: string;
};

export type TrackingEvent = {
  name: string;
  timestamp: string;
  sessionId?: string;
  metadata?: Record<string, string>;
};
