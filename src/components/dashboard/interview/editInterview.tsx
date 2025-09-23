"use client";

import { Interview, Question } from "@/types/interview";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus, SaveIcon, TrashIcon } from "lucide-react";
import { useInterviewers } from "@/contexts/interviewers.context";
import QuestionCard from "@/components/dashboard/interview/create-popup/questionCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useInterviews } from "@/contexts/interviews.context";
import { InterviewService } from "@/services/interviews.service";
import { CardTitle } from "../../ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type EditInterviewProps = {
  interview: Interview | undefined;
};

function EditInterview({ interview }: EditInterviewProps) {
  const { interviewers } = useInterviewers();
  const { fetchInterviews } = useInterviews();

  const [description, setDescription] = useState<string>(
    interview?.description || ""
  );
  const [objective, setObjective] = useState<string>(
    interview?.objective || ""
  );
  const [jobDescription, setJobDescription] = useState<string>(
    interview?.jd || ""
  );
  const [numQuestions, setNumQuestions] = useState<number>(
    interview?.question_count || 1
  );
  const [duration, setDuration] = useState<Number>(
    Number(interview?.time_duration)
  );
  const [questions, setQuestions] = useState<Question[]>(
    interview?.questions || []
  );
  const [selectedInterviewer, setSelectedInterviewer] = useState(
    interview?.interviewer_id
  );
  const [isAnonymous, setIsAnonymous] = useState<boolean>(
    interview?.is_anonymous || false
  );

  const [isClicked, setIsClicked] = useState(false);

  const endOfListRef = useRef<HTMLDivElement>(null);
  const prevQuestionLengthRef = useRef(questions.length);
  const router = useRouter();

  // Index is 1 for up or -1 for down
  const onSwapQuestionPos = (questionId: string, index: 1 | -1) => {
    const qIndex = questions.findIndex((q) => q.id === questionId);

    if (qIndex === -1) {
      return;
    }

    const targetIndex = qIndex + index;

    if (targetIndex < 0 || targetIndex >= questions.length) {
      return;
    }

    if (index === 1) {
      setQuestions([
        ...questions.slice(0, qIndex),
        questions[targetIndex],
        questions[qIndex],
        ...questions.slice(targetIndex + 1),
      ]);
    } else {
      setQuestions([
        ...questions.slice(0, targetIndex),
        questions[qIndex],
        questions[targetIndex],
        ...questions.slice(qIndex + 1),
      ]);
    }
  };

  const handleInputChange = (id: string, newQuestion: Question) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, ...newQuestion } : question
      )
    );
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length === 1) {
      setQuestions(
        questions.map((question) => ({
          ...question,
          question: "",
          follow_up_count: 1,
        }))
      );

      return;
    }
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const handleAddQuestion = () => {
    if (questions.length < numQuestions) {
      setQuestions([
        ...questions,
        { id: uuidv4(), question: "", follow_up_count: 1 },
      ]);
    }
  };

  const onSave = async () => {
    const questionCount =
      questions.length < numQuestions ? questions.length : numQuestions;

    const interviewData = {
      objective: objective,
      questions: questions,
      interviewer_id: Number(selectedInterviewer),
      question_count: questionCount,
      time_duration: Number(duration),
      description: description,
      is_anonymous: isAnonymous,
      jd: jobDescription,
    };

    try {
      if (!interview) {
        return;
      }
      const response = await InterviewService.updateInterview(
        interviewData,
        interview?.id
      );
      setIsClicked(false);
      fetchInterviews();
      toast.success("Interview updated successfully.", {
        position: "bottom-right",
        duration: 3000,
      });
      router.push(`/interviews/${interview?.id}`);
    } catch (error) {
      console.error("Error creating interview:", error);
    }
  };

  const onDeleteInterviewClick = async () => {
    if (!interview) {
      return;
    }

    try {
      await InterviewService.deleteInterview(interview.id);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete the interview.", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (questions.length > prevQuestionLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevQuestionLengthRef.current = questions.length;
  }, [questions.length]);
  console.log(questions.length, numQuestions);

  return (
    <div className="h-screen z-[10] mx-4">
      <div className="flex flex-col bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl min-h-[120px] p-6 border border-orange-200 shadow-xl">
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:cursor-pointer transition-colors duration-200 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200"
            onClick={() => {
              router.push(`/interviews/${interview?.id}`);
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <p className="text-sm font-semibold">Back to Summary</p>
          </div>
        </div>
        <div className="flex flex-row justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-800">
              Interview Description
            </h2>
            <p className="text-sm text-gray-600">
              Your respondents will see this description
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button
              disabled={isClicked}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => {
                setIsClicked(true);
                onSave();
              }}
            >
              Save <SaveIcon size={16} className="ml-2" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  disabled={isClicked}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <TrashIcon size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this interview.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={async () => {
                      await onDeleteInterviewClick();
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-orange-100">
          <textarea
            value={description}
            className="w-full py-3 px-4 border-2 rounded-xl border-gray-300 focus:border-orange-500 focus:outline-none transition-colors duration-200 bg-white/50"
            placeholder="Enter your interview description here..."
            rows={3}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            onBlur={(e) => {
              setDescription(e.target.value.trim());
            }}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Job Description
          </h3>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100">
            <textarea
              value={jobDescription}
              className="w-full py-3 px-4 border-2 rounded-xl border-gray-300 focus:border-orange-500 focus:outline-none transition-colors duration-200 bg-white/50"
              placeholder="Describe the daily duties and key objectives for this role"
              rows={3}
              onChange={(e) => setJobDescription(e.target.value)}
              onBlur={(e) => setJobDescription(e.target.value.trim())}
            />
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Objective
          </h3>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100">
            <textarea
              value={objective}
              className="w-full py-3 px-4 border-2 rounded-xl border-gray-300 focus:border-orange-500 focus:outline-none transition-colors duration-200 bg-white/50"
              placeholder="Enter your interview objective here..."
              rows={3}
              onChange={(e) => setObjective(e.target.value)}
              onBlur={(e) => setObjective(e.target.value.trim())}
            />
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Select Interviewer
          </h3>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100">
            <div className="flex items-center">
              <div
                id="slider-3"
                className="h-32 pt-1 overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide w-full"
              >
                {interviewers.map((item) => (
                  <div
                    className="p-0 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden"
                    key={item.id}
                  >
                    <div
                      className={`w-[96px] overflow-hidden rounded-full transition-all duration-200 ${
                        selectedInterviewer === item.id
                          ? "border-4 border-orange-500 shadow-lg scale-105"
                          : "border-2 border-gray-200 hover:border-orange-300"
                      }`}
                      onClick={() => {
                        setSelectedInterviewer(item.id);
                      }}
                    >
                      <Image
                        src={item.image}
                        alt="Picture of the interviewer"
                        width={70}
                        height={70}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="mt-2 text-xs text-center font-medium text-gray-700">
                      {item.name}
                    </CardTitle>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-800">
                  Anonymous Responses
                </span>
                <span className="text-xs text-gray-600">
                  If not anonymous, the interviewee&lsquo;s email and name will
                  be collected
                </span>
              </div>
              <Switch
                checked={isAnonymous}
                className={`${isAnonymous ? "bg-orange-500" : "bg-gray-300"}`}
                onCheckedChange={(checked) => setIsAnonymous(checked)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Number of Questions
            </h3>
            <input
              type="number"
              step="1"
              max="15"
              min={questions.length.toString()}
              className="w-full text-center focus:outline-none bg-orange-50/50 rounded-xl border-2 border-gray-300 focus:border-orange-500 px-4 py-3 transition-colors duration-200"
              value={numQuestions}
              onChange={(e) => {
                let value = e.target.value;
                if (
                  value === "" ||
                  (Number.isInteger(Number(value)) && Number(value) > 0)
                ) {
                  if (Number(value) > 15) {
                    value = "15";
                  }
                  setNumQuestions(Number(value));
                }
              }}
            />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-orange-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Duration (minutes)
            </h3>
            <input
              type="number"
              step="1"
              max="60"
              min="1"
              className="w-full text-center focus:outline-none bg-orange-50/50 rounded-xl border-2 border-gray-300 focus:border-orange-500 px-4 py-3 transition-colors duration-200"
              value={Number(duration)}
              onChange={(e) => {
                let value = e.target.value;
                if (
                  value === "" ||
                  (Number.isInteger(Number(value)) && Number(value) > 0)
                ) {
                  if (Number(value) > 60) {
                    value = "60";
                  }
                  setDuration(Number(value));
                }
              }}
            />
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Questions
          </h3>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
            <ScrollArea className="max-h-[500px] overflow-auto">
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    questionNumber={index + 1}
                    questionData={question}
                    onDelete={handleDeleteQuestion}
                    onQuestionChange={handleInputChange}
                    onSwapUp={() => onSwapQuestionPos(question.id, -1)}
                    onSwapDown={() => onSwapQuestionPos(question.id, 1)}
                  />
                ))}
                <div ref={endOfListRef} />
                {questions.length < numQuestions ? (
                  <div
                    className="flex items-center justify-center p-6 border-2 border-dashed border-orange-300 rounded-2xl hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 cursor-pointer"
                    onClick={handleAddQuestion}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <Plus
                          size={24}
                          strokeWidth={2.2}
                          className="text-orange-600"
                        />
                      </div>
                      <span className="text-sm font-medium text-orange-600">
                        Add Question
                      </span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditInterview;
