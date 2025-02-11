import { cleanHtml, removeAttachmentSections } from "../utils/html";
import { fixBrokenKorean } from "../utils/sanitizer";

export class MarkdownConverter {
  private baseUrl: string;
  private currentClassId: string | null = null;
  private currentLectureSlug: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setContext(classId: string, lectureSlug: string) {
    this.currentClassId = classId;
    this.currentLectureSlug = lectureSlug;
  }

  async convertHtmlToMarkdown(html: string, attachments: string[] = []): Promise<string> {
    try {
      if (!html) return "";

      // HTML 정리
      const cleanedHtml = cleanHtml(html);

      // DOM 파서 생성
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanedHtml, "text/html");

      // 첨부 파일 섹션 제거
      removeAttachmentSections(doc);

      // 마크다운으로 변환
      let markdown = "";

      // 첨부 파일 섹션 추가 (있는 경우에만)
      if (attachments.length > 0 && this.currentClassId && this.currentLectureSlug) {
        markdown += `### 첨부 파일\n\n${attachments
          .map((fileName) => {
            const encodedFileName = encodeURIComponent(fileName);
            return `[${fileName}](${this.baseUrl}/lecture/_repo/class101/html/classes/${this.currentClassId}/${this.currentLectureSlug}/files/${encodedFileName})`;
          })
          .join("\n\n")}\n\n`;
      }

      // 수업 노트 섹션 추가
      markdown += "### 수업 노트\n\n";

      // 전체 내용 처리
      const content = this.processNode(doc.body);
      markdown += content.replace(/### 수업 노트\n\n/g, "");

      // 마지막 정리
      return this.cleanupMarkdown(markdown);
    } catch (error) {
      console.error("Error converting HTML to Markdown:", error);
      return "";
    }
  }

  private processNode(node: Node): string {
    if (!node) return "";

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || "";
      return text ? text + " " : "";
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    let result = "";

    // 자식 노드들의 내용을 재귀적으로 처리
    const childContent = Array.from(element.childNodes)
      .map((child) => this.processNode(child))
      .join("")
      .trim();

    switch (tagName) {
      case "h1":
        result = `# ${childContent}\n\n`;
        break;
      case "h2":
        result = `## ${childContent}\n\n`;
        break;
      case "h3":
        result = `### ${childContent}\n\n`;
        break;
      case "h4":
        result = `#### ${childContent}\n\n`;
        break;
      case "h5":
        result = `##### ${childContent}\n\n`;
        break;
      case "h6":
        result = `###### ${childContent}\n\n`;
        break;
      case "p":
        result = `${childContent}\n\n`;
        break;
      case "strong":
      case "b":
        result = ` **${childContent}** `;
        break;
      case "em":
      case "i":
        result = ` *${childContent}* `;
        break;
      case "a":
        const href = element.getAttribute("href");
        result = href ? `[${childContent}](${href})` : childContent;
        break;
      case "img":
        const src = element.getAttribute("src");
        const alt = fixBrokenKorean(element.getAttribute("alt") || "");
        result = src ? `![${alt}](${src})\n\n` : "";
        break;
      case "ul":
        result =
          Array.from(element.children)
            .map((li) => `- ${this.processNode(li)}`)
            .join("\n\n") + "\n\n";
        break;
      case "ol":
        result =
          Array.from(element.children)
            .map((li, index) => `${index + 1}. ${this.processNode(li)}`)
            .join("\n\n") + "\n\n";
        break;
      case "li":
        result = childContent;
        break;
      case "br":
        result = "\n\n";
        break;
      case "code":
        result = `\`${childContent}\``;
        break;
      case "pre":
        result = `\`\`\`\n${childContent}\n\`\`\`\n\n`;
        break;
      case "blockquote":
        result = `> ${childContent}\n\n`;
        break;
      case "div":
        result = `${childContent}\n\n`;
        break;
      default:
        result = childContent;
    }

    return result;
  }

  private cleanupMarkdown(markdown: string): string {
    return markdown
      .replace(/\*\*([^*\n]+)\*\*(\s*)\*\*/g, " **$1** ") // 중복된 강조 제거 및 공백 추가
      .replace(/\n{3,}/g, "\n\n") // 연속된 줄바꿈 정리
      .replace(/\s+\n/g, "\n") // 줄 끝의 공백 제거
      .replace(/\n\s+/g, "\n") // 줄 시작의 공백 제거
      .replace(/([^\n])\n([^\n])/g, "$1\n\n$2") // 단일 줄바꿈을 이중 줄바꿈으로 변경
      .replace(/^\s+|\s+$/g, "") // 시작과 끝의 공백 제거
      .replace(/(!\[[^\]]*\]\([^)]+\))([^\n])/g, "$1\n\n$2") // 이미지 링크 뒤에 줄바꿈 추가
      .trim();
  }

  parseVTT(vttContent: string): string {
    try {
      const lines = vttContent.split("\n");
      let markdown = "";
      let isHeader = true;

      for (const line of lines) {
        // VTT 헤더 건너뛰기
        if (isHeader) {
          if (line.trim() === "") {
            isHeader = false;
          }
          continue;
        }

        // 숫자만 있는 라인(큐 번호) 건너뛰기
        if (/^\d+$/.test(line.trim())) {
          continue;
        }

        // 타임스탬프 라인 건너뛰기
        if (line.includes("-->")) {
          continue;
        }

        // 빈 줄 건너뛰기
        if (line.trim() === "") {
          continue;
        }

        // X-TIMESTAMP-MAP 라인 건너뛰기
        if (line.includes("X-TIMESTAMP-MAP")) {
          continue;
        }

        // 텍스트 라인 처리
        const currentText = line.trim();
        if (currentText) {
          markdown += currentText + "\n";
        }
      }

      return markdown.trim();
    } catch (error) {
      console.error("Error parsing VTT:", error);
      return "";
    }
  }
} 