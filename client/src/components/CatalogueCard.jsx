import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePopup } from '../context/PopupContext'
import { X } from 'lucide-react'
import { requestAccess } from "../utils/requestAccess"

const CatalogueCard = ({ id, title, image, productCount }) => {
    const { setIsPopupVisible } = usePopup();
    const navigate = useNavigate()
    const [requestCatalogue, setRequestCatalogue] = useState(false)

    // const handleClick = async ({ id }) => {
    //     const user = localStorage.getItem('user');

    //     if (user) {
    //         try {
    //             const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${user}/allowed-catalogues`, {
    //                 method: 'GET',
    //             });

    //             const data = await response.json();

    //             if (response.ok) {
    //                 const hasCatalogue = data.data.some(catalogue => String(catalogue.catalogue._id) === String(id));

    //                 if (hasCatalogue) {
    //                     navigate(`/catalogue/${id}`)
    //                 } else {
    //                     setRequestCatalogue(true);
    //                 }
    //             } else {
    //                 console.error("Failed to fetch catalogues:", data.message);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching allowed catalogues:", error);
    //         }
    //     } else {
    //         setIsPopupVisible(true);
    //     }
    // };

    const handleRequestAccess = async () => {
        const user = localStorage.getItem('user');
        const phone = localStorage.getItem('phone');

        const payload = {
            title: title,
            catalogueId: id,
            userId: user,
            phone: phone,
        };

        const result = await requestAccess(payload);

        if (result.success) {
            alert("Request submitted successfully!");
        } else {
            alert(`Failed: ${result.message}`);
        }
    };

    return (
        <>
            <div
                key={id}
                className="text-center flex flex-col gap-2 shadow-xs shadow-gray-500 bg-transparent backdrop-blur-2xl p-2 rounded"
                // onClick={() => handleClick({ id })}
                onClick={() => navigate(`/catalogue/${id}`)}
            >
                <img src={image} className='h-52 w-full object-fill object-center rounded' />
                <div className="">
                    <h2 className="font-semibold text-gray-800 text-start text-[1.15rem]">{title}</h2>
                    <div className="text-sm text-gray-700 text-start">
                        {productCount} Products
                    </div>
                </div>
            </div>
            {requestCatalogue && <div className='fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-100'>
                <span className='relative p-8 pt-12 pb-4 backdrop-blur-2xl bg-gray-300 shadow-sm rounded-xl'>
                    <button
                        className='py-2 px-4 font-normal rounded bg-green-700 cursor-pointer text-gray-900'
                        onClick={() => handleRequestAccess}
                    >Request Access</button>
                    <X className='absolute top-2 right-2 text-red-500 cursor-pointer' onClick={() => setRequestCatalogue(false)} />
                </span>
            </div>}
        </>
    )
}

export default CatalogueCard