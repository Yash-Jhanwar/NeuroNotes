'use client';

import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react';
import CreationForms from '@/components/dashboard/creation-forms';
import HierarchyTree from '@/components/dashboard/hierarchy-tree';
import TopicPanels from '@/components/dashboard/topic-panels';
import { AiSuggestion, Note, Resource, SelectionState, Semester, Topic } from '@/components/dashboard/types';
import { useApiClient } from '@/hooks/use-api-client';

type DashboardWorkspaceProps = {
  firstName?: string | null;
  primaryEmail?: string | null;
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  ) {
    const responseData = error.response.data as { error?: { message?: string }; message?: string };
    return responseData.error?.message || responseData.message || 'Something went wrong.';
  }

  return error instanceof Error ? error.message : 'Something went wrong.';
};

const deriveSelection = (syllabus: Semester[], desired: SelectionState) => {
  const semester = syllabus.find((item) => item.id === desired.semesterId) || syllabus[0];
  const subject = semester?.subjects.find((item) => item.id === desired.subjectId) || semester?.subjects[0];
  const unit = subject?.units.find((item) => item.id === desired.unitId) || subject?.units[0];
  const topic = unit?.topics.find((item) => item.id === desired.topicId) || unit?.topics[0];

  return { semesterId: semester?.id, subjectId: subject?.id, unitId: unit?.id, topicId: topic?.id };
};

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-black/5 bg-white/90 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
  tone = 'primary',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  tone?: 'primary' | 'secondary';
}) {
  const className =
    tone === 'primary'
      ? 'bg-[var(--accent)] text-white hover:opacity-90'
      : 'border border-black/10 bg-white text-slate-700 hover:border-black/20';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export default function DashboardWorkspace({ firstName, primaryEmail }: DashboardWorkspaceProps) {
  const api = useApiClient();
  const [isSaving, startTransition] = useTransition();
  const [syllabus, setSyllabus] = useState<Semester[]>([]);
  const [selection, setSelection] = useState<SelectionState>({});
  const [loadingTree, setLoadingTree] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notesByTopic, setNotesByTopic] = useState<Record<string, Note[]>>({});
  const [resourcesByTopic, setResourcesByTopic] = useState<Record<string, Resource[]>>({});
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [semesterNumber, setSemesterNumber] = useState('1');
  const [subjectName, setSubjectName] = useState('');
  const [unitNumber, setUnitNumber] = useState('1');
  const [unitTitle, setUnitTitle] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');

  const selectedSemester = useMemo(() => syllabus.find((item) => item.id === selection.semesterId), [selection.semesterId, syllabus]);
  const selectedSubject = useMemo(() => selectedSemester?.subjects.find((item) => item.id === selection.subjectId), [selectedSemester, selection.subjectId]);
  const selectedUnit = useMemo(() => selectedSubject?.units.find((item) => item.id === selection.unitId), [selectedSubject, selection.unitId]);
  const selectedTopic = useMemo(() => selectedUnit?.topics.find((item) => item.id === selection.topicId), [selectedUnit, selection.topicId]);
  const notes = selectedTopic ? notesByTopic[selectedTopic.id] || [] : [];
  const resources = selectedTopic ? resourcesByTopic[selectedTopic.id] || [] : [];

  const refreshSyllabus = async (nextSelection?: SelectionState) => {
    const response = await api.get('/syllabus');
    const nextSyllabus = response.data.data as Semester[];
    setSyllabus(nextSyllabus);
    setSelection((current) => deriveSelection(nextSyllabus, { ...current, ...nextSelection }));
  };

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoadingTree(true);
        setPageError(null);
        const response = await api.get('/syllabus');
        const nextSyllabus = response.data.data as Semester[];
        if (!active) return;
        setSyllabus(nextSyllabus);
        setSelection((current) => deriveSelection(nextSyllabus, current));
      } catch (error) {
        if (active) setPageError(getErrorMessage(error));
      } finally {
        if (active) setLoadingTree(false);
      }
    };

    loadDashboard();
    return () => {
      active = false;
    };
  }, [api]);

  useEffect(() => {
    if (!selectedTopic || (notesByTopic[selectedTopic.id] && resourcesByTopic[selectedTopic.id])) return;

    let active = true;

    const loadTopicDetails = async () => {
      try {
        setDetailsLoading(true);
        const [notesResponse, resourcesResponse] = await Promise.all([
          api.get(`/notes/${selectedTopic.id}`),
          api.get(`/resources/${selectedTopic.id}`),
        ]);
        if (!active) return;
        setNotesByTopic((current) => ({ ...current, [selectedTopic.id]: notesResponse.data.data as Note[] }));
        setResourcesByTopic((current) => ({ ...current, [selectedTopic.id]: resourcesResponse.data.data as Resource[] }));
      } catch (error) {
        if (active) setPageError(getErrorMessage(error));
      } finally {
        if (active) setDetailsLoading(false);
      }
    };

    loadTopicDetails();
    return () => {
      active = false;
    };
  }, [api, notesByTopic, resourcesByTopic, selectedTopic]);

  const runAction = (action: () => Promise<void>) => {
    startTransition(async () => {
      try {
        setPageError(null);
        setSuccessMessage(null);
        await action();
      } catch (error) {
        setPageError(getErrorMessage(error));
      }
    });
  };

  const handleCreateSemester = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runAction(async () => {
      const response = await api.post('/semesters', { semester_number: Number(semesterNumber) });
      await refreshSyllabus({ semesterId: response.data.data.id, subjectId: undefined, unitId: undefined, topicId: undefined });
      setSemesterNumber(String(Number(semesterNumber) + 1));
      setSuccessMessage('Semester added successfully.');
    });
  };

  const handleCreateSubject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSemester) return setPageError('Select a semester before adding a subject.');
    runAction(async () => {
      const response = await api.post('/subjects', { semester_id: selectedSemester.id, name: subjectName });
      await refreshSyllabus({ semesterId: selectedSemester.id, subjectId: response.data.data.id, unitId: undefined, topicId: undefined });
      setSubjectName('');
      setSuccessMessage('Subject added successfully.');
    });
  };

  const handleCreateUnit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSubject) return setPageError('Select a subject before adding a unit.');
    runAction(async () => {
      const response = await api.post('/units', { subject_id: selectedSubject.id, unit_number: Number(unitNumber), title: unitTitle });
      await refreshSyllabus({ semesterId: selectedSemester?.id, subjectId: selectedSubject.id, unitId: response.data.data.id, topicId: undefined });
      setUnitNumber(String(Number(unitNumber) + 1));
      setUnitTitle('');
      setSuccessMessage('Unit added successfully.');
    });
  };

  const handleCreateTopic = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUnit) return setPageError('Select a unit before adding a topic.');
    runAction(async () => {
      const response = await api.post('/topics', { unit_id: selectedUnit.id, title: topicTitle });
      await refreshSyllabus({ semesterId: selectedSemester?.id, subjectId: selectedSubject?.id, unitId: selectedUnit.id, topicId: response.data.data.id });
      setTopicTitle('');
      setSuccessMessage('Topic added successfully.');
    });
  };

  const handleCreateNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTopic) return setPageError('Select a topic before adding a note.');
    runAction(async () => {
      const response = await api.post('/notes', { topic_id: selectedTopic.id, title: noteTitle, content: noteContent });
      setNotesByTopic((current) => ({ ...current, [selectedTopic.id]: [response.data.data as Note, ...(current[selectedTopic.id] || [])] }));
      setNoteTitle('');
      setNoteContent('');
      setSuccessMessage('Note added successfully.');
    });
  };

  const handleCreateResource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTopic) return setPageError('Select a topic before adding a resource.');
    runAction(async () => {
      const response = await api.post('/resources', { topic_id: selectedTopic.id, title: resourceTitle, type: resourceType, url: resourceUrl });
      setResourcesByTopic((current) => ({ ...current, [selectedTopic.id]: [response.data.data as Resource, ...(current[selectedTopic.id] || [])] }));
      setResourceTitle('');
      setResourceType('');
      setResourceUrl('');
      setSuccessMessage('Resource added successfully.');
    });
  };

  const handleToggleImportant = (topic: Topic) => {
    runAction(async () => {
      await api.patch(`/topics/${topic.id}/important`, { is_important: !topic.is_important });
      await refreshSyllabus({ semesterId: selectedSemester?.id, subjectId: selectedSubject?.id, unitId: selectedUnit?.id, topicId: topic.id });
      setSuccessMessage('Topic importance updated.');
    });
  };

  const handleAiSuggestion = () => {
    if (!selectedTopic && !selectedUnit) return setPageError('Select a topic or unit before generating suggestions.');
    runAction(async () => {
      const payload = selectedTopic
        ? { topic: selectedTopic.title }
        : { unit_context: `${selectedUnit?.title}. Existing topics: ${selectedUnit?.topics.map((item) => item.title).join(', ') || 'None'}` };
      const response = await api.post('/ai/suggest-topics', payload);
      setAiSuggestion(response.data.data as AiSuggestion);
      setSuccessMessage('AI suggestions generated.');
    });
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-81px)] w-full max-w-7xl flex-col gap-8 px-6 py-8">
      <section className="grid gap-5 lg:grid-cols-[1.45fr_0.95fr]">
        <Panel title={`Welcome ${firstName || 'Student'}`} subtitle={primaryEmail || 'Connected with Clerk'}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-[var(--accent)]/10 p-4"><p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Semesters</p><p className="mt-2 text-3xl font-black text-slate-950">{syllabus.length}</p></div>
            <div className="rounded-3xl bg-slate-950 p-4 text-white"><p className="text-xs uppercase tracking-[0.2em] text-white/60">Subjects</p><p className="mt-2 text-3xl font-black">{syllabus.reduce((total, semester) => total + semester.subjects.length, 0)}</p></div>
            <div className="rounded-3xl bg-white p-4 ring-1 ring-black/5"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Focused topic</p><p className="mt-2 text-lg font-bold text-slate-900">{selectedTopic?.title || 'Select a topic'}</p></div>
          </div>
        </Panel>

        <Panel title="Quick Actions" subtitle="Work with the selected topic or unit.">
          <div className="flex flex-wrap gap-3">
            <ActionButton onClick={handleAiSuggestion} disabled={isSaving || (!selectedTopic && !selectedUnit)}>Generate AI Suggestions</ActionButton>
            <ActionButton tone="secondary" onClick={() => refreshSyllabus(selection)} disabled={isSaving}>Refresh Data</ActionButton>
          </div>
          {pageError ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{pageError}</div> : null}
          {successMessage ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Panel title="Mind Map Hierarchy" subtitle="Semester -> Subject -> Unit -> Topic">
          <HierarchyTree loading={loadingTree} syllabus={syllabus} selection={selection} onSelect={setSelection} onToggleImportant={handleToggleImportant} disableActions={isSaving} />
        </Panel>

        <Panel title="Current Selection" subtitle="This panel follows the selected item in the hierarchy.">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Semester</p><p className="mt-2 font-bold text-slate-900">{selectedSemester ? `Semester ${selectedSemester.semester_number}` : 'Not selected'}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Subject</p><p className="mt-2 font-bold text-slate-900">{selectedSubject?.name || 'Not selected'}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Unit</p><p className="mt-2 font-bold text-slate-900">{selectedUnit?.title || 'Not selected'}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs uppercase tracking-[0.2em] text-slate-500">Topic</p><p className="mt-2 font-bold text-slate-900">{selectedTopic?.title || 'Not selected'}</p></div>
          </div>
        </Panel>
      </section>

      <CreationForms
        isSaving={isSaving}
        hasSemester={Boolean(selectedSemester)}
        hasSubject={Boolean(selectedSubject)}
        hasUnit={Boolean(selectedUnit)}
        hasTopic={Boolean(selectedTopic)}
        semesterNumber={semesterNumber}
        setSemesterNumber={setSemesterNumber}
        subjectName={subjectName}
        setSubjectName={setSubjectName}
        unitNumber={unitNumber}
        setUnitNumber={setUnitNumber}
        unitTitle={unitTitle}
        setUnitTitle={setUnitTitle}
        topicTitle={topicTitle}
        setTopicTitle={setTopicTitle}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        resourceTitle={resourceTitle}
        setResourceTitle={setResourceTitle}
        resourceType={resourceType}
        setResourceType={setResourceType}
        resourceUrl={resourceUrl}
        setResourceUrl={setResourceUrl}
        onCreateSemester={handleCreateSemester}
        onCreateSubject={handleCreateSubject}
        onCreateUnit={handleCreateUnit}
        onCreateTopic={handleCreateTopic}
        onCreateNote={handleCreateNote}
        onCreateResource={handleCreateResource}
      />

      <TopicPanels selectedTopic={selectedTopic} notes={notes} resources={resources} detailsLoading={detailsLoading} aiSuggestion={aiSuggestion} />
    </main>
  );
}
