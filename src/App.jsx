import { Route, Routes } from 'react-router-dom';

import ErrorPage from './error-page.jsx';
import Guide from './guide.jsx';
import Home from './home.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="guide" element={<Guide />} />

      {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default App;
