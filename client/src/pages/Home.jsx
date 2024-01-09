import React, { useEffect, useState } from "react";
import ListingCards from "../components/ListingCards";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
          throw new Error(
            `Failed to fetch listings: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        console.log("before sorted data", data);
        console.log("prfrences array", currentUser.preferences);
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
    <div>
      {currentUser ? (
        <div className="mt-20 p-4 flex flex-wrap justify-center gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listings Available!</p>
          )}
          {loading && <p className="text-4xl text-center w-full">Loading...</p>}
          {!loading &&
            listings.map((listing) => (
              <ListingCards key={listing._id} listing={listing} />
            ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Welcome to the Article Feed
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Sign in to explore the listings and enjoy a personalized reading
            experience.
            <span className="block text-blue-500 underline hover:text-blue-700 mt-2">
              <Link to={"/sign-in"}>Sign In</Link>
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
