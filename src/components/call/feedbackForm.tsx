import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackData } from "@/types/response";

enum SatisfactionLevel {
  Positive = "😀",
  Moderate = "😐",
  Negative = "😔",
}

interface FeedbackFormProps {
  onSubmit: (data: Omit<FeedbackData, "interview_id">) => void;
  email: string;
}

export function FeedbackForm({ onSubmit, email }: FeedbackFormProps) {
  const [satisfaction, setSatisfaction] = useState<SatisfactionLevel>(
    SatisfactionLevel.Moderate,
  );
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (satisfaction !== null || feedback.trim() !== "") {
      onSubmit({
        satisfaction: Object.values(SatisfactionLevel).indexOf(satisfaction),
        feedback,
        email,
      });
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800">
        Are you satisfied with the platform?
      </h3>
      <div className="flex justify-center space-x-6 mb-6">
        {Object.values(SatisfactionLevel).map((emoji) => (
          <button
            key={emoji}
            className={`text-4xl p-3 rounded-full transition-all duration-200 hover:scale-110 ${
              satisfaction === emoji 
                ? "border-4 border-orange-500 bg-orange-50 shadow-lg" 
                : "border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
            }`}
            onClick={() => setSatisfaction(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      <Textarea
        value={feedback}
        placeholder="Add your feedback here"
        className="mb-6 border-gray-300 focus:border-orange-500 transition-colors duration-200 bg-orange-50/30"
        onChange={(e) => setFeedback(e.target.value)}
      />
      <Button
        disabled={satisfaction === null && feedback.trim() === ""}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
        onClick={handleSubmit}
      >
        Submit Feedback
      </Button>
    </div>
  );
}
