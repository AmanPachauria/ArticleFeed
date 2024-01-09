import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const ImageCard = ({ imageUrl }) => (
  <div className="max-w-md mx-auto bg-white shadow-lg rounded-md overflow-hidden mb-8">
    <img
      src={imageUrl}
      alt="Listing Image"
      className="w-full h-64 object-contain object-center"
    />
  </div>
);


export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/server/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const handleBlockArticle = async () => {

    try {
      const data = {
        listingId: params.listingId,
        userId: currentUser._id
      }

      const response = await fetch('/server/user/blockArticle',{
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      }); 
       const getData = await response.json();
      if( getData.success === false){
           alert(getData.message);
      }
      navigate('/');
    } catch (error) {
      console.log("user or listing not found");
    }
      
  }

  return (
    <main className="container mx-auto p-5">
      {loading && <p className="text-center">Loading...</p>}
      {error && (
        <p className="text-center text-red-500">Something went wrong!</p>
      )}

      <div className="flex flex-col lg:flex-row mt-20">
        {listing && !loading && !error && (
          <div className="w-full lg:w-1/3 lg:mr-8 mb-8 lg:mb-0">
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <ImageCard imageUrl={url} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="w-full lg:w-2/3">
          {listing && !loading && !error && (
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold mb-4">
                {listing.title}
              </h1>
              <p className="text-gray-600 mb-4">{listing.description}</p>
              <div className="flex flex-col gap-5 lg:flex-row space-y-4 lg:space-x-4 lg:space-y-0">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Like
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Dislike
                </button>
                <button 
                  onClick={handleBlockArticle}
                 className="bg-gray-500 text-white px-4 py-2 rounded">
                  Block
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}