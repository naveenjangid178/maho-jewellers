import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCatalogues } from '../utils/catalogue'
import CatalogueCard from './CatalogueCard'

const CatalogueContainer = () => {
    const navigate = useNavigate()
    const [catalogues, setCatalogues] = useState([])

    useEffect(() => {
        async function fetchCatalogues() {
            try {
                const response = await getAllCatalogues();
                setCatalogues(response);
            } catch (error) {
                console.error('Error fetching catalogues:', error);
            }
        }
        fetchCatalogues();
    }, []);

    return (
        <section className='md:px-12 px-4 py-8 flex flex-col gap-8'>
            <h3 className='text-[#9C1137] text-3xl font-[Platypi] py-4'>Catalogues</h3>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-12 justify-between'>
                {catalogues.slice(0, 4).map((c) => <CatalogueCard id={c._id} title={c.title} image={c.image} productCount={c.productCount} />)}
            </div>
            <span className='py-1 border border-[#9C1137] w-fit m-auto mt-8'>
                <button
                    className='text-[#9C1137] text-center hover:font-medium  px-8 font-normal cursor-pointer hover:scale-110 transform duration-100 ease-in-out'
                    onClick={() => navigate("/catalogue")}
                >View All</button>
            </span>
        </section>
    )
}

export default CatalogueContainer