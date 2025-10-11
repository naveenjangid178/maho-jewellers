import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCatalogues } from '../utils/catalogue'
import CatalogueCard from '../components/CatalogueCard'
import Navbar from '../components/Navbar'

const Catalogues = () => {
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
    <>
    <Navbar />
      <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 justify-between'>
          {catalogues.map((c) => <CatalogueCard id={c._id} title={c.title} image={c.image} productCount={c.productCount} />)}
        </div>
      </section>
    </>
  )
}

export default Catalogues