import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container mx-auto my-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome to the Article Feed
      </h2>
      <p className="text-lg text-gray-600 mb-4">
        Discover a world of knowledge and inspiration! Our Article Feed page is
        your gateway to a diverse collection of articles on various topics.
        Immerse yourself in captivating content, express your preferences, and
        engage with the community.
      </p>
      <p className="text-lg text-gray-600 mb-4">
        While our current version focuses on providing a seamless reading
        experience, we're always evolving. Stay tuned for exciting updates that
        may include features like article creation, editing, and more
        interactive community engagement.
      </p>
      <p className="text-lg text-gray-600 mb-6">
        Join the conversation, explore the articles, and make your voice heard.
        Your journey into the world of ideas begins here. Feel free to{" "}
        <Link
          to="/"
          className="text-blue-500 underline hover:text-blue-700"
        >
          explore the articles
        </Link>{" "}
        and enjoy the content crafted by the community!
      </p>
      <p className="text-sm text-gray-500">
        Looking to contribute? Visit our{" "}
        <Link
          to="/create-listing"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Create Article
        </Link>{" "}
        page and share your thoughts with the world.
      </p>
    </div>
  );
}
