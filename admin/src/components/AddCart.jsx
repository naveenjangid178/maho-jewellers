import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddCart = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);

    const [selectedUser, setSelectedUser] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const [orderProducts, setOrderProducts] = useState([
        { productId: "", quantity: 1, search: "", open: false }
    ]);

    const userDropdownRef = useRef(null);

    // Fetch users
    useEffect(() => {
        async function fetchUsers() {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/`);
                setUsers(data.data || []);
            } catch (err) {
                console.error("User fetch error:", err);
            }
        }
        fetchUsers();
    }, []);

    // Fetch products
    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/product/`);
                setProducts(data.products || []);
            } catch (err) {
                console.error("Product fetch error:", err);
            }
        }
        fetchProducts();
    }, []);

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Close user dropdown
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(e.target)
            ) {
                setUserDropdownOpen(false);
            }

            // Close only product dropdowns clicked outside
            setOrderProducts((prev) =>
                prev.map((p, index) => {
                    const dropdown = document.getElementById(`product-dropdown-${index}`);
                    const searchInput = document.getElementById(`product-search-${index}`);

                    if (
                        dropdown &&
                        !dropdown.contains(e.target) &&
                        searchInput &&
                        !searchInput.contains(e.target)
                    ) {
                        return { ...p, open: false };
                    }

                    return p;
                })
            );
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update a product row
    const updateProductRow = (i, key, value) => {
        const updated = [...orderProducts];
        updated[i][key] = value;
        setOrderProducts(updated);

        // Auto-add new empty row if selecting last product
        if (key === "productId" && value && i === orderProducts.length - 1) {
            setOrderProducts((prev) => [
                ...prev,
                { productId: "", quantity: 1, search: "", open: false }
            ]);
        }
    };

    // Place order
    const placeOrder = async () => {
        const finalProducts = orderProducts
            .filter((p) => p.productId)
            .map((p) => ({
                productId: p.productId,
                quantity: Number(p.quantity),
            }));

        if (!selectedUser || finalProducts.length === 0) {
            return alert("Please select a user and at least one product.");
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/order/admin-create`, {
                userId: selectedUser,
                products: finalProducts,
            });

            alert("Order placed successfully!");
        } catch (err) {
            console.error("Order error:", err);
            alert("Order failed!");
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className="w-full h-[90%] max-w-md rounded-lg p-6 shadow-lg space-y-5 pt-20 overflow-y-auto relative bg-transparent backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6">Create New Order</h2>
                <button
                    className="absolute top-8 right-3 cursor-pointer text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                {/* USER DROPDOWN */}
                <label className="font-medium">Select User (Search by Phone)</label>

                <div className="relative mt-2 mb-4" ref={userDropdownRef}>
                    <input
                        type="text"
                        placeholder="Search user by phone..."
                        value={userSearch}
                        className="w-full p-2 border rounded cursor-pointer"
                        onClick={() => setUserDropdownOpen(true)}
                        onChange={(e) => {
                            setUserSearch(e.target.value);
                            setUserDropdownOpen(true);
                        }}
                    />

                    {userDropdownOpen && (
                        <div className="absolute bg-white border w-full max-h-40 overflow-y-auto rounded shadow z-20">
                            {users
                                .filter((u) =>
                                    u.phone?.toString().includes(userSearch)
                                )
                                .map((u) => (
                                    <div
                                        key={u._id}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            setSelectedUser(u._id);
                                            setUserSearch(u.phone.toString());
                                            setUserDropdownOpen(false);
                                        }}
                                    >
                                        {u.phone}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* PRODUCT SELECTION */}
                <h3 className="mt-6 text-lg font-semibold">Products</h3>

                {orderProducts.map((row, i) => (
                    <div
                        key={i}
                        className="border p-4 mt-4 bg-gray-50 rounded shadow-sm relative"
                    >
                        {/* Search input */}
                        <input
                            id={`product-search-${i}`}
                            type="text"
                            placeholder="Search by SKU..."
                            className="w-full p-2 border rounded mb-2"
                            value={row.search}
                            onClick={() => updateProductRow(i, "open", true)}
                            onChange={(e) => {
                                updateProductRow(i, "search", e.target.value);
                                updateProductRow(i, "open", true);
                            }}
                        />

                        {/* Dropdown */}
                        {row.open && (
                            <div
                                id={`product-dropdown-${i}`}
                                className="absolute left-0 top-14 bg-white border w-full max-h-40 overflow-y-auto rounded shadow z-20"
                            >
                                {products
                                    .filter((p) =>
                                        p.sku?.toString().includes(row.search)
                                    )
                                    .map((p) => (
                                        <div
                                            key={p._id}
                                            className="p-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => {
                                                updateProductRow(i, "productId", p._id);
                                                updateProductRow(i, "search", p.sku);
                                                updateProductRow(i, "open", false);
                                            }}
                                        >
                                            {p.sku}
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* Quantity */}
                        <input
                            type="number"
                            min="1"
                            className="w-full p-2 border rounded mt-2"
                            value={row.quantity}
                            onChange={(e) =>
                                updateProductRow(i, "quantity", e.target.value)
                            }
                        />
                    </div>
                ))}

                <button
                    onClick={() =>
                        setOrderProducts([
                            ...orderProducts,
                            { productId: "", quantity: 1, search: "", open: false }
                        ])
                    }
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    + Add Another Product
                </button>

                {/* PLACE ORDER */}
                <button
                    onClick={placeOrder}
                    className="mt-6 w-full bg-green-600 text-white p-3 rounded text-lg"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default AddCart;
