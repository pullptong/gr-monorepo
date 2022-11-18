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
