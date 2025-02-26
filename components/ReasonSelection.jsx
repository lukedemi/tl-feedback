import { useState } from "react";

export default function ReasonSelection({ rating, onReasonsSubmitted }) {
  const reasonsMapping = {
    neutral: [
      { text: "Food", emoji: "🍔" },
      { text: "Organization", emoji: "📅" },
      { text: "Speakers", emoji: "🎤" },
      { text: "Talk Content", emoji: "📖" },
      { text: "Venue", emoji: "🏚️" },
      { text: "Hard to connect", emoji: "👥" },
    ],
    yawning: [
      { text: "Food", emoji: "🍔" },
      { text: "Speakers", emoji: "🎤" },
      { text: "Talk Content", emoji: "📖" },
      { text: "Venue", emoji: "🏚️" },
      { text: "Energy", emoji: "⚡" },
      { text: "Timing", emoji: "⏰" },
      { text: "Hard to connect", emoji: "👥" },
    ],
    mild: [
      { text: "Food", emoji: "🍕" },
      { text: "Atmosphere", emoji: "😊" },
      { text: "Speakers", emoji: "🎤" },
      { text: "Talk Content", emoji: "📖" },
      { text: "Met People", emoji: "👥" },
    ],
    delighted: [
      { text: "Food", emoji: "🍽️" },
      { text: "Speakers", emoji: "🎙️" },
      { text: "Talk Content", emoji: "📖" },
      { text: "Organization", emoji: "📆" },
      { text: "Atmosphere", emoji: "🎉" },
      { text: "Met People", emoji: "👥" },
    ],
    starstruck: [
      { text: "Food", emoji: "🍣" },
      { text: "Speakers", emoji: "🌟" },
      { text: "Talk Content", emoji: "📖" },
      { text: "Experience", emoji: "🏆" },
      { text: "Networking", emoji: "🥂" },
      { text: "Event", emoji: "🎊" },
    ],
  };

  // Mapping from rating value to its corresponding emoji.
  const ratingEmojis = {
    neutral: "😐",
    yawning: "🥱",
    mild: "🙂",
    delighted: "😄",
    starstruck: "🤩",
  };

  const reasons = reasonsMapping[rating] || [];
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customReason, setCustomReason] = useState("");

  const toggleReason = (reasonText) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonText)
        ? prev.filter((r) => r !== reasonText)
        : [...prev, reasonText]
    );
  };

  const handleSubmit = () => {
    onReasonsSubmitted({ selectedReasons, customReason });
  };

  return (
    <div className="text-center mt-6">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Why did you feel {ratingEmojis[rating]}? (Select one or more reasons)
      </h2>
      <div className="flex flex-col space-y-3">
        {reasons.map((reason, index) => (
          <button
            key={index}
            onClick={() => toggleReason(reason.text)}
            className={`border border-blue-400 rounded py-2 px-4 flex items-center justify-between hover:bg-blue-700 text-white ${
              selectedReasons.includes(reason.text)
                ? "bg-blue-600"
                : "bg-blue-900"
            }`}
          >
            <span>
              {reason.emoji} {reason.text}
            </span>
            {selectedReasons.includes(reason.text) && (
              <span className="text-white font-bold">✓</span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <label className="block mb-1 text-sm font-medium text-white">
          Other (optional):
        </label>
        <textarea
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          className="w-full border p-2 rounded text-white bg-blue-800"
          placeholder="Your feedback..."
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
}
