import { Routes, Route, Navigate } from 'react-router-dom';
import { JourneyListPage } from './components/journey-list/journey-list-page';
import { JourneyCanvasPage } from './components/canvas/journey-canvas-page';

export default function App() {
  return (
    <Routes>
      <Route path="/journeys"              element={<JourneyListPage />} />
      <Route path="/journeys/:id/builder"  element={<JourneyCanvasPage />} />
      <Route path="*"                      element={<Navigate to="/journeys" replace />} />
    </Routes>
  );
}
