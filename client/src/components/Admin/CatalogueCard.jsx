import { Edit2, X } from 'lucide-react';
import React, { useState } from 'react'

const CatalogueCard = ({ productCount, catalogueName, catalogueImage, catalogueId }) => {
  const [catalogueID, setCatalogueID] = useState('')
  const [editCatalogue, setEditCatalogue] = useState(false)

  const handleEdit = () => {
    setCatalogueID(catalogueId)
    setEditCatalogue(true)
  }
  return (
    <div className='flex bg-transparent shadow-xs shadow-gray-950 gap-4 p-4 items-center w-full cursor-pointer relative'>
      <img src={catalogueImage} className='lg:h-20 lg:w-20 md:h-16 md:w-16 h-12 w-12 contain rounded-full' />
      <div>
        <p className='font-bold'>{catalogueName}</p>
        <p>{productCount} Product</p>
      </div>
      <span className='absolute top-2 right-4' onClick={() => { handleEdit() }}><Edit2 className='w-4 hover:w-5 transition-[width] duration-300 ease-in-out' color='green' /></span>
      {
      editCatalogue && <div className='bg-transparent fixed top-0 left-0 overflow-hidden min-h-full min-w-full flex items-center justify-center'>
        <div className='shadow-xs shadow-gray-500 backdrop-blur-sm p-4 relative min-h-72 min-w-72 rounded'>
          <div>

          </div>
          <span className='absolute top-2 right-2 hover:text-red-700 cursor-pointer' onClick={() => setEditCatalogue(!editCatalogue)}><X /></span>
        </div>
      </div>
    }
    </div>

  )
}

export default CatalogueCard