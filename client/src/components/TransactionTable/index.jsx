import { useState, useEffect } from 'react'
import './index.css'

const TransactioTable = () => {

    const [transactions, setTransactions] = useState([])
    const [month, setMonth] = useState("03")

    const handleMonths = (e) => {
        const selectedValue = e.target.value
        setMonth(selectedValue)
    }
      
const fetchAndInsert = async () => {
    try {
        const response = await fetch(`https://vercel-testing-server-alpha.vercel.app/products/${month}`);
        const data = await response.json();
        
        setTransactions(data)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

useEffect(() => {
    fetchAndInsert(month)
}, [])

  return(
    <div className='table-container'>
        <h2 className='table-heading'>Transaction<br/>Dashboard</h2>
        <div className='dynamic-container'>
            <button className='table-search-button' type='button' onClick={() => fetchAndInsert(month)}>Search Transaction</button>
            <select className='table-select' onChange={handleMonths}>
                <option value="01">January</option>
                <option value="02">February</option>
                <option selected value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">Septmber</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Sold</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((eachItem, index) => (
                    <tr key={index}>
                        <td>{eachItem.id}</td>
                        <td>{eachItem.title}</td>
                        <td>{eachItem.description}</td>
                        <td>{eachItem.price}</td>
                        <td>{eachItem.category}</td>
                        <td>{eachItem.sold}</td>
                        <td>{eachItem.image}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default TransactioTable