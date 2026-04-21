export type Topic = {
  id: string;
  unit_id: string;
  title: string;
  is_important: boolean;
  created_at: string;
};

export type Unit = {
  id: string;
  subject_id: string;
  unit_number: number;
  title: string;
  created_at: string;
  topics: Topic[];
};

export type Subject = {
  id: string;
  semester_id: string;
  name: string;
  created_at: string;
  units: Unit[];
};

export type Semester = {
  id: string;
  semester_number: number;
  created_at: string;
  subjects: Subject[];
};

export type Note = {
  id: string;
  topic_id: string;
  title: string;
  content: string;
  created_at: string;
};

export type Resource = {
  id: string;
  topic_id: string;
  title: string;
  url: string;
  type: string;
  created_at: string;
};

export type AiSuggestion = {
  id: string;
  context_type: string;
  context_text: string;
  important_topics: string[];
  study_prompt: string;
  created_at: string;
};

export type SelectionState = {
  semesterId?: string;
  subjectId?: string;
  unitId?: string;
  topicId?: string;
};
