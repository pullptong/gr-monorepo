import { Button, Form, Header, Icon, Label, Modal } from 'semantic-ui-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateResultPayLoad, Finding } from '../interfaces/result.interface';
import { Status } from '../interfaces/result.interface';
import { createResult } from '../services/result.service';
import DatePicker from 'react-datepicker';

const FormPage: React.FC = () => {
  const [status, setStatus] = useState<Status>();
  const [repositoryName, setRepositoryName] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [file, setFile] = useState<File>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const readJson = useCallback(() => {
    return new Promise<Finding[] | undefined>((resolve) => {
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, 'UTF-8');
        fileReader.onload = (e) => {
          if (e.target) {
            try {
              const findings = JSON.parse(e.target.result as string).findings;
              if (findings) {
                resolve(findings);
              } else {
                resolve(undefined);
              }
            } catch (e) {
              resolve(undefined);
            }
          }
        };
      }
    });
  }, [file]);

  useEffect(() => {
    readJson().then((findings) => {
      if (findings) {
        setFindings(findings);
      } else {
        setFile(undefined);
        setOpenError(true);
      }
    });
  }, [readJson]);

  const handleSubmit = useCallback(async () => {
    if (status && repositoryName && date && findings && findings.length > 0) {
      const result: CreateResultPayLoad = {
        status,
        repository_name: repositoryName,
        findings,
      };
      const isoDate = date.toISOString();
      if (status === Status.Queued) {
        result.queued_at = isoDate;
      } else if (status === Status.InProgress) {
        result.scanning_at = isoDate;
      } else {
        result.finished_at = isoDate;
      }
      try {
        await createResult(result);
        setOpenSuccess(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, [status, repositoryName, date, findings]);

  return (
    <div>
      <Modal
        data-testid="error-modal"
        basic
        onClose={() => setOpenError(false)}
        onOpen={() => setOpenError(true)}
        open={openError}
        size="small"
      >
        <Header icon>
          <Icon name="archive" />
          Invalid JSON file format
        </Header>
        <Modal.Content style={{ textAlign: 'center' }}>
          <p>
            Please select new JSON file, or you can use{' '}
            <a
              href="https://github.com/guardrailsio/full-stack-engineer-challenge/blob/master/example-findings.json"
              target="_blank"
              rel="noreferrer"
            >
              this
            </a>{' '}
            example file
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpenError(false)}>
            <Icon name="remove" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal
        basic
        onClose={() => setOpenSuccess(false)}
        onOpen={() => setOpenSuccess(true)}
        open={openSuccess}
        size="small"
        data-testid="success-modal"
      >
        <Header icon>
          <Icon name="check" />
          Success
        </Header>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpenSuccess(false)}>
            <Icon name="remove" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
      <Form inverted onSubmit={() => handleSubmit()} className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">Result Form</h1>
        <Form.Field>
          <label htmlFor="status-btn-group">Status</label>
          <Button.Group id="status-btn-group" className="w-full">
            <Button
              data-testid="queued-btn"
              color={status === Status.Queued ? 'grey' : undefined}
              onClick={() => setStatus(Status.Queued)}
            >
              Queued
            </Button>
            <Button
              data-testid="in-progress-btn"
              color={status === Status.InProgress ? 'blue' : undefined}
              onClick={() => setStatus(Status.InProgress)}
            >
              In Progress
            </Button>
            <Button
              data-testid="success-btn"
              color={status === Status.Success ? 'green' : undefined}
              onClick={() => setStatus(Status.Success)}
            >
              Success
            </Button>
            <Button
              data-testid="failure-btn"
              color={status === Status.Failure ? 'red' : undefined}
              onClick={() => setStatus(Status.Failure)}
            >
              Failure
            </Button>
          </Button.Group>
        </Form.Field>
        {status !== undefined && (
          <div className="grid grid-cols-3 gap-3">
            <Form.Field>
              <label htmlFor="repository-name-input">Repository Name</label>
              <input
                id="repository-name-input"
                data-testid="repository-name-input"
                placeholder="Repository Name"
                onChange={(e) => setRepositoryName(e.target.value)}
              />
            </Form.Field>
            <Form.Field className="flex flex-col">
              {status === Status.Queued && <label htmlFor="datepicker">Queued At</label>}
              {status === Status.InProgress && <label htmlFor="datepicker">Scanning At</label>}
              {[Status.Success, Status.Failure].includes(status) && <label htmlFor="datepicker">Finished At</label>}
              <DatePicker
                placeholderText="Select date and time"
                id="datepicker"
                data-testid="datepicker"
                selected={date}
                onChange={(date) => date && setDate(date)}
                showTimeSelect
                dateFormat="pP"
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="select-file-btn">Findings</label>
              <Button
                id="select-file-btn"
                data-testid="select-file-btn"
                className="w-full"
                as="div"
                labelPosition="right"
                onClick={() => fileRef.current?.click()}
              >
                <Button icon>
                  <Icon name="file" />
                </Button>
                <Label className="w-full" as="a" basic pointing="left">
                  {file?.name || 'Select file'}
                </Label>
              </Button>
              <input
                data-testid="file-input"
                style={{ display: 'none' }}
                ref={fileRef}
                type="file"
                accept="application/json"
                multiple={false}
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </Form.Field>
            <div className="col-span-2">
              {findings && findings.length > 0 && (
                <pre data-testid="json-preview">{JSON.stringify(findings, null, 2)}</pre>
              )}
            </div>
            <div className="flex justify-end items-start">
              <Button
                data-testid="submit-btn"
                type="submit"
                color="green"
                disabled={!status || !repositoryName || !date || !findings || findings.length === 0}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default FormPage;
