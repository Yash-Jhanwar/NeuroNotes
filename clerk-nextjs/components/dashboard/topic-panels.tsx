import { AiSuggestion, Note, Resource, Topic } from '@/components/dashboard/types';

type TopicPanelsProps = {
  selectedTopic?: Topic;
  notes: Note[];
  resources: Resource[];
  detailsLoading: boolean;
  aiSuggestion: AiSuggestion | null;
};

const formatDate = (value?: string) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value));
};

function Panel({
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

export default function TopicPanels({
  selectedTopic,
  notes,
  resources,
  detailsLoading,
  aiSuggestion,
}: TopicPanelsProps) {
  return (
    <>
      {aiSuggestion ? (
        <Panel title="AI Suggestions" subtitle={`Generated on ${formatDate(aiSuggestion.created_at)}`}>
          <div className="flex flex-wrap gap-2">
            {aiSuggestion.important_topics.map((item) => (
              <span key={item} className="rounded-full bg-[var(--accent)]/12 px-3 py-2 text-sm font-medium text-[var(--accent-deep)]">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-3xl bg-slate-950 p-4 text-sm leading-7 text-white/85">
            {aiSuggestion.study_prompt}
          </div>
        </Panel>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Notes" subtitle={selectedTopic ? `For ${selectedTopic.title}` : 'Select a topic'}>
          {detailsLoading && selectedTopic ? (
            <p className="text-sm text-slate-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-slate-500">No notes available for this topic yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <article key={note.id} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{note.title}</h3>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{note.content}</p>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(note.created_at)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Resources" subtitle={selectedTopic ? `For ${selectedTopic.title}` : 'Select a topic'}>
          {detailsLoading && selectedTopic ? (
            <p className="text-sm text-slate-500">Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="text-sm text-slate-500">No resources available for this topic yet.</p>
          ) : (
            <div className="space-y-3">
              {resources.map((resource) => (
                <article key={resource.id} className="rounded-3xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{resource.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{resource.type}</p>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-black/20"
                    >
                      Open
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
