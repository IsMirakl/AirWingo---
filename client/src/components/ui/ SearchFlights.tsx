import { useEffect, useMemo, useState } from 'react';
import { FormField } from './forms/FormField';

import componentStyles from '../ui/forms/FormFieldComponent.module.css';
import CityDropdown from './dropdown/DropdownCIty';

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

const SearchFlights = () => {
   const [mainCity, setMainCity] = useState('');
   const [endCity, setEndCity] = useState('');

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
      } else {
         setEndCity(city.name);
      }
   };
   return (
      <>
         <h1>Дешевые билеты на самолеты !</h1>
         <form action="" className={componentStyles.formContainer}>
            <FormField
               type="text"
               placeholder="Откуда"
               value={mainCity}
               onChange={handleMainCityInputChange}
               required
               className={componentStyles.mainCityField}
            />
            {shouldMainCitiesShowDropdown && (
               <CityDropdown
                  cities={filteredMainCities}
                  className={componentStyles.mainCityDropdown}
                  onCitySelect={city => handleCitySelected(city, 'start')}
               />
            )}

            <FormField
               type="text"
               placeholder="Куда"
               value={endCity}
               onChange={handleEndCityChange}
               required
               className={componentStyles.endCityField}
            />

            {shouldEndCitiesShowDropdown && (
               <CityDropdown
                  cities={filteredEndCities}
                  className={componentStyles.endCityDropdown}
                  onCitySelect={city => handleCitySelected(city, 'end')}
               />
            )}
         </form>
      </>
   );
};

export default SearchFlights;
