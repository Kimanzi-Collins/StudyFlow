import { useStore } from './store/useStore';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';

export function App() {
  const { isAuthenticated } = useStore();

  return isAuthenticated ? <Dashboard /> : <Auth />;
}
