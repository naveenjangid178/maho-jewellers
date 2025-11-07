import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCatalogues } from "../utils/catalogue";
import { motion, AnimatePresence } from "framer-motion";

const CatalogueContainer = () => {
    const navigate = useNavigate();
    const [catalogues, setCatalogues] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);

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

    const hoveredCatalogue = hoveredId
        ? catalogues.find((c) => c._id === hoveredId)
        : catalogues[0]; // default to first catalogue

    return (
        <section className="md:px-12 px-4 mt-8">
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
                                className="h-full object-cover"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default CatalogueContainer;
