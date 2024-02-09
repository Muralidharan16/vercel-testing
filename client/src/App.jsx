import {Routes, Route} from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'
import TransactionTable from './components/TransactionTable'
import TransactionStatistc from './components/TransactionStatistic'
import TransactionBarChart from './components/TransactionBarChart'

import './App.css'

const App = () => {
  return (
    <div className='app-container'>
      <div className='content-container'>
        <Header />
        <div className='app-body'>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/transaction/table' element={<TransactionTable />} />
            <Route exact path='/transaction/statistic' element={<TransactionStatistc />} />
            <Route exact path='/transaction/bar-chart' element={<TransactionBarChart />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App