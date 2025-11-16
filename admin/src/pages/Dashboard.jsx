import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingBag, Plus, Trash2Icon, X } from 'lucide-react';
import axios from 'axios';
import SliderImageUpload from '../components/SliderImageUpload';
import "../index.css"
import EditUserCatalogues from '../components/EditUserCatalogues';
import AddCatalogueExpiryModal from '../components/AddCatalogueExpiryModal';

const stats = [
  {
    name: 'Total Users',
    value: '2,847',
    icon: Users,
    change: '+12%',
    changeType: 'positive',
  },
  {
    name: 'Active Catalogues',
    value: '24',
    icon: Package,
    change: '+3%',
    changeType: 'positive',
  },
  {
    name: 'Total Products',
    value: '1,293',
    icon: ShoppingBag,
    change: '+18%',
    changeType: 'positive',
  },
];

function Dashboard() {
  const [createSliderImage, setCreateSliderImage] = useState(false);
  const [slider, setSlider] = useState([])
  const [userId, setUserId] = useState('')
  const [catalogueId, setCatalogueId] = useState('')
  const [requestId, setRequestId] = useState('')
  const [requestCatalogues, setRequestCatalogues] = useState([])
  const [editUser, setEditUser] = useState(false)

  const getUserRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/request-access/`);
      setRequestCatalogues(response.data.data)
      console.log(response.data.data)
      return response.data; // this should be an array of image objects
    } catch (error) {
      console.error('Error fetching sidebar images:', error);
      return [];
    }
  }

  useEffect(() => {
    getUserRequests();
  }, [])

  useEffect(() => {
    const getAllSidebarImages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/slider/`);
        // console.log(response.data)
        setSlider(response.data)
        return response.data; // this should be an array of image objects
      } catch (error) {
        console.error('Error fetching sidebar images:', error);
        return [];
      }
    };

    getAllSidebarImages()
  }, [createSliderImage])

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/slider/${id}`);
      console.log('Delete response:', res.data);

      // Remove the deleted image from the local state
      alert("Image deleted Successfully!")
      setSlider((prevImages) => prevImages.filter((image) => image._id !== id));
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-white max-w-7xl mx-auto">
      <header className='flex md:items-center justify-between md:flex-row flex-col gap-4 items-start'>
        <span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin panel. Here's an overview of your application.</p>
        </span>
        <button className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setCreateSliderImage(!createSliderImage)}>
          <Plus className="h-4 w-4" /> Upload Image
        </button>
      </header>


      {/* Stats Cards */}
      {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ name, value, icon: Icon, change, changeType }) => (
          <div
            key={name}
            className="flex items-center p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Icon className="w-6 h-6" />
            </div>

            <div>
              <p className="text-gray-500 font-medium">{name}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </section> */}
      <section className='flex gap-2 overflow-x-auto scroller'>
        {slider.map(s => <div className='h-32 relative content-center' key={s._id}>
          <img src={s.imageUrl} className='w-fit max-w-40 h-32' />
          <Trash2Icon className='text-red-500 absolute bottom-2 right-2 z-10 cursor-pointer' onClick={() => handleDelete(s._id)} />
        </div>)}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Recent Activity</h2>
        <p className="text-gray-600 mb-6">Latest actions performed in the system</p>

        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-gray-50">
          {requestCatalogues.map((req, i) => (
            <div className="flex justify-between items-center p-4" key={i}>
              {console.log(req)}
              <div>
                <p className="font-semibold text-gray-900">{req.title}</p>
                <p className="text-sm text-gray-600">{req.phone}</p>
              </div>
              <span
                onClick={() => {
                  setEditUser(true)
                  setUserId(req.userId)
                  setCatalogueId(req.catalogueId)
                  setRequestId(req._id)
                }}
                className="text-sm text-white rounded cursor-pointer font-semibold whitespace-nowrap bg-green-500 p-2"
              >Approve</span>
            </div>
          ))}
        </div>
      </section >

      {createSliderImage && <SliderImageUpload createSliderImage={createSliderImage} setCreateSliderImage={setCreateSliderImage} />
      }
      {editUser && (
        <AddCatalogueExpiryModal
          userId={userId}
          requestId={requestId}
          catalogueId={catalogueId}
          onClose={() => setEditUser(null)}
          onSuccess={getUserRequests}
        />
      )}
    </div >
  );
}

export default Dashboard;
