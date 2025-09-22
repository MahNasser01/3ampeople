"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";
import Modal from "@/components/dashboard/Modal";

function CreateInterviewCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="flex items-center border-dashed border-orange-300 border-2 cursor-pointer hover:scale-105 hover:border-orange-400 hover:bg-orange-50/50 ease-in-out duration-300 h-60 w-56 ml-1 mr-3 mt-4 rounded-xl shrink-0 overflow-hidden shadow-lg hover:shadow-xl transition-all"
        onClick={() => {
          setOpen(true);
        }}
      >
        <CardContent className="flex items-center flex-col mx-auto p-6">
          <div className="flex flex-col justify-center items-center w-full overflow-hidden mb-4">
            <div className="p-4 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors duration-200">
              <Plus size={60} strokeWidth={1.5} className="text-orange-600" />
            </div>
          </div>
          <CardTitle className="p-0 text-lg text-center font-semibold text-gray-800">
            Create an Interview
          </CardTitle>
          <p className="text-sm text-gray-500 text-center mt-2">
            Start a new interview session
          </p>
        </CardContent>
      </Card>
      <Modal
        open={open}
        closeOnOutsideClick={false}
        onClose={() => {
          setOpen(false);
        }}
      >
        <CreateInterviewModal open={open} setOpen={setOpen} />
      </Modal>
    </>
  );
}

export default CreateInterviewCard;
