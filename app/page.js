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
    const res = await fetch("/api/feedback", {
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
    // Submit feedback asynchronously – fire-and-forget.
    submitFeedback(newFeedback)
      .then((recordId) => {
        if (recordId) {
          setFeedback((prev) => ({ ...prev, recordId }));
        }
      })
      .catch((error) => {
        // Show a toast notification for error
        showToast("Feedback submission failed");
      });
    // Immediately go to the next stage.
    setStage("reason");
  };
  

  const handleReasonsSubmitted = async ({ selectedReasons, customReason }) => {
    const newFeedback = { ...feedback, reasons: selectedReasons, customReason };
    setFeedback(newFeedback);
    const recordId = await submitFeedback(newFeedback);
    if (recordId) {
      setFeedback((prev) => ({ ...prev, recordId }));
    }
    setStage("additional");
  };

  const handleFollowupSubmitted = async (data) => {
    // Data now contains three separate fields.
    const newFeedback = {
      ...feedback,
      highlight: data.highlight,
      speakerFeedback: data.speakerFeedback,
      improvement: data.improvement,
    };
    setFeedback(newFeedback);
    const recordId = await submitFeedback(newFeedback);
    if (recordId) {
      setFeedback((prev) => ({ ...prev, recordId }));
    }
    // Remain in "additional" stage until contact info is submitted.
  };

  const handleContactSubmitted = async ({ contact, interests }) => {
    const newFeedback = { ...feedback, contact, interests };
    setFeedback(newFeedback);
    const recordId = await submitFeedback(newFeedback);
    if (recordId) {
      setFeedback((prev) => ({ ...prev, recordId }));
    }
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
