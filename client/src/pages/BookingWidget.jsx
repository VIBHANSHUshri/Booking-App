import { useState } from "react";
import {differenceInCalendarDays} from "date-fns";

export default function BookingWidget({place}){
    const[checkIn,setCheckIn] = useState('');
    const[checkOut,setCheckOut] = useState('');
    const[numberOfGuests,setNumberOfGuests] = useState(1);
    const[name,setName] = useState('');
    const[phone,setPhone] = useState('');
    
    
    let numberOfNights = 0;
    if (checkIn && checkOut) {
      numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }
    return(
        <div>
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
          Price : Rs.{place.price} / PerNight
          </div>
          <div className="border rounded-2xl mt-4">
            <div className="flex">
                   
            <div className="my-4  p-2 ">
            <label>Check In:</label>
            <input type = "date" value={checkIn} onChange={ev => setCheckIn(ev.target.value)}/>
           </div>
           <div className="my-4  p-2 border-l ">
            <label>Check Out:</label>
            <input type = "date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)}/>
          </div>
          </div>
          <div className="grid py-3 px-4 border-t">
            <label>Number of Guests : </label>
            <input type = "Number" placeholder="1" className="mt-2 border outline-none " value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)}/>
          </div> 
          {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)}/>
                   <div className="grid py-3 px-4 border-t">
            <label>Phone number:</label>
            <input type="tel"
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
                   </div>
          </div>
        )}
           
           </div>

          <button className="mt-4 primary">Book this place
          {numberOfNights > 0 && (
          <span className="font-bold"> Rs.{numberOfNights * place.price}</span>
          

        )}
        </button>
        </div>
        
       </div>
    )
}