import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export interface ApplicationInsertPayload {
  full_name: string;
  email: string;
  phone: string;
  job_position: string;
  interview_id: string;
  cover_letter?: string;
  resume_url: string;
  parsed_resume: any;
  analyzed_resume: any;
  resume_score: number;
}

const createApplication = async (payload: ApplicationInsertPayload) => {
  const { data, error } = await supabase
    .from("applications")
    .insert({ ...payload })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating application:", error);

    return null;
  }

  return data?.id as number | null;
};

export const ApplicationsService = {
  createApplication,
};


