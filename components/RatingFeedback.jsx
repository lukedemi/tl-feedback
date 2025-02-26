export default function RatingFeedback({ onRatingSelected }) {
    const ratingOptions = [
      { value: "neutral", emoji: "😐" },
      { value: "yawning", emoji: "🥱" },
      { value: "mild", emoji: "🙂" },
      { value: "delighted", emoji: "😄" },
      { value: "starstruck", emoji: "🤩" },
    ];
  
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">
          Rate your experience at Tech Lancaster
        </h1>
        <div className="flex justify-center space-x-4">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onRatingSelected(option.value)}
              className="text-3xl focus:outline-none"
            >
              {option.emoji}
            </button>
          ))}
        </div>
      </div>
    );
  }
  