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

const hasApplicationForInterviewAndEmail = async (
  interviewId: string,
  email: string,
) => {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("id")
      .eq("interview_id", interviewId)
      .eq("email", email)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking application existence:", error);

      return false;
    }

    return Boolean(data?.id);
  } catch (err) {
    console.error("Unexpected error checking application existence:", err);

    return false;
  }
};

export const ApplicationsService = {
  createApplication,
  hasApplicationForInterviewAndEmail,
};


