#!/bin/bash
# [syntax] ./publish.sh patch|minor|major
# default: patch

PLUGIN_DIR="/Users/moon/JnJ-soft/Obsidian/liveSync/dev/.obsidian/plugins/jop-class101"
# ex) PLUGIN_DIR="/Users/moon/JnJ-soft/Obsidian/liveSync/dev/.obsidian/plugins/jop-web"

# 플러그인 디렉토리가 없으면 생성
if [ ! -d "$PLUGIN_DIR" ]; then
  mkdir -p "$PLUGIN_DIR"
fi

mode="patch"
commit_msg="chore: build for publish"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m)
            commit_msg="$2"
            shift 2
            ;;
        patch|minor|major)
            mode="$1"
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# 1. git pull 먼저 실행하여 원격 변경사항 가져오기
git pull && \
# 2. 빌드
npm run build && \
# 3. 변경사항 커밋
git add . && \
git commit -m "$commit_msg" && \
# 4. git push
git push --follow-tags && \
# 5. npm 버전 업데이트 (이때 자동으로 버전 태그가 생성됨)
npm version $mode && \
# 6. package.json의 버전을 manifest.json에 적용
version=$(node -p "require('./package.json').version") && \
node -e "
  const fs = require('fs');
  const manifest = require('./dist/manifest.json');
  manifest.version = '$version';
  fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
" && \

# 7. obsidian 플러그인 배포
cp -R dist/* "$PLUGIN_DIR/"