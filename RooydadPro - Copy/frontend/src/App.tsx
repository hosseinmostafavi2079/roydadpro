import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { MyTicketsPage } from './pages/MyTicketsPage'; // اضافه شده
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div dir="rtl" className="font-sans bg-slate-50 min-h-screen text-slate-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} /> {/* اضافه شده */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;