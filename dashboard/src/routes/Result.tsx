import { deleteResult, getResult } from '../services/result.service';
import { useLoaderData, LoaderFunctionArgs, useNavigate } from 'react-router-dom';
import { Result, Severity, Status } from '../interfaces/result.interface';
import { Button, Card, Header, Icon, Label, Modal } from 'semantic-ui-react';
import { useMemo, useState } from 'react';
import { getCardStatusColor, getTextSeverityColor, getTextStatusColor } from '../utils/colors';

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const res = await getResult(parseInt(params.id as string));
    return { result: res.data };
  } catch (e) {
    console.error(e);
  }
}

const Results: React.FC = () => {
  const { result } = useLoaderData() as { result: Result };
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const date = useMemo(() => {
    if (result.status === Status.Queued && result.queuedAt) {
      return result.queuedAt;
    } else if (result.status === Status.InProgress && result.scanningAt) {
      return result.scanningAt;
    } else if (result.finishedAt) {
      return result.finishedAt;
    } else {
      return '';
    }
  }, [result.status, result.queuedAt, result.scanningAt, result.finishedAt]);

  const getIcon = (severity: Severity) => {
    switch (severity) {
      case Severity.Critical:
        return <Icon name="exclamation circle" />;
      case Severity.High:
        return <Icon name="angle up" />;
      case Severity.Medium:
        return <Icon name="minus" />;
      case Severity.Low:
      default:
        return <Icon name="angle down" />;
    }
  };

  const confirmDelete = async () => {
    setOpen(false);
    try {
      await deleteResult(result.id);
      navigate('/results');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Modal basic onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} size="small">
        <Header icon>
          <Icon name="archive" />
        </Header>
        <Modal.Content style={{ textAlign: 'center' }}>Confirm to remove {result.repositoryName}</Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => setOpen(false)}>
            <Icon name="remove" /> Close
          </Button>
          <Button basic color="green" inverted onClick={() => confirmDelete()}>
            <Icon name="check" /> Confirm
          </Button>
        </Modal.Actions>
      </Modal>
      <Card fluid color={getCardStatusColor(result.status)}>
        <Card.Content>
          <div className="grid grid-cols-5 gap-3 items-center text-black font-bold">
            <span className="text-ellipsis overflow-hidden whitespace-nowrap">{result.repositoryName}</span>
            <span className={getTextStatusColor(result.status)}>{result.status}</span>
            <div>
              <Label>
                <Icon name="bug" />
                {result.findings.length}
              </Label>
            </div>
            <span>{new Date(date).toLocaleString()}</span>
            <div className="text-right">
              <Icon name="trash" className="cursor-pointer" onClick={() => setOpen(true)} />
            </div>
          </div>
        </Card.Content>
      </Card>
      <div className="p-3">
        <Card.Group>
          {result.findings.map((finding, index) => {
            return (
              <Card key={index} fluid>
                <Card.Content>
                  <Card.Header>{finding.type}</Card.Header>
                  <Card.Meta>{finding.ruleId}</Card.Meta>
                  <Card.Description>{finding.metadata.description}</Card.Description>
                  <Card.Content>
                    <div className="grid grid-cols-6 items-center pt-3 gap-3 text-orange">
                      <div>
                        <Label>
                          <span className={getTextSeverityColor(finding.metadata.severity)}>
                            {getIcon(finding.metadata.severity)}
                            {finding.metadata.severity}
                          </span>
                        </Label>
                      </div>
                      <span className="text-black col-span-5">
                        Line {finding.location.positions.begin.line}: {finding.location.path}
                      </span>
                    </div>
                  </Card.Content>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </div>
    </div>
  );
};

export default Results;
