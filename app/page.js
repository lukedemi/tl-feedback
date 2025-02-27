"use client";
import { useState, useEffect } from "react";
import RatingFeedback from "../components/RatingFeedback";
import ReasonSelection from "../components/ReasonSelection";
import AdditionalFeedback from "../components/AdditionalFeedback";
import useUserId from "../hooks/useUserId";

export default function Home() {
  const userId = useUserId();
  const [stage, setStage] = useState("rating"); // "rating", "reason", "additional", "thankyou"
  const [feedback, setFeedback] = useState({
    userId: "",
    rating: "",
    reasons: [],
    customReason: "",
    highlight: "",
    speakerFeedback: "",
    improvement: "",
    contact: "",
    interests: [],
    recordId: "",
  });

  // Update feedback with userId once available.
  useEffect(() => {
    if (userId) {
      setFeedback((prev) => ({ ...prev, userId }));
    }
  }, [userId]);

  // Submit the entire feedback object to the backend.
  const submitFeedback = async (currentFeedback) => {
    const queryString = window.location.search; // gets ?utm_source=... etc.
    const res = await fetch("/api/feedback" + queryString, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentFeedback),
    });
    const json = await res.json();
    if (json.success && json.recordId) {
      return json.recordId;
    }
    return null;
  };

  const handleRatingSelected = (rating) => {
    const newFeedback = { ...feedback, rating };
    setFeedback(newFeedback);
    // Fire-and-forget: submit feedback without delaying UI transition.
    submitFeedback(newFeedback)
      .then((recordId) => {
        if (recordId) {
          setFeedback((prev) => ({ ...prev, recordId }));
        }
      })
      .catch((error) => {
        console.error("Feedback submission failed", error);
      });
    // Immediately move to the next stage.
    setStage("reason");
  };

  const handleReasonsSubmitted = ({ selectedReasons, customReason }) => {
    const newFeedback = { ...feedback, reasons: selectedReasons, customReason };
    setFeedback(newFeedback);
    // Fire-and-forget the submission.
    submitFeedback(newFeedback)
      .then((recordId) => {
        if (recordId) {
          setFeedback((prev) => ({ ...prev, recordId }));
        }
      })
      .catch((error) => {
        console.error("Feedback submission failed", error);
      });
    setStage("additional");
  };

  const handleFollowupSubmitted = (data) => {
    // Data now contains three separate fields.
    const newFeedback = {
      ...feedback,
      highlight: data.highlight,
      speakerFeedback: data.speakerFeedback,
      improvement: data.improvement,
    };
    setFeedback(newFeedback);
    // Fire-and-forget the submission.
    submitFeedback(newFeedback)
      .then((recordId) => {
        if (recordId) {
          setFeedback((prev) => ({ ...prev, recordId }));
        }
      })
      .catch((error) => {
        console.error("Feedback submission failed", error);
      });
    // Remain in "additional" stage until contact info is submitted.
  };

  const handleContactSubmitted = ({ contact, interests }) => {
    const newFeedback = { ...feedback, contact, interests };
    setFeedback(newFeedback);
    // Fire-and-forget the submission.
    submitFeedback(newFeedback)
      .then((recordId) => {
        if (recordId) {
          setFeedback((prev) => ({ ...prev, recordId }));
        }
      })
      .catch((error) => {
        console.error("Feedback submission failed", error);
      });
    setStage("thankyou");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded p-6 relative">
        {stage === "rating" && (
          <RatingFeedback onRatingSelected={handleRatingSelected} />
        )}
        {stage === "reason" && feedback.rating && (
          <ReasonSelection
            rating={feedback.rating}
            onReasonsSubmitted={handleReasonsSubmitted}
          />
        )}
        {stage === "additional" && (
          <AdditionalFeedback
            onFollowupSubmitted={handleFollowupSubmitted}
            onContactSubmitted={handleContactSubmitted}
          />
        )}
        {stage === "thankyou" && (
          <div className="p-8 bg-green-200 border border-green-400 text-green-800 rounded text-center z-10">
            <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
            <p>We appreciate your feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
}
