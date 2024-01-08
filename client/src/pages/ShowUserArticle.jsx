import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import ListingItem from '../components/ListingItem';

const UserListingsPage = () => {
  const { loading, userListings } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log('User Listings in ShowUserListing', userListings);



  return (
    <div className="max-w-6xl mx-auto p-1 flex flex-col gap-7 my-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">{loading ? 'Loading...' : 'User Listings'}</h1>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        { userListings.length > 0 ? (
          <div className="">
            <div className="flex flex-wrap gap-4 justify-center">
              {userListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-row gap-2'>
            <span>You don't have any article</span>
            <Link to={"/create-listing"}
             >
            <span className='text-blue-500 hover:text-blue-600 cursor-pointer'>Create article</span>
            </Link>
          </div>
          
        )}
        
      </div>
    </div>
  );
};

export default UserListingsPage;
