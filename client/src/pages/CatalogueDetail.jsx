import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ShoppingCard from '../components/ShoppingCard';
import useTrackProductView from '../utils/trackProductView';

const CatalogueDetail = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState("");
    const [phone, setPhone] = useState(null);

    // Get phone from localStorage or wherever you store user info
    useEffect(() => {
        const storedUser = localStorage.getItem('phone'); // or however you save it
        if (storedUser) {
            setPhone(storedUser);  // assuming storedUser is phone number, adjust if needed
        }
    }, []);

    useTrackProductView({ phone, catalogue: title });

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/catalouge/${id}`);
                setTitle(response.data.catalogue.title)
                setProducts(response.data.catalogue.products);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        }
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <section className='md:px-12 px-4 py-8 flex text-center flex-col gap-8'>
                <h2 className='text-2xl font-bold pb-4'>{title}</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 md:justify-between justify-items-center'>
                    {products.map((items, i) => <ShoppingCard name={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
                </div>
            </section>
        </>
    )
}

export default CatalogueDetail