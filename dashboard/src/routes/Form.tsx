import { Button, Form, Header, Icon, Label, Modal } from 'semantic-ui-react';
import Datepicker from 'react-semantic-ui-datepickers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateResultPayLoad, Finding, Result } from '../interfaces/result.interface';
import { Status } from '../interfaces/result.interface';
import { createResult } from '../services/result.service';

const FormPage: React.FC = () => {
  const [status, setStatus] = useState<Status>();
  const [repositoryName, setRepositoryName] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [file, setFile] = useState<File>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');
      fileReader.onload = (e) => {
        if (e.target) {
          try {
            const findings = JSON.parse(e.target.result as string).findings;
            if (findings) {
              setFindings(JSON.parse(e.target.result as string).findings);
            } else {
              setFile(undefined);
              setOpenError(true);
            }
          } catch (e) {
            setFile(undefined);
            setOpenError(true);
          }
        }
      };
    }
  }, [file]);

  const handleSubmit = useCallback(async () => {
    if (status && repositoryName && date && findings.length > 0) {
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
      <Modal basic onClose={() => setOpenError(false)} onOpen={() => setOpenError(true)} open={openError} size="small">
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
          <label>Status</label>
          <Button.Group className="w-full">
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
          <div className="grid grid-cols-3 gap-3">
            <Form.Field>
              <label>Repository Name</label>
              <input placeholder="Repository Name" onChange={(e) => setRepositoryName(e.target.value)} />
            </Form.Field>
            <Form.Field className="flex flex-col">
              {status === Status.Queued && <label>Queued At</label>}
              {status === Status.InProgress && <label>Scanning At</label>}
              {[Status.Success, Status.Failure].includes(status) && <label>Finished At</label>}
              <Datepicker inverted onChange={(_, data) => setDate(data.value as Date)} />
            </Form.Field>
            <Form.Field>
              <label>Findings</label>
              <Button className="w-full" as="div" labelPosition="right" onClick={() => fileRef.current?.click()}>
                <Button icon>
                  <Icon name="file" />
                </Button>
                <Label className="w-full" as="a" basic pointing="left">
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
            <div className="col-start-3 flex justify-end">
              <Button
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
