import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setDeleteListing } from "../redux/user/userSlice";

export default function ListingItem({ listing }) {
  const dispatch = useDispatch();
  const userListings = useSelector((state) => state.user.userListings);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/server/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      dispatch(setDeleteListing(listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[360px]">
      <div className="block w-full h-full">
        <Link to={`/listing/${listing._id}`}>
          <div className="relative">
            <img
              src={
                listing.imageUrls[0] ||
                "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
              }
              alt="listing cover"
              className="h-[320px] sm:h-[220px] w-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-750">
            {listing.title}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleListingDelete(listing._id)}
              className="bg-red-500 text-white py-1 p-3 ml-4 rounded-lg hover:opacity-90 focus:outline-none focus:shadow-outline-blue"
            >
              delete
            </button>
            <button className="bg-blue-500 text-white py-1 p-3 mr-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue">
              edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
