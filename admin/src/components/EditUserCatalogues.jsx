import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const LIFETIME_DATE = '9999-12-31T23:59';

const EditUserCatalogues = ({ userId, currentCatalogues = [], onClose, onSuccess }) => {
    const [allCatalogues, setAllCatalogues] = useState([]);
    const [selected, setSelected] = useState(() =>
        currentCatalogues.map(({ catalogue, expiresAt }) => {
            console.log(expiresAt)
            const isLifetime = !expiresAt || new Date(expiresAt).getFullYear() === 9999;
            return {
                catalogue: catalogue._id,
                expiresAt: isLifetime
                    ? LIFETIME_DATE
                    : new Date(expiresAt).toLocaleString('sv-SE', {
                        timeZone: 'Asia/Kolkata',
                    }).replace(' ', 'T'), // preserves date + time
            };
        })
    );
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCatalogues = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/catalouge`);
                setAllCatalogues(res.data.catalogues);
            } catch (err) {
                setError('Failed to fetch catalogues');
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogues();
    }, []);

    const isSelected = (catalogueId) =>
        selected.some((item) => item.catalogue === catalogueId);

    const handleToggle = (catalogueId) => {
        if (isSelected(catalogueId)) {
            setSelected(selected.filter((item) => item.catalogue !== catalogueId));
        } else {
            setSelected([
                ...selected,
                { catalogue: catalogueId, expiresAt: LIFETIME_DATE },
            ]);
        }
    };

    const handleExpiryChange = (catalogueId, value) => {
        setSelected((prev) =>
            prev.map((item) =>
                item.catalogue === catalogueId
                    ? { ...item, expiresAt: value }
                    : item
            )
        );
    };

    const handleLifetimeToggle = (catalogueId, checked) => {
        handleExpiryChange(catalogueId, checked ? LIFETIME_DATE : new Date().toISOString().slice(0, 16));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="w-full max-w-md rounded-lg p-6 shadow-lg space-y-5 relative bg-transparent backdrop-blur-xl">
                <button
                    className="absolute top-8 right-3 text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800">
                    Edit Allowed Catalogues
                </h2>

                {loading ? (
                    <div className="text-center py-6">Loading catalogues...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {allCatalogues.map((catalogue) => {
                                const selectedItem = selected.find(
                                    (item) => item.catalogue === catalogue._id
                                );
                                const expiresAt = selectedItem?.expiresAt || '';

                                return (
                                    <div key={catalogue._id} className="flex flex-col border-b pb-2 mb-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!!selectedItem}
                                                onChange={() => handleToggle(catalogue._id)}
                                                className="accent-blue-600"
                                            />
                                            <span className="text-gray-700 font-medium">{catalogue.title}</span>
                                        </label>

                                        {selectedItem && (
                                            <div className="flex flex-col ml-7 mt-1 text-sm text-gray-600 gap-1">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={expiresAt === LIFETIME_DATE}
                                                        onChange={(e) =>
                                                            handleLifetimeToggle(catalogue._id, e.target.checked)
                                                        }
                                                    />
                                                    Lifetime Access
                                                </label>

                                                {expiresAt !== LIFETIME_DATE && (
                                                    <input
                                                        type="datetime-local"
                                                        value={expiresAt}
                                                        min={new Date().toISOString().slice(0, 16)}
                                                        onChange={(e) =>
                                                            handleExpiryChange(catalogue._id, e.target.value)
                                                        }
                                                        className="border rounded px-2 py-1 text-sm"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                onClick={async () => {
                                    try {
                                        setSaving(true);
                                        const payload = selected.map((item) => ({
                                            catalogue: item.catalogue,
                                            expiresAt:
                                                item.expiresAt === LIFETIME_DATE
                                                    ? new Date(LIFETIME_DATE).toISOString()
                                                    : new Date(item.expiresAt).toISOString(),
                                        }));

                                        await axios.put(
                                            `${import.meta.env.VITE_API_URL}/user/${userId}/catalogues`,
                                            { allowedCatalogues: payload }
                                        );

                                        onSuccess?.();
                                        onClose?.();
                                    } catch (err) {
                                        setError('Failed to update user catalogues');
                                    } finally {
                                        setSaving(false);
                                    }
                                }}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditUserCatalogues;
