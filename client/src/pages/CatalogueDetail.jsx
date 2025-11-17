import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ShoppingCard from '../components/ShoppingCard';
import useTrackProductView from '../utils/trackProductView';
import { useProductList } from '../context/ProductListContext';

const CatalogueDetail = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [title, setTitle] = useState("");
    const [phone, setPhone] = useState(null);
    const { setProductsForDetail } = useProductList();

    // Get phone from localStorage or wherever you store user info
    useEffect(() => {
        const storedUser = localStorage.getItem('phone'); // or however you save it
        if (storedUser) {
            setPhone(storedUser);  // assuming storedUser is phone number, adjust if needed
        }
    }, []);
    useTrackProductView({ phone: phone, catalogue: title });
    

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/catalouge/${id}`);
                setTitle(response.data.catalogue.title)
                setProducts(response.data.catalogue.products);
                setProductsForDetail(response.data.catalogue.products);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            }
        }
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <section className='md:px-24 px-4 py-8 flex text-center flex-col gap-8'>
                <h2 className='text-2xl font-bold pb-4'>{title}</h2>
                <div className='flex flex-wrap gap-2 md:justify-between justify-items-center'>
                    {products.map((items, i) => <ShoppingCard id={items._id} name={items.sku} image={items.images[0]} index={i} netWeight={items.netWeight} grossWeight={items.grossWeight} />)}
                </div>
            </section>
        </>
    )
}

export default CatalogueDetail