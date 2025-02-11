import { App, TFile, Notice } from "obsidian";
import { join } from "path";
import type { Class101Settings } from "./types";

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
source: {{source}}
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
} 