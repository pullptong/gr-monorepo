import { getResults } from '../services/result.service';
import { useLoaderData, Link } from 'react-router-dom';
import { Result, Status } from '../interfaces/result.interface';
import { Card, Icon, Label } from 'semantic-ui-react';
import { getCardStatusColor, getTextStatusColor } from '../utils/colors';

export async function loader() {
  try {
    const res = await getResults();
    return { results: res.data };
  } catch (e) {
    console.error(e);
  }
}

const Results: React.FC = () => {
  const { results } = useLoaderData() as { results: Result[] };

  return (
    <div>
      <Card.Group>
        {results.map((result) => {
          let date = '';
          if (result.status === Status.Queued && result.queuedAt) {
            date = result.queuedAt;
          } else if (result.status === Status.InProgress && result.scanningAt) {
            date = result.scanningAt;
          } else if (result.finishedAt) {
            date = result.finishedAt;
          }
          return (
            <Card key={result.id} fluid color={getCardStatusColor(result.status)}>
              <Card.Content>
                <div className="grid grid-cols-9 gap-3 items-center text-black font-bold">
                  <span className="col-span-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {result.repositoryName}
                  </span>
                  <span className={'col-span-2 ' + getTextStatusColor(result.status)}>{result.status}</span>
                  <div>
                    <Label>
                      <Icon name="bug" />
                      {result.findings.length}
                    </Label>
                  </div>
                  <span className="col-span-3">{new Date(date).toLocaleString()}</span>
                  <Link to={'/results/' + result.id} className="text-right cursor-pointer">
                    <Icon name="arrow right" />
                  </Link>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </Card.Group>
    </div>
  );
};

export default Results;
