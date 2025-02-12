import { Plugin, Notice } from "obsidian";
import type { Class101Settings, Lecture, ClassInfo, ClassInfoWithLectures } from "./core/types";
import { DEFAULT_SETTINGS, Class101SettingTab } from "./core/settings";
import { Class101ApiClient } from "./core/api-client";
import { FileManager } from "./core/file-manager";
import { MarkdownConverter } from "./core/converter";
import { sanitizeName } from "./utils/sanitizer";

export default class Class101Plugin extends Plugin {
  settings: Class101Settings;
  private apiClient: Class101ApiClient;
  private fileManager: FileManager;
  private converter: MarkdownConverter;
  private currentClassId: string | null = null;
  private currentLectureSlug: string | null = null;

  async onload() {
    await this.loadSettings();

    this.apiClient = new Class101ApiClient(this.settings.baseUrl);
    this.fileManager = new FileManager(this.app, this.settings);
    this.converter = new MarkdownConverter(this.settings.baseUrl);

    console.log("Class101 플러그인이 로드되었습니다.");

    // 설정 탭 추가
    this.addSettingTab(new Class101SettingTab(this.app, this));

    // 명령어 추가
    this.addCommand({
      id: "process-single-class",
      name: "Process Single Class from Clipboard",
      callback: () => this.processSingleClass(),
    });

    this.addCommand({
      id: "process-all-classes",
      name: "Process All Classes from Server",
      callback: () => this.processAllClasses(),
    });

    this.addCommand({
      id: "process-in-file",
      name: "Process Classes from Current File",
      callback: () => this.processInFile(),
    });

    this.addCommand({
      id: "create-class-list",
      name: "Create Class List",
      callback: () => this.createClassList(),
    });
  }

