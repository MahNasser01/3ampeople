"use client";

import { Interview } from "@/types/interview";
import { Interviewer } from "@/types/interviewer";
import { Response } from "@/types/response";
import React, { useEffect, useState } from "react";
import { UserCircleIcon, SmileIcon, Info } from "lucide-react";
import { useInterviewers } from "@/contexts/interviewers.context";
import { PieChart } from "@mui/x-charts/PieChart";
import { CandidateStatus } from "@/lib/enum";
import { convertSecondstoMMSS } from "@/lib/utils";
import Image from "next/image";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import DataTable, {
  TableData,
} from "@/components/dashboard/interview/dataTable";
import { ScrollArea } from "@/components/ui/scroll-area";

type SummaryProps = {
  responses: Response[];
  interview: Interview | undefined;
};

function InfoTooltip({ content }: { content: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info
            className="h-2 w-2 text-orange-500 inline-block ml-0 align-super font-bold"
            strokeWidth={2.5}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-gray-500 text-white font-normal">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SummaryInfo({ responses, interview }: SummaryProps) {
  const { interviewers } = useInterviewers();
  const [interviewer, setInterviewer] = useState<Interviewer>();
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [completedInterviews, setCompletedInterviews] = useState<number>(0);
  const [sentimentCount, setSentimentCount] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [callCompletion, setCallCompletion] = useState({
    complete: 0,
    incomplete: 0,
    partial: 0,
  });

  const totalResponses = responses.length;

  const [candidateStatusCount, setCandidateStatusCount] = useState({
    [CandidateStatus.NO_STATUS]: 0,
    [CandidateStatus.NOT_SELECTED]: 0,
    [CandidateStatus.POTENTIAL]: 0,
    [CandidateStatus.SELECTED]: 0,
  });

  const [tableData, setTableData] = useState<TableData[]>([]);

  const prepareTableData = (responses: Response[]): TableData[] => {
    return responses.map((response) => ({
      call_id: response.call_id,
      name: response.name || "Anonymous",
      overallScore: response.analytics?.overallScore || 0,
      communicationScore: response.analytics?.communication?.score || 0,
      callSummary:
        response.analytics?.softSkillSummary ||
        response.details?.call_analysis?.call_summary ||
        "No summary available",
    }));
  };

  useEffect(() => {
    if (!interviewers || !interview) {
      return;
    }
    const interviewer = interviewers.find(
      (interviewer) => interviewer.id === interview.interviewer_id,
    );
    setInterviewer(interviewer);
  }, [interviewers, interview]);

  useEffect(() => {
    if (!responses) {
      return;
    }

    const sentimentCounter = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    const callCompletionCounter = {
      complete: 0,
      incomplete: 0,
      partial: 0,
    };

    let totalDuration = 0;
    let completedCount = 0;

    const statusCounter = {
      [CandidateStatus.NO_STATUS]: 0,
      [CandidateStatus.NOT_SELECTED]: 0,
      [CandidateStatus.POTENTIAL]: 0,
      [CandidateStatus.SELECTED]: 0,
    };

    responses.forEach((response) => {
      const sentiment = response.details?.call_analysis?.user_sentiment;
      if (sentiment === "Positive") {
        sentimentCounter.positive += 1;
      } else if (sentiment === "Negative") {
        sentimentCounter.negative += 1;
      } else if (sentiment === "Neutral") {
        sentimentCounter.neutral += 1;
      }

      const callCompletion =
        response.details?.call_analysis?.call_completion_rating;
      if (callCompletion === "Complete") {
        callCompletionCounter.complete += 1;
      } else if (callCompletion === "Incomplete") {
        callCompletionCounter.incomplete += 1;
      } else if (callCompletion === "Partial") {
        callCompletionCounter.partial += 1;
      }

      const agentTaskCompletion =
        response.details?.call_analysis?.agent_task_completion_rating;
      if (
        agentTaskCompletion === "Complete" ||
        agentTaskCompletion === "Partial"
      ) {
        completedCount += 1;
      }

      totalDuration += response.duration;
      if (
        Object.values(CandidateStatus).includes(
          response.candidate_status as CandidateStatus,
        )
      ) {
        statusCounter[response.candidate_status as CandidateStatus]++;
      }
    });

    setSentimentCount(sentimentCounter);
    setCallCompletion(callCompletionCounter);
    setTotalDuration(totalDuration);
    setCompletedInterviews(completedCount);
    setCandidateStatusCount(statusCounter);

    const preparedData = prepareTableData(responses);
    setTableData(preparedData);
  }, [responses]);

  return (
    <div className="h-screen z-[10] mx-4">
      {responses.length > 0 ? (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl min-h-[120px] p-6 border border-orange-200 shadow-xl">
          <div className="flex flex-row gap-4 justify-between items-center mb-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-gray-800">Overall Analysis</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-300">
                {interviewer?.image && (
                  <Image
                    src={interviewer.image}
                    alt={interviewer.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Interviewer</p>
                <p className="text-sm font-semibold text-gray-800">{interviewer?.name}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-orange-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-800">Interview Description:</span>{" "}
              {interview?.description}
            </p>
          </div>
          <div className="flex flex-col gap-1 my-2 mt-4 mx-2 p-6 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg border border-orange-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Response Data</h3>
            </div>
            <ScrollArea className="h-[250px]">
              <DataTable data={tableData} interviewId={interview?.id || ""} />
            </ScrollArea>
          </div>
          <div className="flex flex-row gap-6 my-2 justify-center">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 my-2 mt-4 mx-2 p-6 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg max-w-[400px] border border-orange-100">
                <div className="flex flex-row items-center justify-center gap-2 font-semibold mb-2 text-[16px] text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-sm">⏱️</span>
                  </div>
                  Average Duration
                  <InfoTooltip content="Average time users took to complete an interview" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl shadow-md">
                    <p className="text-2xl font-bold">
                      {convertSecondstoMMSS(totalDuration / responses.length)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 mx-2 p-6 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg max-w-[360px] border border-orange-100">
                <div className="flex flex-row gap-2 font-semibold mb-2 text-[16px] mx-auto text-center text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-sm">📊</span>
                  </div>
                  Interview Completion Rate
                  <InfoTooltip content="Percentage of interviews completed successfully" />
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl shadow-md">
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (completedInterviews / responses.length) * 10000,
                    ) / 100}
                    %
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 my-2 mt-4 mx-2 p-6 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg max-w-[360px] border border-orange-100">
              <div className="flex flex-row gap-3 text-[16px] font-bold mb-4 mx-auto items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <SmileIcon className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-gray-700">Candidate Sentiment</span>
                <InfoTooltip content="Distribution of user sentiments during interviews" />
              </div>
              <PieChart
                sx={{
                  "& .MuiChartsLegend-series text": {
                    fontSize: "0.8rem !important",
                  },
                }}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: sentimentCount.positive,
                        label: `Positive (${sentimentCount.positive})`,
                        color: "#22c55e",
                      },
                      {
                        id: 1,
                        value: sentimentCount.neutral,
                        label: `Neutral (${sentimentCount.neutral})`,
                        color: "#eab308",
                      },
                      {
                        id: 2,
                        value: sentimentCount.negative,
                        label: `Negative (${sentimentCount.negative})`,
                        color: "#eb4444",
                      },
                    ],
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 10,
                      additionalRadius: -10,
                      color: "gray",
                    },
                  },
                ]}
                width={360}
                height={120}
              />
            </div>
            <div className="flex flex-col gap-3 my-2 mt-4 mx-2 p-6 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg border border-orange-100">
              <div className="flex flex-row gap-3 text-[16px] font-bold mx-auto mb-2 items-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <UserCircleIcon className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-gray-700">Candidate Status</span>
                <InfoTooltip content="Breakdown of the candidate selection status" />
              </div>
              <div className="text-center mb-3">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Total Responses: {totalResponses}
                </div>
              </div>
              <PieChart
                sx={{
                  "& .MuiChartsLegend-series text": {
                    fontSize: "0.8rem !important",
                  },
                }}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: candidateStatusCount[CandidateStatus.SELECTED],
                        label: `Selected (${candidateStatusCount[CandidateStatus.SELECTED]})`,
                        color: "#22c55e",
                      },
                      {
                        id: 1,
                        value: candidateStatusCount[CandidateStatus.POTENTIAL],
                        label: `Potential (${candidateStatusCount[CandidateStatus.POTENTIAL]})`,
                        color: "#eab308",
                      },
                      {
                        id: 2,
                        value:
                          candidateStatusCount[CandidateStatus.NOT_SELECTED],
                        label: `Not Selected (${candidateStatusCount[CandidateStatus.NOT_SELECTED]})`,
                        color: "#eb4444",
                      },
                      {
                        id: 3,
                        value: candidateStatusCount[CandidateStatus.NO_STATUS],
                        label: `No Status (${candidateStatusCount[CandidateStatus.NO_STATUS]})`,
                        color: "#9ca3af",
                      },
                    ],
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 10,
                      additionalRadius: -10,
                      color: "gray",
                    },
                  },
                ]}
                width={360}
                height={120}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    padding: 0,
                    itemMarkWidth: 10,
                    itemMarkHeight: 10,
                    markGap: 5,
                    itemGap: 5,
                  },
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[85%] h-[60%] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-xl opacity-20"></div>
              <Image
                src="/no-responses.png"
                alt="logo"
                width={270}
                height={270}
                className="relative z-10"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">No Responses Yet</h3>
              <p className="text-gray-600 max-w-md">
                Share your interview link with intended respondents to start collecting responses and insights.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryInfo;
