import {Link} from 'react-router-dom'

import './index.css'

const Home= () => {
  return (
    <div className="home-container">
      <ul className='home-ul-list'>
        <li className='list-styling'><Link className='linked' to='/transaction/table'>Transaction Table</Link></li>
        <li className='list-styling'><Link className='linked' to='/transaction/statistic'>Transaction Statistics</Link></li>
        <li className='list-styling'><Link className='linked' to='/transaction/bar-chart'>Transaction Bar-Chart</Link></li>
      </ul>
      <img src='https://img.freepik.com/free-photo/hand-near-laptop-that-expels-graphics-arrows_1232-283.jpg?w=996&t=st=1707389885~exp=1707390485~hmac=10e84de0df66b0775aafe5330ac843c7868050cf72089eacef1194a84c07b90d' alt='home' className='home-image' />
    </div>
  )
}

export default Home