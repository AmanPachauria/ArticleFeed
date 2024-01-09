import React, { useEffect, useState } from 'react';
import ListingCards from '../components/ListingCards';
import { useSelector } from "react-redux";
export default function Home() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAllListing = async () => {
      try {
        const response = await fetch(`/server/listing/get`);
        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log("before sorted data", data);
        console.log("prfrences array", currentUser.preferences)
        const sortedData = data.sort((a, b) => {
          const indexA = currentUser.preferences.indexOf(a.category);
          const indexB = currentUser.preferences.indexOf(b.category);
        
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
        
          return indexA - indexB;
        });

        console.log("Sorted data", sortedData);

        setListings(sortedData);
        setError(null);
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListing();
  }, []);

  return (
    <div className="mt-20 p-4 flex flex-wrap justify-center gap-4">
      {error && <p className='text-red-500 font-medium sm:font-semibold mt-5'>Error: {error}</p>}
      {!loading && listings.length === 0 && (
        <p className='text-xl text-slate-300'>No listings Available!</p>
      )}
      {loading && (
        <p className='text-4xl text-center w-full'>
          Loading...
        </p>
      )}
      {!loading && listings.map((listing) => (
        <ListingCards key={listing._id} listing={listing} />
      ))}
    </div>
  );
}
