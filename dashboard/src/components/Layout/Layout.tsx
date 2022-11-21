import { PropsWithChildren, useCallback, useState } from 'react';
import { Container, Menu, Segment, Visibility } from 'semantic-ui-react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const [fixed, setFixed] = useState(false);

  const showFixedMenu = useCallback(() => setFixed(true), []);
  const hideFixedMenu = useCallback(() => setFixed(false), []);

  return (
    <Visibility once={false} onBottomPassed={showFixedMenu} onBottomPassedReverse={hideFixedMenu}>
      <Segment inverted textAlign="center" style={{ padding: '1em 0em' }} vertical>
        <Menu fixed={fixed ? 'top' : undefined} inverted={!fixed} pointing={!fixed} secondary={!fixed} size="large">
          <Container>
            <Menu.Item active={location.pathname.startsWith('/form')}>
              <Link to="/form">Form</Link>
            </Menu.Item>
            <Menu.Item active={location.pathname.startsWith('/results')}>
              <Link to="/results">Results</Link>
            </Menu.Item>
          </Container>
        </Menu>
      </Segment>
      <Container inverted style={{ padding: '3em 0em' }}>
        <Outlet />
      </Container>
    </Visibility>
  );
};

export default Layout;
