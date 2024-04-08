import React, { useRef } from 'react';
import '../style/scheduleTable.css';

const ScheduleTable = ({ schedule, materialAName, materialBName }) => {
  const csvRef = useRef(null);

  const exportToCSV = () => {
    const csvData = [];
    csvData.push(['Date', materialAName || 'Material A', materialBName || 'Material B']);

    schedule.forEach(entry => {
      csvData.push([entry.date, entry.materialA, entry.materialB]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'schedule.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="schedule-table">
      <h2>Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>{materialAName || 'Material A'}</th>
            <th>{materialBName || 'Material B'}</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.materialA}</td>
              <td>{entry.materialB}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {schedule.length > 0 && <button className='export-btn' onClick={exportToCSV}>Export to excel</button>}
      <a ref={csvRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ScheduleTable;
