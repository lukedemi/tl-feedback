import { useState } from "react";

export default function AdditionalFeedback({ onFollowupSubmitted, onContactSubmitted }) {
  const [stage, setStage] = useState("questions"); // "questions" then "contact"
  const [responses, setResponses] = useState({
    q1: "",
    q2: "",
    q3: ""
  });
  const [contact, setContact] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);

  const contactOptions = [
    { text: "Interested in giving a talk", emoji: "🎤" },
    { text: "Interested in donating to TL", emoji: "💰" },
    { text: "Volunteering to help at TL meetups", emoji: "🙋" }
  ];

  const toggleInterest = (interestText) => {
    setSelectedInterests((prev) =>
      prev.includes(interestText)
        ? prev.filter((r) => r !== interestText)
        : [...prev, interestText]
    );
  };

  const handleQuestionsSubmit = (e) => {
    e.preventDefault();
    // Pass follow-up answers using separate fields.
    onFollowupSubmitted({
      highlight: responses.q1,
      speakerFeedback: responses.q2,
      improvement: responses.q3
    });
    setStage("contact");
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    onContactSubmitted({
      contact,
      interests: selectedInterests
    });
  };

  return (
    <div>
      {stage === "questions" && (
        <>
          <div className="p-4 bg-green-200 border border-green-400 text-green-800 rounded mb-4 text-center">
            Thanks, that's been saved... want to share more?
          </div>
          <form onSubmit={handleQuestionsSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">
                What was the highlight of the event? (optional)
              </label>
              <input
                type="text"
                value={responses.q1}
                onChange={(e) => setResponses({ ...responses, q1: e.target.value })}
                className="w-full border p-2 rounded text-white bg-gray-700"
                placeholder="Your answer..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">
                Speaker feedback (optional)
              </label>
              <input
                type="text"
                value={responses.q2}
                onChange={(e) => setResponses({ ...responses, q2: e.target.value })}
                className="w-full border p-2 rounded text-white bg-gray-700"
                placeholder="Your answer..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">
                What could be improved for our next meetup? (optional)
              </label>
              <input
                type="text"
                value={responses.q3}
                onChange={(e) => setResponses({ ...responses, q3: e.target.value })}
                className="w-full border p-2 rounded text-white bg-gray-700"
                placeholder="Your answer..."
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Submit
            </button>
          </form>
        </>
      )}
      {stage === "contact" && (
        <>
          <div className="p-4 bg-green-200 border border-green-400 text-green-800 rounded mb-4 text-center">
            Thanks, that's been saved... want to share more?
          </div>
          <form onSubmit={handleContactSubmit} className="mt-8">
            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">
                Would you like to share your email or name? (optional)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full border p-2 rounded text-white bg-gray-700"
                placeholder="Your email or name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-white">
                Select your interests (optional):
              </label>
              <div className="flex flex-col space-y-3">
                {contactOptions.map((option, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => toggleInterest(option.text)}
                    className={`border border-blue-400 rounded py-2 px-4 flex items-center justify-between hover:bg-blue-700 text-white ${
                      selectedInterests.includes(option.text)
                        ? "bg-blue-600"
                        : "bg-blue-900"
                    }`}
                  >
                    <span>
                      {option.emoji} {option.text}
                    </span>
                    {selectedInterests.includes(option.text) && (
                      <span className="text-white font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
}
