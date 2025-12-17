import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { SearchFormField } from '../components/ui/forms/SearchForm';

import componentStyles from '../styles/components/SearchFormComponent.module.css';
import styles from '../styles/pages/HomePage.module.css';

const citiesData = [
   { id: 1, name: 'Москва' },
   { id: 2, name: 'Санкт-Петербург' },
   { id: 3, name: 'Новосибирск' },
   { id: 4, name: 'Екатеринбург' },
   { id: 5, name: 'Казань' },
];

interface City {
   id: number;
   name: string;
}

const HomePage = () => {
   const [mainCity, setMainCity] = useState('');
   const [endCity, setEndCity] = useState('');
   const [selectedMainCity, setSelectedMainCity] = useState<City | null>(null);
   const [selectedEndCity, setSelectedEndCity] = useState<City | null>(null);

   const handleMainCityInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setMainCity(e.target.value);
   };

   const handleEndCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndCity(e.target.value);
   };

   useEffect(() => {
      const timer = setTimeout(() => {
         setMainCity(mainCity);
         setEndCity(endCity);
      }, 300);

      return () => clearTimeout(timer);
   }, [mainCity, endCity]);

   const filteredMainCities = useMemo(() => {
      if (!mainCity.trim()) return [];

      return citiesData.filter(city =>
         city.name.toLowerCase().includes(mainCity.toLowerCase())
      );
   }, [mainCity]);

   const filteredEndCities = useMemo(() => {
      if (!endCity.trim()) return [];

      return citiesData.filter(city =>
         city.name.toLowerCase().includes(endCity.toLowerCase())
      );
   }, [endCity]);

   const shouldMainCitiesShowDropdown =
      mainCity.length > 0 &&
      filteredMainCities.length > 0 &&
      !(
         filteredMainCities.length === 1 &&
         filteredMainCities[0].name.toLowerCase() === mainCity.toLowerCase()
      );

   const shouldEndCitiesShowDropdown =
      endCity.length > 0 &&
      filteredEndCities.length > 0 &&
      !(
         filteredEndCities.length === 1 &&
         filteredEndCities[0].name.toLowerCase() === endCity.toLowerCase()
      );

   const handleCitySelected = (city: City, formField: 'start' | 'end') => {
      if (formField === 'start') {
         setMainCity(city.name);
         setSelectedMainCity(city);
      } else {
         setEndCity(city.name);
         setSelectedEndCity(city);
      }
   };

   return (
      <>
         <Header />
         <section className={styles.test}>
            <h1>Дешевые билеты на самолеты !</h1>
            <form action="">
               <SearchFormField
                  type="text"
                  placeholder="Откуда"
                  value={mainCity}
                  onChange={handleMainCityInputChange}
                  required
                  className={componentStyles.mainCityField}
               />
               {shouldMainCitiesShowDropdown && (
                  <ul>
                     {filteredMainCities.map(city => (
                        <li
                           key={city.id}
                           onClick={() => handleCitySelected(city, 'start')}
                        >
                           {city.name}
                        </li>
                     ))}
                  </ul>
               )}
               {selectedMainCity && (
                  <p>Выбранный город: {selectedMainCity.name}</p>
               )}

               <SearchFormField
                  type="text"
                  placeholder="Куда"
                  value={endCity}
                  onChange={handleEndCityChange}
                  required
                  className={componentStyles.endCityField}
               />

               {shouldEndCitiesShowDropdown && (
                  <ul>
                     {filteredEndCities.map(city => (
                        <li
                           key={city.id}
                           onClick={() => handleCitySelected(city, 'end')}
                        >
                           {city.name}
                        </li>
                     ))}
                  </ul>
               )}
               {selectedEndCity && (
                  <p>Выбранный город: {selectedEndCity.name}</p>
               )}
            </form>
         </section>
      </>
   );
};

export default HomePage;
