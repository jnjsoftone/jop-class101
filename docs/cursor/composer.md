```prompt
@_jop-class101 폴더에 있는 @main.js @manifest.json 파일의 내용을 잘 파악해주세요. obsidian plugin을 위한 파일들이예요.

javascript로 되어 있는 파일들을 typescript로 리팩토링하려고 해요.

@src 폴더에 @main.ts @data.ts 를 중심으로 코딩을 하고, 주요 기능들은 기능별로 모듈화 하여, 'core' 폴더에서 파일로 나누어 구현하고, 유틸리티 함수들은 'utils' 폴더에서 구현해주세요.
```


src/
├── main.ts                # 메인 플러그인 클래스
├── data.ts               # 데이터 관리
├── core/
│   ├── types.ts          # 타입 정의
│   ├── settings.ts       # 설정 관리
│   ├── processor.ts      # 강의 처리 로직
│   ├── converter.ts      # HTML to Markdown 변환
│   ├── file-manager.ts   # 파일 시스템 작업
│   └── api-client.ts     # API 통신
└── utils/
    ├── html.ts           # HTML 관련 유틸리티
    ├── markdown.ts       # 마크다운 관련 유틸리티
    ├── sanitizer.ts      # 문자열 정제 유틸리티
    └── path.ts           # 경로 관련 유틸리티



```prompt
@converter.ts 에서 

this.baseUrl
this.currentClassId
this.currentLectureSlug
에서

'MarkdownConverter' 형식에 'baseUrl' 속성이 없습니다.
와 같은 에러들이 떠요
```

