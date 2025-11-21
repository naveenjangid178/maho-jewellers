import { X } from 'lucide-react'
import React from 'react'

const ViewCart = ({ cart, onClose }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className="w-full max-w-md rounded-lg p-6 shadow-lg space-y-5 pt-20 overflow-y-auto h-[90%] relative bg-transparent backdrop-blur-xl">
                <button
                    className="absolute top-8 right-3 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
                {cart.products.map((item) => (
                    <div
                        key={item.productId._id}
                        className="flex gap-2 p-4 bg-white shadow rounded"
                    >
                        <div
                            className="flex items-center gap-4 cursor-pointer"
                        >
                            <img
                                src={item.productId.images[0]}
                                alt={item.productId.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div>
                                <p>{item.productId.name}</p>
                                <p className="text-sm text-gray-500">
                                    SKU: {item.productId.sku}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Net: {item.productId.netWeight}, Gross:{" "}
                                    {item.productId.grossWeight}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ViewCart