export enum Status {
  Queued = 'Queued',
  InProgress = 'In Progress',
  Success = 'Success',
  Failure = 'Failure',
}

export interface Finding {
  type: string;
  ruleId: string;
  location: Location;
  metadata: Metadata;
}

interface Location {
  path: string;
  positions: {
    begin: {
      line: number;
    };
  };
}

interface Metadata {
  description: string;
  severity: string;
}

export enum Severity {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Critical = 'CRITICAL',
}

export interface Result {
  status: Status;
  repository_name: string;
  findings: Finding[];
  queued_at?: string;
  scanning_at?: string;
  finished_at?: string;
}
