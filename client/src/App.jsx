import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router';

import routes from './routes.jsx';

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>{routes}</BrowserRouter>
    </>
  );
}

export default App;
