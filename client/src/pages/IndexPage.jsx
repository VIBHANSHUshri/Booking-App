import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function IndexPage() {
 const [places,setPlaces] = useState([]);
   useEffect(() => {

     axios.get('/places').then(response => {
      setPlaces(response.data)
     });
   },[]);
   return (
      <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
         {places.length > 0 && places.map(place => (
            <Link key = {place._id} to = {'/place/'+place._id}>
            <div className="bg-gray-500 rounded-2xl">
               {place.photos?.[0] && (
                  <img  className = "rounded-2xl object-cover  aspect-square " src = {'http://localhost:3000/uploads/'+place.photos?.[0]} alt = "image" />
               )}
               
               </div>
               <h3 className="mt-2 font-bold leading-4">{place.address}</h3>
                <h2 className="text-sm text-gray-500 ">{place.title}</h2>
              
                <div className=""> <span className="font-bold">Rs. {place.price}</span> per night</div>
                </Link>
         ))}
      </div>
   )
}