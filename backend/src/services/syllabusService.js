import pool from '../config/db.js';

export const getSyllabusTree = async (userId) => {
  const result = await pool.query(
    `
      SELECT
        sem.id AS semester_id,
        sem.semester_number,
        sem.created_at AS semester_created_at,
        sub.id AS subject_id,
        sub.name AS subject_name,
        sub.created_at AS subject_created_at,
        u.id AS unit_id,
        u.unit_number,
        u.title AS unit_title,
        u.created_at AS unit_created_at,
        t.id AS topic_id,
        t.title AS topic_title,
        t.is_important AS topic_is_important,
        t.created_at AS topic_created_at
      FROM semesters sem
      LEFT JOIN subjects sub ON sub.semester_id = sem.id
      LEFT JOIN units u ON u.subject_id = sub.id
      LEFT JOIN topics t ON t.unit_id = u.id
      WHERE sem.user_id = $1
      ORDER BY
        sem.semester_number ASC,
        sub.name ASC NULLS LAST,
        u.unit_number ASC NULLS LAST,
        t.created_at ASC NULLS LAST;
    `,
    [userId]
  );

  const semestersMap = new Map();

  for (const row of result.rows) {
    let semester = semestersMap.get(row.semester_id);

    if (!semester) {
      semester = {
        id: row.semester_id,
        semester_number: row.semester_number,
        created_at: row.semester_created_at,
        subjects: [],
      };

      semester._subjectsMap = new Map();
      semestersMap.set(row.semester_id, semester);
    }

    if (!row.subject_id) {
      continue;
    }

    let subject = semester._subjectsMap.get(row.subject_id);

    if (!subject) {
      subject = {
        id: row.subject_id,
        semester_id: row.semester_id,
        name: row.subject_name,
        created_at: row.subject_created_at,
        units: [],
      };

      subject._unitsMap = new Map();
      semester.subjects.push(subject);
      semester._subjectsMap.set(row.subject_id, subject);
    }

    if (!row.unit_id) {
      continue;
    }

    let unit = subject._unitsMap.get(row.unit_id);

    if (!unit) {
      unit = {
        id: row.unit_id,
        subject_id: row.subject_id,
        unit_number: row.unit_number,
        title: row.unit_title,
        created_at: row.unit_created_at,
        topics: [],
      };

      unit._topicsMap = new Map();
      subject.units.push(unit);
      subject._unitsMap.set(row.unit_id, unit);
    }

    if (!row.topic_id || unit._topicsMap.has(row.topic_id)) {
      continue;
    }

    const topic = {
      id: row.topic_id,
      unit_id: row.unit_id,
      title: row.topic_title,
      is_important: row.topic_is_important,
      created_at: row.topic_created_at,
    };

    unit.topics.push(topic);
    unit._topicsMap.set(row.topic_id, topic);
  }

  const syllabus = Array.from(semestersMap.values()).map((semester) => {
    delete semester._subjectsMap;

    semester.subjects = semester.subjects.map((subject) => {
      delete subject._unitsMap;

      subject.units = subject.units.map((unit) => {
        delete unit._topicsMap;
        return unit;
      });

      return subject;
    });

    return semester;
  });

  return syllabus;
};
