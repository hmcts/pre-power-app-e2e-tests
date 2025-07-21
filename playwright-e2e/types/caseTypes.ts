// Case details for creating or populating a case
export interface BaseCaseDetails {
  caseReference: string;
  defendantNames: string[];
  witnessNames: string[];
}

// Booking details returned from API
export interface BookingDetails extends BaseCaseDetails {
  bookingId: string;
  defendantSelectedForCase: string;
}

// Recording details from API requests
export interface RecordingDetails {
  recordingId: string;
  recordingDate: string;
  recordingTime: string;
  recordingDuration: string;
}

// Participant type for API requests
export interface Participant {
  first_name: string;
  last_name: string;
  id: string;
  participant_type: string;
}

// Created case summary returned from API
export interface CreatedCaseSummary extends BaseCaseDetails {
  caseId: string;
  participants: {
    defendants: Participant[];
    witnesses: Participant[];
  };
}
