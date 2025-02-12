import { App, TFile, Notice } from "obsidian";
import { join } from "path";
import type { Class101Settings, Lecture } from "./types";

export class FileManager {
  constructor(
    private app: App,
    private settings: Class101Settings
  ) {}

  async ensureFolder(folderPath: string): Promise<void> {
    try {
      if (!(await this.app.vault.adapter.exists(folderPath))) {
        await this.app.vault.createFolder(folderPath);
      }
    } catch (error) {
      if (!this.settings.overwrite || !error.message?.includes("Folder already exists")) {
        throw error;
      }
    }
  }

  async createFileWithOverwriteCheck(filePath: string, content: string): Promise<void> {
    const exists = await this.app.vault.adapter.exists(filePath);
    if (exists && !this.settings.overwrite) {
      throw new Error(`파일이 이미 존재합니다: ${filePath}`);
    }
    await this.app.vault.create(filePath, content);
  }

  async getTemplate(templateName: string): Promise<string> {
    try {
      const templatePath = join(this.settings.templateDir, `${templateName}.md`);
      return await this.app.vault.adapter.read(templatePath);
    } catch (error) {
      console.error(`Error reading ${templateName} template:`, error);
      return this.getDefaultTemplate(templateName);
    }
  }

  private getDefaultTemplate(templateName: string): string {
    switch (templateName) {
      case "review":
        return `---
title: {{lectureTitle}}
viewCount: 0
difficulty: 3
likeability: 3
tags:
  - review/class101
---

### 정리/요약



### 3줄평


### 원본 노트

[[{{noteTitle}}|강의노트]]

`;

      case "lecture":
        return `---
title: {{title}}
sourceURL: {{sourceURL}}
duration: {{duration}}
category: {{category}}
tags: {{tags}}
---

<video controls>
  <source src="{{videoUrl}}">
</video>

{{navigationLinks}}

## 리뷰
{{reviewLink}}

## 노트
{{noteLink}}

## 자막
{{scriptLink}}
`;

      default:
        return "";
    }
  }

  async createClassList(classes: any[]): Promise<void> {
    try {
      new Notice("클래스 목록을 생성하고 있습니다...");

      let tableContent = "| 제목 | 카테고리 | 크리에이터 | 링크 |\n";
      tableContent += "|------|-----------|------------|------|\n";

      for (const classInfo of classes) {
        const title = classInfo.title.replace(/\|/g, "\\|");
        const category = classInfo.categoryTitle?.replace(/\|/g, "\\|") || "";
        const creator = classInfo.creatorName?.replace(/\|/g, "\\|") || "";
        const link = `[[${this.sanitizeName(title)}|🔗]]`;

        tableContent += `| ${title} | ${category} | ${creator} | ${link} |\n`;
      }

      const content = `---
title: class101
tags: 
  - lecture/class101
---

## 클래스 목록

${tableContent}`;

      const filePath = join(this.settings.rootDir, "myclasses.md");
      await this.createFileWithOverwriteCheck(filePath, content);

      new Notice("클래스 목록이 생성되었습니다.");
    } catch (error) {
      console.error("Error creating class list:", error);
      new Notice("클래스 목록 생성 중 오류가 발생했습니다.");
    }
  }

