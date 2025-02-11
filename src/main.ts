import { Plugin, Notice } from "obsidian";
import type { Class101Settings } from "./core/types";
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
    // TODO: 마크다운 생성 로직 구현
  }
}