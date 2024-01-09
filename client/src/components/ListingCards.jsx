import React from "react";

export default function ListingCards({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[305px]">
      <img
        src={
          listing.imageUrls[0] ||
          "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
        }
        alt="listing image"
        className="h-[320px] sm:h-[220px] w-full object-contain hover:scale-105 transition-scale duration-300"
      />

      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-slate-750">
          {listing.title}
        </p>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">
        {listing.description}
      </p>
    </div>
    // <div >
    //
    // <div/>
  );
}
