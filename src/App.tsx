import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateInspection from './pages/CreateInspection';
import Result from './pages/Result';
import EditResult from './pages/EditResult';
import History from './pages/History';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CreateInspection />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/edit/:id" element={<EditResult />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
