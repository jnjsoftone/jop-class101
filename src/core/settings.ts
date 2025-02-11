import { App, PluginSettingTab, Setting } from "obsidian";
import type { Class101Settings } from "./types";
import type Class101Plugin from "../main";

export const DEFAULT_SETTINGS: Class101Settings = {
  rootDir: "33. RESOURCES/Lectures/class101",
  baseUrl: "http://125.133.148.194:4000",
  templateDir: "93. templates/class101",
  lectureFolder: "lectures",
  reviewFolder: "reviews",
  noteFolder: "notes",
  scriptFolder: "scripts",
  classFolder: "classes",
  overwrite: false,
};

export class Class101SettingTab extends PluginSettingTab {
  plugin: Class101Plugin;

  constructor(app: App, plugin: Class101Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Class101 설정" });

    new Setting(containerEl)
      .setName("루트 디렉토리")
      .setDesc("Class101 강의 노트가 저장될 기본 경로입니다.")
      .addText((text) =>
        text
          .setPlaceholder("예: 33. RESOURCES/Lectures/class101")
          .setValue(this.plugin.settings.rootDir)
          .onChange(async (value) => {
            this.plugin.settings.rootDir = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("기본 URL")
      .setDesc("Class101 API 서버의 기본 URL입니다.")
      .addText((text) =>
        text
          .setPlaceholder("예: http://125.133.148.194:4000")
          .setValue(this.plugin.settings.baseUrl)
          .onChange(async (value) => {
            this.plugin.settings.baseUrl = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("템플릿 디렉토리")
      .setDesc("템플릿 파일들이 저장된 디렉토리 경로입니다.")
      .addText((text) =>
        text
          .setPlaceholder("예: 93. templates/class101")
          .setValue(this.plugin.settings.templateDir)
          .onChange(async (value) => {
            this.plugin.settings.templateDir = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("파일 덮어쓰기")
      .setDesc("파일이 이미 존재할 경우 덮어쓸지 여부를 설정합니다.")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.overwrite).onChange(async (value) => {
          this.plugin.settings.overwrite = value;
          await this.plugin.saveSettings();
        })
      );

    // 하위 디렉토리 설정들
    const subDirs = [
      { key: "lectureFolder" as const, name: "강의", desc: "강의 파일" },
      { key: "reviewFolder" as const, name: "리뷰", desc: "리뷰 파일" },
      { key: "noteFolder" as const, name: "노트", desc: "노트 파일" },
      { key: "scriptFolder" as const, name: "자막", desc: "자막 파일" },
      { key: "classFolder" as const, name: "클래스", desc: "클래스 파일" },
    ];

    subDirs.forEach(({ key, name, desc }) => {
      new Setting(containerEl)
        .setName(`${name} 폴더`)
        .setDesc(`${desc}이 저장될 하위 경로입니다.`)
        .addText((text) =>
          text
            .setPlaceholder(`예: ${key.replace("Folder", "")}`)
            .setValue(String(this.plugin.settings[key]))
            .onChange(async (value) => {
              this.plugin.settings[key] = value;
              await this.plugin.saveSettings();
            })
        );
    });
  }
} 