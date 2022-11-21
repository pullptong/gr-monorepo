import { Button, Form, Header, Icon, Label, Modal } from 'semantic-ui-react';
import Datepicker from 'react-semantic-ui-datepickers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Finding, Result } from '../interfaces/result.interface';
import { Status } from '../interfaces/result.interface';
import { createResult } from '../services/result.service';

const FormPage: React.FC = () => {
  const [status, setStatus] = useState<Status>();
  const [repositoryName, setRepositoryName] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [file, setFile] = useState<File>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');
      fileReader.onload = (e) => {
        if (e.target) {
          const findings = JSON.parse(e.target.result as string).findings;
          if (findings) {
            setFindings(JSON.parse(e.target.result as string).findings);
          } else {
            setOpen(true);
          }
        }
      };
    }
  }, [file]);

  const handleSubmit = useCallback(() => {
    if (status && repositoryName && date && findings.length > 0) {
      const result: Result = {
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
      createResult(result);
    }
  }, [status, repositoryName, date, findings]);

  return (
    <div>
      <Modal basic onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} size="small">
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
          <Button basic color="red" inverted onClick={() => setOpen(false)}>
            <Icon name="remove" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
      <Form inverted onSubmit={() => handleSubmit()}>
        <h1>Result Form</h1>
        <Form.Field>
          <label>Status</label>
          <Button.Group>
            <Button color={status === Status.Queued ? 'grey' : undefined} onClick={() => setStatus(Status.Queued)}>
              Queued
            </Button>
            <Button
              color={status === Status.InProgress ? 'blue' : undefined}
              onClick={() => setStatus(Status.InProgress)}
            >
              In Progress
            </Button>
            <Button color={status === Status.Success ? 'green' : undefined} onClick={() => setStatus(Status.Success)}>
              Success
            </Button>
            <Button color={status === Status.Failure ? 'red' : undefined} onClick={() => setStatus(Status.Failure)}>
              Failure
            </Button>
          </Button.Group>
        </Form.Field>
        {status !== undefined && (
          <>
            <Form.Field>
              <label>Repository Name</label>
              <input placeholder="Repository Name" onChange={(e) => setRepositoryName(e.target.value)} />
            </Form.Field>
            <Form.Field>
              {status === Status.Queued && <label>Queued At</label>}
              {status === Status.InProgress && <label>Scanning At</label>}
              {[Status.Success, Status.Failure].includes(status) && <label>Finished At</label>}
              <Datepicker inverted onChange={(_, data) => setDate(data.value as Date)} />
            </Form.Field>
            <Form.Field>
              <label>Findings</label>
              <Button as="div" labelPosition="right" onClick={() => fileRef.current?.click()}>
                <Button icon>
                  <Icon name="file" />
                </Button>
                <Label as="a" basic pointing="left">
                  {file?.name || 'Select file'}
                </Label>
              </Button>
              <input
                style={{ display: 'none' }}
                ref={fileRef}
                type="file"
                accept="application/json"
                multiple={false}
                onChange={(e) => setFile(e.target.files?.[0])}
              />
            </Form.Field>
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default FormPage;
