import './App.css';
import PurchaseRequisitions from './components/PurchaseRequisitions';
import PurchaseRequisitionDetails from './components/PurchaseRequisitionDetails';
import NewPurchaseRequisition from './components/NewPurchaseRequisition';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PurchaseRequisitions />} />
        <Route path="/pr/:id" element={<PurchaseRequisitionDetails />} />
        <Route path="/pr/new" element={<NewPurchaseRequisition />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
