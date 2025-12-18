import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import styles from '../styles/components/Header.module.css';
import AuthModal from './modals/AuthModal';

const ROUTES = {
   HOME: '/',
   FAQ: '/faq',
} as const;

interface NavItem {
   to: string;
   label: string;
}

const NAV_ITEMS: NavItem[] = [{ to: ROUTES.FAQ, label: 'Поддержка' }];

const Header = () => {
   const [currency, setCurrency] = useState('RUB');

   return (
      <header>
         <div className={styles.container}>
            <div className={styles.headerLogo}>
               <Link to="/home">AirWingo</Link>
            </div>
            <nav>
               <ul className={styles.navList}>
                  <AuthModal />
                  {NAV_ITEMS.map(item => (
                     <li key={item.label}>
                        <NavLink to={item.to}>{item.label}</NavLink>
                     </li>
                  ))}

                  <select
                     value={currency}
                     onChange={e => setCurrency(e.target.value)}
                     className={styles.currencySelect}
                  >
                     <option value="RUB">₽ RUB</option>
                     <option value="USD">$ USD</option>
                     <option value="EUR">€ EUR</option>
                     <option value="KZT">₸ KZT</option>
                  </select>
               </ul>
            </nav>
         </div>
      </header>
   );
};

export default Header;
