import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "./BookingWidget";

export default function PlacesPage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos , setShowAllPhotos] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then(response => {
            setPlace(response.data);
        });
    }, [id]);

    if (!place) return null;
  
     if(showAllPhotos) {
        return(
            
            <div className="absolute inset-0  bg-black text-black min-h-screen " >
                <div className="bg-black p-8 grid gap-4" key={place._id}>
                    <div>

                        <button onClick={()=> setShowAllPhotos(false)} className="flex fixed text-sm top-2 left-10 py-2 px-4 bg-white rounded-2xl border-black  shadow-md shadow-gray-500 hover:shadow-inner"> Close all Photos</button>
                    </div>
                {place?.photos?.length >0 && place.photos.map(photo=>(
                    <div>
                         
                          <img src = {'http://localhost:3000/uploads/'+photo} alt ="image"  />

                        </div>

      ))}
      </div>
          
            </div>
        )
     }
    return (
        <div className="mt-8 bg-gray-100 -mx-8 px-8 py-8" key={place._id}>
            <h1 className="text-3xl">{place.title}</h1>
            <a
                className="my-2 block font-semibold underline"
                target="_blank"
                href={'https://map.google.com/?q=' + place.address}
            >
                {place.address}
            </a>
            <div className="relative">
            <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                <div style={{ height: '500px' /* Adjust the height as needed */ }}>
                    {place.photos?.[0] && (
                        <div className="overflow-hidden h-full">
                            <img
                                className="aspect-square  object-cover w-full h-full"
                                src={'http://localhost:3000/uploads/'+place.photos[0]}
                                alt="image"
                                onClick={() => setShowAllPhotos(true)}
                            />
                        </div>
                        )}
                </div>
                    
                    <div className="h-[500px] ">
                        {place.photos?.[1] &&(
                            <img className="aspect-square object-cover h-1/2 w-full" src={'http://localhost:3000/uploads/' + place.photos[1]} onClick={() => setShowAllPhotos(true)}/>
                        )}
                        {place.photos?.[1] &&(
                            
                            <img className="aspect-square object-cover h-1/2 w-full relative top-2" src={'http://localhost:3000/uploads/' + place.photos[0]} onClick={() => setShowAllPhotos(true)}/>
                           
                        )}

                    </div>
            </div>
            <button onClick={()=> setShowAllPhotos(true)} className="absolute  bottom-2 right-2 py-2 px-4 bg-white rounded-2xl border-black  shadow-md shadow-gray-500 hover:shadow-inner">Show more Photos</button>
            
            </div>


            <div className="mt-8 grid lg:grid-cols-2 md:grid-cols-[2fr_1fr]">
                <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Description</h2>{place.description}
            </div>
            
                
                Check-in : {place.checkIn}   <br/>
                Check-out : {place.checkOut} <br/>
                Max number of guests : {place.maxGuests}
               
               </div>
                
                <div>
                    <BookingWidget place={place}/>
                </div>
              
                 
            </div>
            <div>
                <h2 className="font-semibold text-2xl">Extra Info</h2>
            </div>
            <div className="my-4 text-sm text-gray-700 leading-4">{place.extraInfo}</div>
        </div>

    );
}
