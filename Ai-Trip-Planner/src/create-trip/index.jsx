import React, { useEffect } from "react";
import { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import { SelecetBudgetOptions, SelectTravelsList } from "@/constants/Options";

function CreateTrip() {

  const[formData,setFormData] = useState([]);
  
  const handleSubmit = (name,value) => {
    setFormData({
      ...formData,
      [name] : value
    }
    )
  }

  useEffect(()=>{
    console.log(formData)
  },[formData])

  return (
    <div className="sm:px-10 md:px-32 lg:px-36 xl:px-72 px-5 mt-10">
      <h2 className="text-center font-semibold text-[30px]">
        Customise your Trip
      </h2>
      <p className="text-center">
        Tell your preferences and let the AI do the rest
      </p>
      <div className="mt-10 flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-semibold">Where is your destination?</h2>
          {/* <GooglePlacesAutocomplete
          apiKey=''
          /> */}
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            How many days do you want to Travel ?
          </h2>
          <Input className="mt-5" placeholder="Ex. 3" type="number"
          onChange={(e)=>{
            handleSubmit('noOfDays',e.target.value)
          }}
          ></Input>
        </div>
        <div>
          <h2 className="text-xl font-semibold">What is your budget ?</h2>
          <div className="grid grid-cols-3 gap-5">
            {SelecetBudgetOptions.map((item,index)=>(
              <div key={index} className={`p-4 border rounded-md hover:shadow-lg
                ${formData?.budget==item.title && 'border-black bg-green-200'}
                `}
              onClick={()=>{
                handleSubmit('budget',item.title)
              }}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-small text-gray-600">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Whom with you planning to travel ?</h2>
          <div className="grid grid-cols-3 gap-5">
            {SelectTravelsList.map((item,index)=>(
              <div key={index} className={`p-4 border rounded-md hover:shadow-lg
                ${formData?.travel==item.title && 'border-black bg-green-200'}
                `}
              onClick={()=>{
                handleSubmit('travel',item.title)
              }}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-small text-gray-600">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mb-10">
          <button className="text-white">Generate Trip</button>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
