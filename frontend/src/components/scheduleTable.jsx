import React from 'react';
import '../style/scheduleTable.css';

const ScheduleTable = ({ schedule, materialAName, materialBName }) => {
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
    </div>
  );
};

export default ScheduleTable;
