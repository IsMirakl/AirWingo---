interface City {
   id: number;
   name: string;
}

interface CityDropDownProps {
   cities: City[];
   className: string;
   onCitySelect: (city: City) => void;
}
const CityDropdown = ({
   cities,
   className = '',
   onCitySelect,
}: CityDropDownProps) => {
   if (cities.length === 0) {
      return null;
   }

   return (
      <ul className={className}>
         {cities.map(city => (
            <li
               key={city.id}
               onClick={() => onCitySelect(city)}
               className="city-dropdown-item"
            >
               {city.name}
            </li>
         ))}
      </ul>
   );
};

export default CityDropdown;