  private sanitizeName(name: string): string {
    return name
      .replace(/\[/g, "(")
      .replace(/\]/g, ")")
      .replace(/[^\uAC00-\uD7A3a-zA-Z0-9_\(\)\<\>,\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  getPath(type: 'lectures' | 'reviews' | 'notes' | 'scripts' | 'classes', classTitle?: string): string {
    const basePath = this.settings.rootDir;
    const folderMap = {
      lectures: this.settings.lectureFolder,
      reviews: this.settings.reviewFolder,
      notes: this.settings.noteFolder,
      scripts: this.settings.scriptFolder,
      classes: this.settings.classFolder,
    };
    
    return classTitle 
      ? join(basePath, folderMap[type], classTitle)
      : join(basePath, folderMap[type]);
  }

  async createClassIndex(data: {
    classTitle: string;
    noteTitles: string[];
    category: string;
    sanitizedClassTitle: string;
    classId: string;
  }): Promise<void> {
    const { classTitle, noteTitles, category, sanitizedClassTitle } = data;
    const source = `https://class101.net/ko/classes/${data.classId}`;
    const lectureList = noteTitles.map((noteTitle) => `### [[${noteTitle}]]`).join('\n\n');
    
    const content = `---
title: "${classTitle}"
source: ${source}
category: ${category}
tags: 
  - class101/class
---

## 클래스 소개

[[${sanitizedClassTitle}_intro|클래스 소개]]


## 준비물

[[${sanitizedClassTitle}_kit|준비물]]


## 커리큘럼

${lectureList}`;

    const filePath = join(this.settings.rootDir, this.settings.classFolder, `${sanitizedClassTitle}.md`);
    await this.createFileWithOverwriteCheck(filePath, content);
  }

  getFilePath(basePath: string, fileName: string): string {
    return join(basePath, fileName);
  }

  async createFile(filePath: string, content: string): Promise<void> {
    await this.createFileWithOverwriteCheck(filePath, content);
  }

  async getReviewTemplate(): Promise<string> {
    return this.getTemplate("review");
  }

  createReviewContent(data: {
    template: string;
    lectureTitle: string;
    source: string;
    videoUrl: string;
    noteTitle: string;
  }): string {
    const { template, lectureTitle, source, videoUrl, noteTitle } = data;
    return template
      .replace("{{lectureTitle}}", lectureTitle)
      .replace("{{source}}", source)
      .replace("{{videoUrl}}", videoUrl)
      .replace("{{noteTitle}}", noteTitle);
  }

  async createLectureMarkdown(data: {
    lecture: Lecture;
    classTitle: string;
    noteTitle: string;
    source: string;
    category: string;
    sanitizedClassTitle: string;
    prevNoteTitle: string | null;
    nextNoteTitle: string | null;
    classId: string;
  }): Promise<string> {
    const template = await this.getTemplate("lecture");
    const {
      lecture,
      noteTitle,
      source,
      category,
      sanitizedClassTitle,
      prevNoteTitle,
      nextNoteTitle,
    } = data;

    // 이전/다음 강의 링크 생성
    const prevLink = prevNoteTitle ? `[[${prevNoteTitle}|← 이전 강의]]` : '';
    const nextLink = nextNoteTitle ? `[[${nextNoteTitle}|다음 강의 →]]` : '';
    const navigationLinks = [
      prevLink, 
      `[[${sanitizedClassTitle}|❖ 전체 목록]]`, 
      nextLink
    ].filter(Boolean).join(' | ');

    // 비디오 URL 생성
    const videoUrl = `${this.settings.baseUrl}/lecture/class101/${sanitizedClassTitle}/${noteTitle}.mkv`;

    // 링크 생성
    const reviewLink = `[[${noteTitle}_review|리뷰 작성]]`;
    const noteLink = `[[${noteTitle}_note|수업 노트]]`;
    const scriptLink = `[[${noteTitle}_script|자막 보기]]`;

    // 태그 생성
    const tags = category ? `class101/${category.replace(/\s+/g, '')}` : 'class101';

    // 템플릿 변수 치환
    return template
      .replace('{{title}}', lecture.title)
      .replace('{{sourceURL}}', source)
      .replace('{{duration}}', this.formatDuration(lecture.duration))
      .replace('{{category}}', category)
      .replace('{{tags}}', tags)
      .replace('{{videoUrl}}', videoUrl)
      .replace('{{navigationLinks}}', navigationLinks)
      .replace('{{reviewLink}}', reviewLink)
      .replace('{{noteLink}}', noteLink)
      .replace('{{scriptLink}}', scriptLink);
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
} 