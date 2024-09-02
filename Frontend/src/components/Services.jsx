import React, { useEffect, useState } from 'react'
import axiosInstanceUser from '../services/axiosInstanceUser';


function Services() {
    const [services,setServices] = useState([])

    useEffect(() => {
        const fetchServices = async () => {
          try {
            const response = await axiosInstanceUser.get('/get-services');
            console.log(response.data)
            setServices(response.data);
          } catch (error) {
            console.error('Error fetching services:', error);
          }
        };
    
        fetchServices();
      }, []);
      return (
        <div className="p-10">
            <h3 className="text-3xl font-bold text-center mb-8">Our Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                    <div key={service._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <a href="/login">
                            <img
                                className="rounded-t-lg w-full h-48 object-cover"
                                src={service.imageUrl}
                                alt={service.name}
                            />
                        </a>
                        <div className="p-2">
                            <a href="/login">
                                <h3 className=" text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {service.name}
                                </h3>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            <footer/>
        </div>
    );
}

export default Services
