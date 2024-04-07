import React, { useState } from 'react';
import '../style/inputForm.css';

const InputForm = ({ onScheduleGenerate, setMaterialAName, setMaterialBName }) => {
  const [formData, setFormData] = useState({
    materialAName: '',
    materialBName: '',
    materialA_PDC: '',
    materialB_PDC: '',
    materialA_DOI: '',
    materialB_DOI: '',
    safetyStock: '',
    minTruckLoad: '',
    stockToBeMaintained: '',
    daysToSchedule: '',
    dateOfPlan: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Set material names
    if (formData.materialAName !== '') {
      setMaterialAName(formData.materialAName);
    }
    if (formData.materialBName !== '') {
      setMaterialBName(formData.materialBName);
    }
    // Perform calculations and generate schedule
    const schedule = calculateSchedule(formData);
    // Pass the schedule to the parent component
    onScheduleGenerate(schedule);
  };

  const calculateSchedule = (formData) => {
    const {
      materialA_PDC,
      materialB_PDC,
      materialA_DOI,
      materialB_DOI,
      safetyStock,
      minTruckLoad,
      stockToBeMaintained,
      daysToSchedule,
      dateOfPlan
    } = formData;
  
    const schedule = [];
    let materialA_DOI_val = parseInt(materialA_DOI);
    let materialB_DOI_val = parseInt(materialB_DOI);
    let currentDate = dateOfPlan ? new Date(dateOfPlan) : new Date(); // Use provided date or today's date
  
    for (let day = 0; day < parseInt(daysToSchedule); ) {
      const demandPlan = calculateDemandPlan(materialA_PDC, materialB_PDC, materialA_DOI_val, materialB_DOI_val, parseInt(minTruckLoad), parseInt(safetyStock), parseInt(stockToBeMaintained));
      let newPlanDay, matAplannedStock, matBplannedStock;
  
      for (const [deliveryDay, [matAToBeDelivered, matBToBeDelivered]] of demandPlan) {
        newPlanDay = deliveryDay;
        matAplannedStock = matAToBeDelivered;
        matBplannedStock = matBToBeDelivered;
      }
  
      const newMaterialADOI = materialA_DOI_val + (matAplannedStock / parseInt(materialA_PDC)) - newPlanDay;
      const newMaterialBDOI = materialB_DOI_val + (matBplannedStock / parseInt(materialB_PDC)) - newPlanDay;
  
      // Calculate the date for the current day of the schedule
      const scheduleDate = new Date(currentDate);
      scheduleDate.setDate(scheduleDate.getDate() + newPlanDay);
  
      schedule.push({
        date: scheduleDate.toLocaleDateString(), // Convert currentDate to a string representation of the date
        materialA: matAplannedStock,
        materialB: matBplannedStock
      });
  
      materialA_DOI_val = newMaterialADOI;
      materialB_DOI_val = newMaterialBDOI;
      day += newPlanDay;
  
      // Update currentDate to the new schedule date for the next iteration
      currentDate.setDate(currentDate.getDate() + newPlanDay);
    }
  
    return schedule;
  };
  

  const calculateDemandPlan = (materialA_PDC, materialB_PDC, materialA_DOI, materialB_DOI, minTruckLoad, safetyStock, stockToBeMaintained) => {
    const demandPlan = [];
    const deliveryDay = Math.min(materialA_DOI, materialB_DOI) - safetyStock;
    let matAToBeDelivered, matBToBeDelivered;

    const matAStockDaysNeeded = stockToBeMaintained - materialA_DOI + deliveryDay;
    matAToBeDelivered = matAStockDaysNeeded * materialA_PDC;

    const matBStockDaysNeeded = stockToBeMaintained - materialB_DOI + deliveryDay;
    matBToBeDelivered = matBStockDaysNeeded * materialB_PDC;

    if (matAToBeDelivered + matBToBeDelivered < minTruckLoad) {
      const truckLoadBalance = minTruckLoad - (matAToBeDelivered + matBToBeDelivered);
      if (materialA_DOI <= materialB_DOI) {
        matAToBeDelivered += truckLoadBalance;
      } else {
        matBToBeDelivered += truckLoadBalance;
      }
    }

    demandPlan.push([deliveryDay, [matAToBeDelivered, matBToBeDelivered]]);
    return demandPlan;
  };

  return (
    <div className="input-form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Name of Material A:
          <input type="text" name="materialAName" value={formData.materialAName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Name of Material B:
          <input type="text" name="materialBName" value={formData.materialBName} onChange={handleChange} />
        </label>
        <br />
        <label>
          Per Day Consumption for {formData.materialAName || 'Material A'}:
          <input type="number" name="materialA_PDC" value={formData.materialA_PDC} onChange={handleChange} />
        </label>
        <br />
        <label>
          Per Day Consumption for {formData.materialBName || 'Material B'}:
          <input type="number" name="materialB_PDC" value={formData.materialB_PDC} onChange={handleChange} />
        </label>
        <br />
        <label>
          Current Days of Inventory for {formData.materialAName || 'Material A'}:
          <input type="number" name="materialA_DOI" value={formData.materialA_DOI} onChange={handleChange} />
        </label>
        <br />
        <label>
          Current Days of Inventory for {formData.materialBName || 'Material B'}:
          <input type="number" name="materialB_DOI" value={formData.materialB_DOI} onChange={handleChange} />
        </label>
        <br />
        <label>
          Safety Stock for Material:
          <input type="number" name="safetyStock" value={formData.safetyStock} onChange={handleChange} />
        </label>
        <br />
        <label>
          Minimum Truck Load:
          <input type="number" name="minTruckLoad" value={formData.minTruckLoad} onChange={handleChange} />
        </label>
        <br />
        <label>
          Stock to be Maintained:
          <input type="number" name="stockToBeMaintained" value={formData.stockToBeMaintained} onChange={handleChange} />
        </label>
        <br />
        <label>
          Number of Days to Schedule:
          <input type="number" name="daysToSchedule" value={formData.daysToSchedule} onChange={handleChange} />
        </label>
        <br />
        <label>
          Date of Plan:
          <input type="date" name="dateOfPlan" value={formData.dateOfPlan} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Generate Schedule</button>
      </form>
    </div>
  );
};

export default InputForm;
