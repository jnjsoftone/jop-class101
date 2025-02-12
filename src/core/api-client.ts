import type { ClassInfo, LectureInfo } from "./types";

export class Class101ApiClient {
  constructor(private baseUrl: string) {}

  async getClassIds(): Promise<string[]> {
    return this.fetchJson<string[]>(`${this.baseUrl}/lecture/_repo/class101/json/myclassIds.json`);
  }

  async getAllClasses(): Promise<any[]> {
    return this.fetchJson<any[]>(`${this.baseUrl}/lecture/_repo/class101/json/myclasses.json`);
  }

  private async fetchJson<T>(url: string): Promise<T> {
    try {
      console.log("Fetching JSON from:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching JSON from ${url}:`, error);
      throw error;
    }
  }

  private async fetchHtml(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching HTML from ${url}:`, error);
      throw error;
    }
  }

  async getClassInfo(classId: string): Promise<ClassInfoWithLectures> {
    const [classes, lectures] = await Promise.all([
      this.fetchJson<ClassInfo[]>(`${this.baseUrl}/lecture/_repo/class101/json/myclasses.json`),
      this.fetchJson<Lecture[]>(`${this.baseUrl}/lecture/_repo/class101/json/classes/${classId}.json`)
    ]);

    const classInfo = classes.find((c) => c.classId === classId);
    if (!classInfo) {
      throw new Error(`Class ID ${classId} not found`);
    }

    return {
      ...classInfo,
      lectures: Array.isArray(lectures) ? lectures : lectures.lectures || []
    };
  }

  async getLectureInfo(classId: string): Promise<LectureInfo[]> {
    return this.fetchJson<LectureInfo[]>(`${this.baseUrl}/lecture/_repo/class101/json/classes/${classId}.json`);
  }

  async getCategory(classId: string): Promise<string> {
    try {
      const [myclasses, subCategories, categories] = await Promise.all([
        this.fetchJson<ClassInfo[]>(`${this.baseUrl}/lecture/_repo/class101/json/myclasses.json`),
        this.fetchJson<any[]>(`${this.baseUrl}/lecture/_repo/class101/json/subCategories.json`),
        this.fetchJson<any[]>(`${this.baseUrl}/lecture/_repo/class101/json/categories.json`)
      ]);

      const classInfo = myclasses.find((c) => c.classId === classId);
      if (!classInfo) return "";

      const subCategory = subCategories.find((sc) => sc.categoryId === classInfo.categoryId);
      if (!subCategory) return "";

      const category = categories.find((c) => c.categoryId === subCategory.ancestorId);
      if (!category) return "";

      return `${category.title0}/${category.title}/${subCategory.title}`;
    } catch (error) {
      console.error("Error in getCategory:", error);
      return "";
    }
  }

  async fetchAttachments(classId: string, lectureSlug: string): Promise<string[]> {
    try {
      const url = `${this.baseUrl}/api/files/${classId}/${lectureSlug}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.files || !Array.isArray(data.files)) {
        return [];
      }

      return data.files.filter((file: string) => !file.startsWith("@") && !file.startsWith("."));
    } catch (error) {
      console.error(`Error fetching attachments for lecture ${lectureSlug}:`, error);
      return [];
    }
  }

  async getScriptContent(classId: string, sanitizedClassTitle: string, noteTitle: string): Promise<string | null> {
    try {
      const scriptUrl = `${this.baseUrl}/lecture/class101/${sanitizedClassTitle}/${noteTitle}.vtt`;
      const response = await fetch(scriptUrl);
      if (!response.ok) {
        console.log(`Script not found for lecture ${noteTitle}`);
        return null;
      }
      return await response.text();
    } catch (error) {
      console.error("Error getting script content:", error);
      return null;
    }
  }

  async getLectureNote(classId: string, lectureSlug: string): Promise<string> {
    const url = `${this.baseUrl}/lecture/_repo/class101/html/classes/${classId}/${lectureSlug}/materials/index.html`;
    const response = await fetch(url);
    return response.text();
  }

  async getLectureAttachments(classId: string, lectureSlug: string): Promise<string[]> {
    const url = `${this.baseUrl}/api/files/${classId}/${lectureSlug}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.files || [];
  }

  async getLectureScript(sanitizedClassTitle: string, noteTitle: string): Promise<string | null> {
    const url = `${this.baseUrl}/lecture/class101/${sanitizedClassTitle}/${noteTitle}.vtt`;
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.text();
  }
} 