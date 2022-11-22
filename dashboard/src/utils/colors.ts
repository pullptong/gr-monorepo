import { Severity, Status } from '../interfaces/result.interface';

export const getCardStatusColor = (status: Status) => {
  switch (status) {
    case Status.Queued:
      return 'grey';
    case Status.InProgress:
      return 'blue';
    case Status.Success:
      return 'green';
    case Status.Failure:
      return 'red';
    default:
      return undefined;
  }
};

export const getTextStatusColor = (status: Status) => {
  switch (status) {
    case Status.Queued:
      return 'text-grey-400';
    case Status.InProgress:
      return 'text-blue-600';
    case Status.Success:
      return 'text-green-600';
    case Status.Failure:
      return 'text-red-600';
    default:
      return undefined;
  }
};

export const getTextSeverityColor = (severity: Severity) => {
  switch (severity) {
    case Severity.Critical:
      return 'text-red-600';
    case Severity.High:
      return 'text-orange-600';
    case Severity.Medium:
      return 'text-yellow-500';
    case Severity.Low:
    default:
      return 'text-blue-600';
  }
};
