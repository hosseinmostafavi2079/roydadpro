import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <Router>
      <div dir="rtl" className="font-sans bg-slate-50 min-h-screen text-slate-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* بعدا روت‌های ادمین و جزئیات را اضافه میکنیم */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;