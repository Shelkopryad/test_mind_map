import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import GraphPage from './pages/GraphPage.jsx';
import DocumentationPage from './pages/DocumentationPage.jsx';
import TestCasesPage from './pages/TestCasesPage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GraphProvider } from './context/GraphContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GraphProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GraphPage />} />
          <Route path="/docs/:nodeId" element={<DocumentationPage />} />
          <Route path="/edge/:edgeId/cases" element={<TestCasesPage />} />
        </Routes>
      </BrowserRouter>
    </GraphProvider>
  </StrictMode>,
)
