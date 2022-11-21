import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './utils/axios';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import FormPage from './routes/Form';
import Results from './routes/Results';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/form',
        element: <FormPage />,
      },
      {
        path: '/results',
        element: <Results />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
