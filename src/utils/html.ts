/**
 * HTML 문자열에서 스크립트, 스타일, 주석을 제거합니다.
 */
export function cleanHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * HTML에서 이미지 ID를 추출합니다.
 */
export function extractImageId(srcset: string): string | null {
  const match = srcset.match(/images\/([^\/]+)/);
  return match ? match[1] : null;
}

/**
 * HTML에서 첨부 파일 섹션을 제거합니다.
 */
export function removeAttachmentSections(doc: Document): void {
  const attachmentHeaders = doc.evaluate(
    "//h3[contains(text(), '첨부')]",
    doc,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (let i = 0; i < attachmentHeaders.snapshotLength; i++) {
    const header = attachmentHeaders.snapshotItem(i) as HTMLElement;
    if (!header) continue;

    let currentNode = header;
    
    while (
      currentNode &&
      currentNode.nextElementSibling &&
      currentNode.nextElementSibling instanceof HTMLElement &&
      !currentNode.nextElementSibling.textContent?.trim().startsWith("수업 노트")
    ) {
      const nextNode = currentNode.nextElementSibling as HTMLElement;
      currentNode.parentNode?.removeChild(currentNode);
      currentNode = nextNode;
    }
    
    if (currentNode) {
      currentNode.parentNode?.removeChild(currentNode);
    }
  }
}

/**
 * HTML 이미지를 마크다운 이미지로 변환합니다.
 */
export function processImages(content: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const pictures = doc.querySelectorAll("picture");
  pictures.forEach((picture) => {
    const source = picture.querySelector("source");
    if (source?.getAttribute("srcset")) {
      const imageId = extractImageId(source.getAttribute("srcset")!);
      if (imageId) {
        const markdown = `![${imageId}](https://cdn.class101.net/images/${imageId}/1080xauto.webp)`;
        picture.outerHTML = markdown;
      }
    }
  });

  return doc.body.innerHTML;
} 