import React, { useState } from 'react';
import InputForm from './components/inputForm';
import ScheduleTable from './components/scheduleTable';
import './App.css'

const App = () => {
  const [schedule, setSchedule] = useState([]);
  const [materialAName, setMaterialAName] = useState('');
  const [materialBName, setMaterialBName] = useState('');

  const handleScheduleGenerate = (newSchedule) => {
    setSchedule(newSchedule);
  };

  return (
    <div className="container">
      <h1>Delivery Scheduling Application</h1>
      <InputForm 
        onScheduleGenerate={handleScheduleGenerate} 
        setMaterialAName={setMaterialAName}
        setMaterialBName={setMaterialBName}
      />
      <ScheduleTable 
        schedule={schedule} 
        materialAName={materialAName} 
        materialBName={materialBName} 
      />
    </div>
  );
};

export default App;
