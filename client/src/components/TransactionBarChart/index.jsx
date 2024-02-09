import { useState, useEffect } from "react"
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis} from 'recharts'

import './index.css'

const TransactionBarChart = () => {
  const priceRanges = [
    "0 - 100", "101 - 200", "201 - 300", "301 - 400",
    "401 - 500", "501 - 600", "601 - 700", "701 - 800",
    "801 - 900", "900 - above"
  ];

  const [rawData, setData] = useState([]);
  const [processedData, setProcessedData] = useState({});
  const [month, setMonth] = useState("03");

  const fetchData = async () => {
    try {
      const response = await fetch(`https://vercel-testing-server-alpha.vercel.app/bar-chart/${month}`);
      const data = await response.json();

      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMonths = (e) => {
    const savedData = e.target.value;
    setMonth(savedData);
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  useEffect(() => {
    const newData = {}
    
    // Initialize the newData object with zeros
    priceRanges.forEach(range => {
      newData[range] = 0;
    });

    // Update the counts from the fetched data
    rawData.forEach(item => {
      const range = item.price_range;
      const count = item.item_count;

      // If the range is found, update the count
      if (range in newData) {
        newData[range] = count;
      }
    });

    setProcessedData(newData)
  }, [rawData]);

  console.log()

  return (
    <div className="bar-chart-container"> 
        <h1 className="bar-chart-head">Bar Chart - <select className='stat-select' onChange={handleMonths} value={month}>
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
        </h1>
      <div>
        <ResponsiveContainer width={1000} height={400}>
                <BarChart width={150} height={40} data={Object.entries(processedData).map(([name, uv]) => ({ name, uv }))}>
                    <Bar dataKey={'uv'} fill='#8884d8'/>
                    <XAxis dataKey={'name'}/>
                    <YAxis />
                </BarChart>
            </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionBarChart;
