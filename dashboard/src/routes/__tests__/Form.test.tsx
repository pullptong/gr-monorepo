import { cleanup, fireEvent, render, screen, act, waitFor } from '@testing-library/react';
import Form from '../Form';
import * as ResultService from '../../services/result.service';
import { Status } from '../../interfaces/result.interface';

describe('Form', () => {
  afterEach(cleanup);

  it('should not render submit button', () => {
    render(<Form />);
    expect(screen.queryByTestId('submit-btn')).toBeFalsy();
  });

  it('should render correct datepicker label when click status button', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('queued-btn'));
    expect(screen.getByLabelText(/Queued At/i)).toBeTruthy();
    fireEvent.click(screen.getByTestId('in-progress-btn'));
    expect(screen.getByLabelText(/Scanning At/i)).toBeTruthy();
    fireEvent.click(screen.getByTestId('success-btn'));
    expect(screen.getByLabelText(/Finished At/i)).toBeTruthy();
    fireEvent.click(screen.getByTestId('failure-btn'));
    expect(screen.getByLabelText(/Finished At/i)).toBeTruthy();
  });

  it('should render submit button when all fields are filled', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('queued-btn'));
    fireEvent.change(screen.getByTestId('repository-name-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Select date and time'), { target: { value: '2020-10-10 10:10' } });
    const findings = [
      {
        type: 'sast',
        ruleId: 'G402',
        location: {
          path: 'connectors/apigateway.go',
          positions: {
            begin: {
              line: 60,
            },
          },
        },
        metadata: {
          description: 'TLS InsecureSkipVerify set true.',
          severity: 'HIGH',
        },
      },
    ];
    fireEvent.change(screen.getByTestId('file-input'), {
      target: {
        files: [
          new File(
            [
              JSON.stringify({
                findings,
              }),
            ],
            'example-findings.json',
            { type: 'application/json' },
          ),
        ],
      },
    });
    await waitFor(() => expect(screen.getByTestId('submit-btn')).not.toBeDisabled(), {
      timeout: 5000,
    });
    // @ts-ignore
    jest.spyOn(ResultService, 'createResult').mockImplementation(() => Promise.resolve());
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(ResultService.createResult).toBeCalledTimes(1);
    expect(ResultService.createResult).toBeCalledWith({
      status: Status.Queued,
      repository_name: 'test',
      findings,
      queued_at: '2020-10-10T10:10:00.000Z',
    });
    await waitFor(
      () => {
        expect(screen.getByTestId('success-modal')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('should have scanning_at when status is In Progress', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('in-progress-btn'));
    fireEvent.change(screen.getByTestId('repository-name-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Select date and time'), { target: { value: '2020-10-10 10:10' } });
    const findings = [
      {
        type: 'sast',
        ruleId: 'G402',
        location: {
          path: 'connectors/apigateway.go',
          positions: {
            begin: {
              line: 60,
            },
          },
        },
        metadata: {
          description: 'TLS InsecureSkipVerify set true.',
          severity: 'HIGH',
        },
      },
    ];
    fireEvent.change(screen.getByTestId('file-input'), {
      target: {
        files: [
          new File(
            [
              JSON.stringify({
                findings,
              }),
            ],
            'example-findings.json',
            { type: 'application/json' },
          ),
        ],
      },
    });
    await waitFor(() => expect(screen.getByTestId('submit-btn')).not.toBeDisabled(), {
      timeout: 5000,
    });
    // @ts-ignore
    jest.spyOn(ResultService, 'createResult').mockImplementation(() => Promise.resolve());
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(ResultService.createResult).toBeCalledTimes(1);
    expect(ResultService.createResult).toBeCalledWith({
      status: Status.InProgress,
      repository_name: 'test',
      findings,
      scanning_at: '2020-10-10T10:10:00.000Z',
    });
    await waitFor(
      () => {
        expect(screen.getByTestId('success-modal')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('should have finished_at when status is Success', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('success-btn'));
    fireEvent.change(screen.getByTestId('repository-name-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Select date and time'), { target: { value: '2020-10-10 10:10' } });
    const findings = [
      {
        type: 'sast',
        ruleId: 'G402',
        location: {
          path: 'connectors/apigateway.go',
          positions: {
            begin: {
              line: 60,
            },
          },
        },
        metadata: {
          description: 'TLS InsecureSkipVerify set true.',
          severity: 'HIGH',
        },
      },
    ];
    fireEvent.change(screen.getByTestId('file-input'), {
      target: {
        files: [
          new File(
            [
              JSON.stringify({
                findings,
              }),
            ],
            'example-findings.json',
            { type: 'application/json' },
          ),
        ],
      },
    });
    await waitFor(() => expect(screen.getByTestId('submit-btn')).not.toBeDisabled(), {
      timeout: 5000,
    });
    // @ts-ignore
    jest.spyOn(ResultService, 'createResult').mockImplementation(() => Promise.resolve());
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(ResultService.createResult).toBeCalledTimes(1);
    expect(ResultService.createResult).toBeCalledWith({
      status: Status.Success,
      repository_name: 'test',
      findings,
      finished_at: '2020-10-10T10:10:00.000Z',
    });
    await waitFor(
      () => {
        expect(screen.getByTestId('success-modal')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('should have finished_at when status is Failure', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('failure-btn'));
    fireEvent.change(screen.getByTestId('repository-name-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Select date and time'), { target: { value: '2020-10-10 10:10' } });
    const findings = [
      {
        type: 'sast',
        ruleId: 'G402',
        location: {
          path: 'connectors/apigateway.go',
          positions: {
            begin: {
              line: 60,
            },
          },
        },
        metadata: {
          description: 'TLS InsecureSkipVerify set true.',
          severity: 'HIGH',
        },
      },
    ];
    fireEvent.change(screen.getByTestId('file-input'), {
      target: {
        files: [
          new File(
            [
              JSON.stringify({
                findings,
              }),
            ],
            'example-findings.json',
            { type: 'application/json' },
          ),
        ],
      },
    });
    await waitFor(() => expect(screen.getByTestId('submit-btn')).not.toBeDisabled(), {
      timeout: 5000,
    });
    // @ts-ignore
    jest.spyOn(ResultService, 'createResult').mockImplementation(() => Promise.resolve());
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(ResultService.createResult).toBeCalledTimes(1);
    expect(ResultService.createResult).toBeCalledWith({
      status: Status.Failure,
      repository_name: 'test',
      findings,
      finished_at: '2020-10-10T10:10:00.000Z',
    });
    await waitFor(
      () => {
        expect(screen.getByTestId('success-modal')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('should display error popup when json file is invalid', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('queued-btn'));
    fireEvent.change(screen.getByTestId('repository-name-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Select date and time'), { target: { value: '2020-10-10 10:10' } });
    fireEvent.change(screen.getByTestId('file-input'), {
      target: {
        files: [new File(['fail to parse json'], 'example-findings.json', { type: 'application/json' })],
      },
    });
    await waitFor(
      () => {
        expect(screen.getByTestId('error-modal')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('should display error popup when json file does not contain findings', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('queued-btn'));
    fireEvent.change(screen.getByTestId('repository-name-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Select date and time'), { target: { value: '2020-10-10 10:10' } });
    fireEvent.change(screen.getByTestId('file-input'), {
      target: {
        files: [new File([JSON.stringify({})], 'example-findings.json', { type: 'application/json' })],
      },
    });
    await waitFor(
      () => {
        expect(screen.getByTestId('error-modal')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('should not display success when createResult throw an error', async () => {
    render(<Form />);
    fireEvent.click(screen.getByTestId('queued-btn'));
    fireEvent.change(screen.getByTestId('repository-name-input'), { target: { value: 'test' } });
    fireEvent.change(screen.getByPlaceholderText('Select date and time'), { target: { value: '2020-10-10 10:10' } });
    const findings = [
      {
        type: 'sast',
        ruleId: 'G402',
        location: {
          path: 'connectors/apigateway.go',
          positions: {
            begin: {
              line: 60,
            },
          },
        },
        metadata: {
          description: 'TLS InsecureSkipVerify set true.',
          severity: 'HIGH',
        },
      },
    ];
    fireEvent.change(screen.getByTestId('file-input'), {
      target: {
        files: [
          new File(
            [
              JSON.stringify({
                findings,
              }),
            ],
            'example-findings.json',
            { type: 'application/json' },
          ),
        ],
      },
    });
    await waitFor(() => expect(screen.getByTestId('submit-btn')).not.toBeDisabled(), {
      timeout: 5000,
    });
    // @ts-ignore
    jest
      .spyOn(ResultService, 'createResult')
      .mockImplementation(() => Promise.reject('Error: Failed to create result'));
    fireEvent.click(screen.getByTestId('submit-btn'));
    await waitFor(
      () => {
        expect(screen.queryByTestId('success-modal')).toBeFalsy();
      },
      { timeout: 5000 },
    );
  });
});
