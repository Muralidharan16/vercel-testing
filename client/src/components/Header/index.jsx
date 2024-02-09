import {Link} from 'react-router-dom'

import './index.css'

function Header() {
  return (
    <nav className='nav-container'>
            <Link className='linked headers'>
              <img src='https://img.freepik.com/free-photo/light-bulb-with-colorful-graphic-inside_1232-186.jpg?w=740&t=st=1707381903~exp=1707382503~hmac=474fb17e972695880dd6729a3cdacf950482f8257a65b1966ced3f584ed4e305' alt='logo' className='logo' />
              <h1 className='head'>SalesTrace</h1>
            </Link>
        <ul className='ul-list'>
            <li><Link to='/' className='linked'>Home</Link></li>
            <li><Link className='linked'>About</Link></li>
            <li><Link className='linked'>Contact</Link></li>
        </ul>
    </nav>
  )
}

export default Header
