import { getResults } from '../services/result.service';
import { useLoaderData } from 'react-router-dom';
import { Result } from '../interfaces/result.interface';

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
      {results.map((result) => (
        <div key={result.id}>{result.repositoryName}</div>
      ))}
    </div>
  );
};

export default Results;
