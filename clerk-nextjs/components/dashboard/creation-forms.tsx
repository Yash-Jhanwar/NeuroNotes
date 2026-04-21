import { FormEvent } from 'react';

type CreationFormsProps = {
  isSaving: boolean;
  hasSemester: boolean;
  hasSubject: boolean;
  hasUnit: boolean;
  hasTopic: boolean;
  semesterNumber: string;
  setSemesterNumber: (value: string) => void;
  subjectName: string;
  setSubjectName: (value: string) => void;
  unitNumber: string;
  setUnitNumber: (value: string) => void;
  unitTitle: string;
  setUnitTitle: (value: string) => void;
  topicTitle: string;
  setTopicTitle: (value: string) => void;
  noteTitle: string;
  setNoteTitle: (value: string) => void;
  noteContent: string;
  setNoteContent: (value: string) => void;
  resourceTitle: string;
  setResourceTitle: (value: string) => void;
  resourceType: string;
  setResourceType: (value: string) => void;
  resourceUrl: string;
  setResourceUrl: (value: string) => void;
  onCreateSemester: (event: FormEvent<HTMLFormElement>) => void;
  onCreateSubject: (event: FormEvent<HTMLFormElement>) => void;
  onCreateUnit: (event: FormEvent<HTMLFormElement>) => void;
  onCreateTopic: (event: FormEvent<HTMLFormElement>) => void;
  onCreateNote: (event: FormEvent<HTMLFormElement>) => void;
  onCreateResource: (event: FormEvent<HTMLFormElement>) => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:bg-white"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-[110px] w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:bg-white"
    />
  );
}

function SubmitButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function FormCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-black/5 bg-white/90 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function CreationForms(props: CreationFormsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-6 md:grid-cols-2">
        <FormCard title="Add Semester" subtitle="Start a new academic block.">
          <form className="space-y-4" onSubmit={props.onCreateSemester}>
            <Field label="Semester Number">
              <TextInput type="number" min="1" value={props.semesterNumber} onChange={(event) => props.setSemesterNumber(event.target.value)} />
            </Field>
            <SubmitButton disabled={props.isSaving}>Add Semester</SubmitButton>
          </form>
        </FormCard>

        <FormCard title="Add Subject" subtitle="Works on the selected semester.">
          <form className="space-y-4" onSubmit={props.onCreateSubject}>
            <Field label="Subject Name">
              <TextInput value={props.subjectName} onChange={(event) => props.setSubjectName(event.target.value)} placeholder="Example: Data Structures" />
            </Field>
            <SubmitButton disabled={props.isSaving || !props.hasSemester}>Add Subject</SubmitButton>
          </form>
        </FormCard>

        <FormCard title="Add Unit" subtitle="Works on the selected subject.">
          <form className="space-y-4" onSubmit={props.onCreateUnit}>
            <Field label="Unit Number">
              <TextInput type="number" min="1" value={props.unitNumber} onChange={(event) => props.setUnitNumber(event.target.value)} />
            </Field>
            <Field label="Unit Title">
              <TextInput value={props.unitTitle} onChange={(event) => props.setUnitTitle(event.target.value)} placeholder="Example: Trees and Graphs" />
            </Field>
            <SubmitButton disabled={props.isSaving || !props.hasSubject}>Add Unit</SubmitButton>
          </form>
        </FormCard>

        <FormCard title="Add Topic" subtitle="Works on the selected unit.">
          <form className="space-y-4" onSubmit={props.onCreateTopic}>
            <Field label="Topic Title">
              <TextInput value={props.topicTitle} onChange={(event) => props.setTopicTitle(event.target.value)} placeholder="Example: Binary Trees" />
            </Field>
            <SubmitButton disabled={props.isSaving || !props.hasUnit}>Add Topic</SubmitButton>
          </form>
        </FormCard>
      </div>

      <div className="grid gap-6">
        <FormCard title="Add Note" subtitle="Works on the selected topic.">
          <form className="space-y-4" onSubmit={props.onCreateNote}>
            <Field label="Note Title">
              <TextInput value={props.noteTitle} onChange={(event) => props.setNoteTitle(event.target.value)} placeholder="Example: Key formulas" />
            </Field>
            <Field label="Content">
              <TextArea value={props.noteContent} onChange={(event) => props.setNoteContent(event.target.value)} placeholder="Write the note content here..." />
            </Field>
            <SubmitButton disabled={props.isSaving || !props.hasTopic}>Add Note</SubmitButton>
          </form>
        </FormCard>

        <FormCard title="Add Resource" subtitle="Works on the selected topic.">
          <form className="space-y-4" onSubmit={props.onCreateResource}>
            <Field label="Title">
              <TextInput value={props.resourceTitle} onChange={(event) => props.setResourceTitle(event.target.value)} placeholder="Example: Lecture playlist" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type">
                <TextInput value={props.resourceType} onChange={(event) => props.setResourceType(event.target.value)} placeholder="PDF, Video, Link" />
              </Field>
              <Field label="URL">
                <TextInput value={props.resourceUrl} onChange={(event) => props.setResourceUrl(event.target.value)} placeholder="https://..." />
              </Field>
            </div>
            <SubmitButton disabled={props.isSaving || !props.hasTopic}>Add Resource</SubmitButton>
          </form>
        </FormCard>
      </div>
    </div>
  );
}
