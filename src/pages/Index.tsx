
import { useOrbitOS, OrbitOSProvider } from '../context/OrbitOSContext';
import Login from './Login';
import Desktop from './Desktop';

const OrbitOS = () => {
  const { isAuthenticated } = useOrbitOS();
  
  return isAuthenticated ? <Desktop /> : <Login />;
};

const Index = () => {
  return (
    <OrbitOSProvider>
      <OrbitOS />
    </OrbitOSProvider>
  );
};

export default Index;
