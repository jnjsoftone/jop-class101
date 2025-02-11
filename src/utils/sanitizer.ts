/**
 * 파일명이나 경로에 사용할 수 있도록 문자열을 정제합니다.
 */
export function sanitizeName(name: string): string {
  return name
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/[^\uAC00-\uD7A3a-zA-Z0-9_\(\)\<\>,\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * YAML 프론트매터에 사용할 수 있도록 값을 이스케이프 처리합니다.
 */
export function escapeYamlValue(value: string | number, isTitle = false): string {
  if (typeof value !== "string") return String(value);

  if (isTitle) {
    value = value.replace(/"/g, "'");
    return `"${value}"`;
  }

  if (/[[\]{}:,"'#|>&*!]/.test(value)) {
    value = value.replace(/"/g, '\\"');
    return `"${value}"`;
  }

  return value;
}

/**
 * 깨진 한글 문자를 복원합니다.
 */
export function fixBrokenKorean(text: string): string {
  try {
    if (!/[ì|í|ë|ê|å|ã]/.test(text)) {
      return text;
    }

    const bytes = text.split("").map((char) => char.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(new Uint8Array(bytes));

    return decoded;
  } catch (error) {
    console.error("Error fixing broken Korean:", error);
    return text;
  }
} 