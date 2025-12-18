import Header from '../components/Header';

import SearchFlights from '../components/ui/ SearchFlights';
import styles from '../styles/pages/HomePage.module.css';

const HomePage = () => {
   return (
      <>
         <Header />
         <section className={styles.searchFlightsSection}>
            <SearchFlights />
         </section>
      </>
   );
};

export default HomePage;
