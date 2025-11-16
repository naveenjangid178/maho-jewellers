import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCatalogues } from "../utils/catalogue";
import { motion, AnimatePresence } from "framer-motion";
import { requestAccess } from "../utils/requestAccess"
import { usePopup } from '../context/PopupContext'
import { X } from 'lucide-react'

const CatalogueContainer = () => {
    const navigate = useNavigate();
    const { setIsPopupVisible } = usePopup();
    const [requestCatalogue, setRequestCatalogue] = useState(false)
    const [catalogues, setCatalogues] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const [catalogueId, setCatalogueId] = useState("")
    const [title, setTitle] = useState("")

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getAllCatalogues();
                setCatalogues(response);
            } catch (error) {
                console.error("Error fetching catalogues:", error);
            }
        }
        fetchCatalogues();
    }, []);

    const handleClick = async ({ id }) => {
        const user = localStorage.getItem('user');

        if (user) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${user}/allowed-catalogues`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (response.ok) {
                    const hasCatalogue = data.data.some(catalogue => String(catalogue.catalogue._id) === String(id));

                    if (hasCatalogue) {
                        navigate(`/catalogue/${id}`)
                    } else {
                        setRequestCatalogue(true);
                    }
                } else {
                    console.error("Failed to fetch catalogues:", data.message);
                }
            } catch (error) {
                console.error("Error fetching allowed catalogues:", error);
            }
        } else {
            setIsPopupVisible(true);
        }
    };

    const handleRequestAccess = async () => {
        const user = localStorage.getItem('user');
        const phone = localStorage.getItem('phone');

        const payload = {
            title: title,
            catalogueId: catalogueId,
            userId: user,
            phone: phone,
        };

        const result = await requestAccess(payload);
        setRequestCatalogue(false);

        if (result.success) {
            alert("Request submitted successfully!");
        } else {
            alert(`Failed: ${result.message}`);
        }
    };

    const hoveredCatalogue = hoveredId
        ? catalogues.find((c) => c._id === hoveredId)
        : catalogues[0]; // default to first catalogue

    return (
        <section className="md:px-24 px-4 mt-8">
            <h3 className="text-[#9C1137] text-3xl font-[Platypi] py-4">
                Shop by Collection
            </h3>
            <div className="flex flex-col-reverse justify-between bg-[#f3ecde] rounded md:flex-row gap-8 px-4 md:px-8">
                {/* LEFT: Catalogue Names */}
                <div className="flex flex-col gap-4 w-full md:w-1/3 py-4 md:py-8 justify-center">
                    {catalogues.map((c) => (
                        <div
                            key={c._id}
                            onMouseEnter={() => setHoveredId(c._id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => {
                                handleClick(c._id)
                                setCatalogueId(c._id)
                                setTitle(c.title)
                                console.log(c._id)
                                console.log(c.title)
                            }}
                            className="text-xl md:text-2xl font-semibold py-2 border-b cursor-pointer transition"
                        >
                            {c.title}
                        </div>
                    ))}
                </div>

                {/* RIGHT: Image Preview */}
                <div className="flex-1 h-96 md:h-[500px] w-full md:max-w-fit relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {hoveredCatalogue && (
                            <motion.img
                                key={hoveredCatalogue._id}
                                src={hoveredCatalogue.image}
                                alt={hoveredCatalogue.title}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="h-full object-cover md:w-140"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {requestCatalogue && <div className='fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-100'>
                <span className='relative p-8 pt-12 pb-4 backdrop-blur-2xl bg-gray-300 shadow-sm rounded-xl'>
                    <button
                        className='py-2 px-4 font-normal rounded bg-green-700 cursor-pointer text-gray-900'
                        onClick={handleRequestAccess}
                    >Request Access</button>
                    <X className='absolute top-2 right-2 text-red-500 cursor-pointer' onClick={() => setRequestCatalogue(false)} />
                </span>
            </div>}
        </section>
    );
};

export default CatalogueContainer;
