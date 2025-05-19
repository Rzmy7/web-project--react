import { useState } from "react";

function Review() {
  const [name, setName] = useState("");
  const [facilityType, setFacilityType] = useState("Canteen");
  const [review, setReview] = useState("");

  // ✅ NEW: Array to hold submitted reviews
  const [submittedReviews, setSubmittedReviews] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a review object
    const newReview = {
      id: Date.now(),
      name,
      facilityType,
      review,
    };

    // Add it to the array of reviews
    setSubmittedReviews([newReview, ...submittedReviews]);

    // Reset form fields
    setName("");
    setFacilityType("Canteen");
    setReview("");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 mt-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Submit a Review</h2>

      {/* 📝 FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Your Name:</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Facility Type:</label>
          <select
            className="w-full border border-gray-300 p-2 rounded"
            value={facilityType}
            onChange={(e) => setFacilityType(e.target.value)}
          >
            <option>Canteen</option>
            <option>Juice Bar</option>
            <option>Bookshop</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Your Review:</label>
          <textarea
            className="w-full border border-gray-300 p-2 rounded"
            rows="4"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>

      {/* ✅ DISPLAY REVIEWS BELOW */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Submitted Reviews</h3>
        {submittedReviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          submittedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-gray-100 p-4 rounded mb-4 border border-gray-200"
            >
              <p className="font-semibold text-gray-800">{rev.name}</p>
              <p className="text-sm text-gray-600">{rev.facilityType}</p>
              <p className="mt-2">{rev.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Review;