  onunload() {
    console.log("Class101 플러그인이 언로드되었습니다.");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // Class101 URL에서 classId를 추출하는 메서드
  private extractClassId(url: string): string | null {
    try {
      console.log("URL 분석:", url);

      // "/"가 없는 경우 입력된 문자열을 classId로 간주
      if (!url.includes("/")) {
        console.log("직접 입력된 classId:", url);
        return url;
      }

      // class101.net/ko/classes/{classId} 형식의 URL 처리
      if (url.includes("class101.net/ko/classes/")) {
        const classId = url.split("classes/")[1].split("/")[0];
        console.log("매칭된 classId:", classId);
        return classId;
      }

      // class101.net/classes/{classId} 형식의 URL도 처리
      if (url.includes("class101.net/classes/")) {
        const classId = url.split("classes/")[1].split("/")[0];
        console.log("매칭된 classId:", classId);
        return classId;
      }

      return null;
    } catch (error) {
      console.error("URL 변환 오류:", error);
      return null;
    }
  }

  async processSingleClass() {
    try {
      const clipText = await navigator.clipboard.readText();
      console.log("클립보드 내용:", clipText);

      const classId = this.extractClassId(clipText);
      console.log("추출된 classId:", classId);

      if (!classId) {
        new Notice("유효한 Class101 URL이 클립보드에 없습니다.");
        return;
      }

      new Notice("강의 정보를 가져오고 있습니다...");
      await this.generateMarkdown(classId);
    } catch (error) {
      console.error("Error:", error);
      new Notice(`강의 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async processAllClasses() {
    try {
      new Notice("서버에서 클래스 목록을 가져오는 중...");

      const classIds = await this.apiClient.getClassIds();

      if (!Array.isArray(classIds) || classIds.length === 0) {
        new Notice("처리할 클래스가 없습니다.");
        return;
      }

      new Notice(`${classIds.length}개의 클래스를 처리합니다...`);

      for (const classId of classIds) {
        try {
          new Notice(`클래스 처리 중: ${classId}`);
          await this.generateMarkdown(classId);
        } catch (error) {
          console.error(`Error processing class ${classId}:`, error);
          new Notice(`클래스 처리 중 오류 발생: ${classId}`);
        }
      }

      new Notice("모든 클래스 처리가 완료되었습니다.");
    } catch (error) {
      console.error("Error in processAllClasses:", error);
      new Notice("클래스 처리 중 오류가 발생했습니다.");
    }
  }

  async processInFile() {
    try {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) {
        new Notice("처리할 파일이 선택되지 않았습니다.");
        return;
      }

      const content = await this.app.vault.read(activeFile);
      console.log("파일 내용:", content);

      const lines = content.split("\n").map((line) => line.trim().replace(/\s+/g, ""));
      console.log("분리된 줄:", lines);

      const validLines = lines.filter((line) => {
        const isValid = line.length > 20 && /^[a-zA-Z0-9\/:]+$/.test(line);
        console.log(`라인 "${line}": 길이=${line.length}, 유효성=${isValid}`);
        return isValid;
      });

      console.log("유효한 줄:", validLines);

      if (validLines.length === 0) {
        new Notice("처리할 유효한 classId/URL이 없습니다.");
        return;
      }

      new Notice(`${validLines.length}개의 클래스를 처리합니다...`);

      for (const line of validLines) {
        try {
          const classId = this.extractClassId(line);
          console.log(`처리 중인 라인: "${line}", 추출된 classId: ${classId}`);
          if (classId) {
            new Notice(`클래스 처리 중: ${classId}`);
            await this.generateMarkdown(classId);
          }
        } catch (error) {
          console.error(`Error processing class ${line}:`, error);
          new Notice(`클래스 처리 중 오류 발생: ${line}`);
        }
      }

      new Notice("모든 클래스 처리가 완료되었습니다.");
    } catch (error) {
      console.error("Error in processInFile:", error);
      new Notice("클래스 처리 중 오류가 발생했습니다.");
    }
  }

  async createClassList() {
    try {
      const classes = await this.apiClient.getAllClasses();
      await this.fileManager.createClassList(classes);
    } catch (error) {
      console.error("Error in createClassList:", error);
      new Notice("클래스 목록 생성 중 오류가 발생했습니다.");
    }
  }

  private async generateMarkdown(classId: string) {
    try {
      // 현재 처리중인 classId 저장
      this.currentClassId = classId;

      // JSON 데이터 가져오기
      const [classesJson, classInfo] = await Promise.all([
        this.apiClient.getAllClasses(),
        this.apiClient.getClassInfo(classId)
      ]) as [ClassInfo[], ClassInfoWithLectures];

      const lectures = Array.isArray(classInfo) ? classInfo : classInfo.lectures;
      const classData = classesJson.find((c) => c.classId === classId);

      if (!classData) {
        throw new Error(`Class ID ${classId} not found in myclasses.json`);
      }

      const classTitle = classData.title;
      const category = await this.apiClient.getCategory(classId);
      const sanitizedClassTitle = sanitizeName(classTitle);
      const noteTitles: string[] = [];

      // 각 카테고리별 클래스 폴더 경로 생성
      const paths = {
        lectures: this.fileManager.getPath('lectures', sanitizedClassTitle),
        reviews: this.fileManager.getPath('reviews', sanitizedClassTitle),
        notes: this.fileManager.getPath('notes', sanitizedClassTitle),
        scripts: this.fileManager.getPath('scripts', sanitizedClassTitle),
        classes: this.fileManager.getPath('classes'),
      };

      // 필요한 폴더들 생성
      for (const dir of Object.values(paths)) {
        await this.fileManager.ensureFolder(dir);
      }

      // 각 강의별 처리
      for (let i = 0; i < lectures.length; i++) {
        const lecture = lectures[i];
        const lectureSlug = this.getLectureSlug(lecture);
        const noteTitle = `${lecture.sn.toString().padStart(3, '0')}_${sanitizeName(lecture.title)}`;
        noteTitles.push(noteTitle);

        new Notice(`강의 처리 중: ${noteTitle}`);

        // 현재 처리중인 lectureSlug 저장
        this.currentLectureSlug = lectureSlug;

        await this.processLecture({
          lecture,
          classId,
          classTitle,
          category,
          sanitizedClassTitle,
          noteTitle,
          paths,
          prevNoteTitle: i > 0 ? noteTitles[i - 1] : null,
          nextNoteTitle: i < lectures.length - 1 
            ? `${lectures[i + 1].sn.toString().padStart(3, '0')}_${sanitizeName(lectures[i + 1].title)}`
            : null,
        });
      }

      // 클래스 인덱스 파일 생성
      await this.fileManager.createClassIndex({
        classTitle,
        noteTitles,
        category,
        sanitizedClassTitle,
        classId,
      });

      new Notice(`${classTitle} 강의 처리가 완료되었습니다.`);
    } catch (error) {
      console.error('Error in generateMarkdown:', error);
      throw error;
    }
  }

  private getLectureSlug(lecture: Lecture): string {
    return `${lecture.sn.toString().padStart(3, '0')}_${lecture.lectureId}`;
  }

  private async processLecture(data: {
    lecture: Lecture;
    classId: string;
    classTitle: string;
    category: string;
    sanitizedClassTitle: string;
    noteTitle: string;
    paths: Record<string, string>;
    prevNoteTitle: string | null;
    nextNoteTitle: string | null;
  }) {
    const {
      lecture,
      classId,
      classTitle,
      category,
      sanitizedClassTitle,
      noteTitle,
      paths,
      prevNoteTitle,
      nextNoteTitle,
    } = data;

    const source = `https://class101.net/ko/classes/${classId}/lectures/${lecture.lectureId}`;
    const lectureSlug = this.getLectureSlug(lecture);

    // 노트 내용 처리
    try {
      const noteHtml = await this.apiClient.getLectureNote(classId, lectureSlug);
      const attachments = await this.apiClient.getLectureAttachments(classId, lectureSlug);
      const noteContent = await this.converter.convertHtmlToMarkdown(noteHtml, attachments);

      if (noteContent) {
        const noteFilePath = this.fileManager.getFilePath(paths.notes, `${noteTitle}_note.md`);
        await this.fileManager.createFile(noteFilePath, noteContent);
      }
    } catch (error) {
      console.log(`No note content found for lecture ${lectureSlug}`);
    }

    // 스크립트 처리
    try {
      const scriptContent = await this.apiClient.getLectureScript(sanitizedClassTitle, noteTitle);
      if (scriptContent) {
        const scriptPath = this.fileManager.getFilePath(paths.scripts, `${noteTitle}_script.md`);
        await this.fileManager.createFile(scriptPath, scriptContent);
      }
    } catch (error) {
      console.log(`No script content found for lecture ${lectureSlug}`);
    }

    // 리뷰 파일 생성
    const reviewTemplate = await this.fileManager.getReviewTemplate();
    const videoUrl = `${this.settings.baseUrl}/lecture/class101/${sanitizedClassTitle}/${noteTitle}.mkv`;
    const reviewContent = this.fileManager.createReviewContent({
      template: reviewTemplate,
      lectureTitle: lecture.title,
      source,
      videoUrl,
      noteTitle,
    });

    const reviewFilePath = this.fileManager.getFilePath(paths.reviews, `${noteTitle}_review.md`);
    await this.fileManager.createFile(reviewFilePath, reviewContent);

    // 메인 강의 마크다운 생성
    const markdown = await this.fileManager.createLectureMarkdown({
      lecture,
      classTitle,
      noteTitle,
      source,
      category,
      sanitizedClassTitle,
      prevNoteTitle,
      nextNoteTitle,
      classId,
    });

    const markdownPath = this.fileManager.getFilePath(paths.lectures, `${noteTitle}.md`);
    await this.fileManager.createFile(markdownPath, markdown);
  }
}