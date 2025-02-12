export interface Class101Settings {
  rootDir: string;
  baseUrl: string;
  templateDir: string;
  lectureFolder: string;
  reviewFolder: string;
  noteFolder: string;
  scriptFolder: string;
  classFolder: string;
  overwrite: boolean;
}

export interface ClassInfo {
  classId: string;
  title: string;
  categoryId?: string;
  categoryTitle?: string;
  creatorName?: string;
}

export interface LectureInfo {
  lectureId: string;
  title: string;
  sn: number;
  duration: number;
}

export interface ProcessLectureOptions {
  lecture: LectureInfo;
  classId: string;
  classTitle: string;
  category: string;
  sanitizedClassTitle: string;
  noteTitle: string;
  paths: {
    lectures: string;
    reviews: string;
    notes: string;
    scripts: string;
    classes: string;
  };
  htmlBaseUrl: string;
  prevNoteTitle: string | null;
  nextNoteTitle: string | null;
}

export interface Lecture extends LectureInfo {
  // LectureInfo의 모든 속성을 상속
}

export interface ClassInfoWithLectures extends ClassInfo {
  lectures: Lecture[];
} 