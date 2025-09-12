import React, { useEffect, useState } from 'react'
import CatalogueCard from './CatalogueCard'
import { getAllCatalogues } from '../../utils/catalogue'

const Catalogue = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogues = async () => {
      try {
        const data = await getAllCatalogues();
        setCatalogues(data); // or just `data` depending on your API
      } catch (err) {
        setError(err.message || "Failed to fetch catalogues.");
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogues()
  }, [])

  if (loading) return <p>Loading catalogues...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4 lg:px-12 md:px-8 px-2 py-4'>
      {catalogues.map((cat) => (
        <li key={cat._id} className='list-none'>
          <CatalogueCard catalogueName={cat.title} catalogueImage={cat.image} productCount={cat.productCount} catalogueId = {cat._id} />
        </li>
      ))}
    </div>
  )
}

export default Catalogue