import { useState, useEffect } from 'react';
import './index.css';

const TransactionStatistc = () => {
  const [month, setMonth] = useState("03");
  const [statData, setStatData] = useState([]);

  const fetchApi = async () => {
    try {
      const response = await fetch(`https://vercel-testing-server-alpha.vercel.app/statistics/${month}`);
      const data = await response.json();

      setStatData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMonths = (e) => {
    const savedData = e.target.value;
    setMonth(savedData);
  };

  useEffect(() => {
    fetchApi();
  }, [month]);

  return (
    <div className="stat-container">
      <div className='stat-choosing'>
        <h1>Statistic -</h1>
        <select className='stat-select' onChange={handleMonths} value={month}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div className='stat-total-container'>
        <div className='stat-total-show'>
          <h3>Total Sale</h3>
          <p>- {statData[0]?.totalSaleAmount}</p> {/* Use optional chaining here */}
        </div>
        <div className='stat-total-show'>
          <h3>Total Sold</h3>
          <p>- {statData[0]?.totalSoldItems}</p> {/* Use optional chaining here */}
        </div>
        <div className='stat-total-show'>
          <h3>Total Unsold</h3>
          <p>- {statData[0]?.totalUnsoldItems}</p> {/* Use optional chaining here */}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistc;
