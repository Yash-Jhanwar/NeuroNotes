import { Semester, SelectionState, Topic } from '@/components/dashboard/types';

type HierarchyTreeProps = {
  loading: boolean;
  syllabus: Semester[];
  selection: SelectionState;
  onSelect: (selection: SelectionState) => void;
  onToggleImportant: (topic: Topic) => void;
  disableActions?: boolean;
};

export default function HierarchyTree({
  loading,
  syllabus,
  selection,
  onSelect,
  onToggleImportant,
  disableActions,
}: HierarchyTreeProps) {
  if (loading) {
    return <p className="text-sm text-slate-500">Loading your syllabus...</p>;
  }

  if (syllabus.length === 0) {
    return <p className="text-sm text-slate-500">No syllabus data yet. Start by adding a semester.</p>;
  }

  return (
    <div className="space-y-5">
      {syllabus.map((semester) => (
        <div key={semester.id} className="rounded-[1.75rem] border border-black/5 bg-slate-50/80 p-4">
          <button
            className={`w-full rounded-2xl px-4 py-4 text-left transition ${
              selection.semesterId === semester.id
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
            onClick={() =>
              onSelect({
                semesterId: semester.id,
                subjectId: semester.subjects[0]?.id,
                unitId: semester.subjects[0]?.units[0]?.id,
                topicId: semester.subjects[0]?.units[0]?.topics[0]?.id,
              })
            }
          >
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">Semester</p>
            <p className="mt-1 text-lg font-bold">Semester {semester.semester_number}</p>
          </button>

          <div className="mt-4 space-y-4 border-l-2 border-dashed border-[var(--accent)]/20 pl-4">
            {semester.subjects.map((subject) => (
              <div key={subject.id} className="rounded-[1.5rem] border border-black/5 bg-white p-4">
                <button
                  className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                    selection.subjectId === subject.id
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                  }`}
                  onClick={() =>
                    onSelect({
                      semesterId: semester.id,
                      subjectId: subject.id,
                      unitId: subject.units[0]?.id,
                      topicId: subject.units[0]?.topics[0]?.id,
                    })
                  }
                >
                  <p className="text-xs uppercase tracking-[0.2em] opacity-70">Subject</p>
                  <p className="mt-1 font-bold">{subject.name}</p>
                </button>

                <div className="mt-4 space-y-3 border-l-2 border-dashed border-slate-200 pl-4">
                  {subject.units.map((unit) => (
                    <div key={unit.id} className="rounded-3xl bg-slate-50 p-4">
                      <button
                        className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                          selection.unitId === unit.id
                            ? 'bg-[var(--accent)]/12 text-slate-950 ring-1 ring-[var(--accent)]/20'
                            : 'bg-white text-slate-900 hover:bg-slate-100'
                        }`}
                        onClick={() =>
                          onSelect({
                            semesterId: semester.id,
                            subjectId: subject.id,
                            unitId: unit.id,
                            topicId: unit.topics[0]?.id,
                          })
                        }
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                          Unit {unit.unit_number}
                        </p>
                        <p className="mt-1 font-semibold">{unit.title}</p>
                      </button>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {unit.topics.map((topic) => (
                          <div key={topic.id} className="flex items-center gap-2">
                            <button
                              className={`rounded-full px-3 py-2 text-sm transition ${
                                selection.topicId === topic.id
                                  ? 'bg-slate-950 text-white'
                                  : topic.is_important
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-white text-slate-700 ring-1 ring-black/5 hover:bg-slate-100'
                              }`}
                              onClick={() =>
                                onSelect({
                                  semesterId: semester.id,
                                  subjectId: subject.id,
                                  unitId: unit.id,
                                  topicId: topic.id,
                                })
                              }
                            >
                              {topic.title}
                            </button>
                            <button
                              className="rounded-full border border-black/10 bg-white px-2 py-1 text-xs text-slate-600 transition hover:border-black/20"
                              onClick={() => onToggleImportant(topic)}
                              disabled={disableActions}
                            >
                              {topic.is_important ? 'Important' : 'Star'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
