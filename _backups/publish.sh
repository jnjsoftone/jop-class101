#!/bin/bash
# [syntax] ./publish.sh patch|minor|major
# default: patch

mode=${1:-patch}
PLUGIN_DIR="{{OBSIDIAN_VAULT_ROOT}}/.obsidian/plugins/{{name}}"
# ex) PLUGIN_DIR="/Users/moon/JnJ-soft/Obsidian/liveSync/dev/.obsidian/plugins/jop-web"

# 플러그인 디렉토리가 없으면 생성
if [ ! -d "$PLUGIN_DIR" ]; then
  mkdir -p "$PLUGIN_DIR"
fi

# 1. 빌드
yarn build && \
# 2. git 변경사항 커밋
git add . && \
git commit -m "chore: build for publish to obsidian" && \
# 3. npm 버전 업데이트 (이때 자동으로 버전 태그가 생성됨)
npm version $mode && \
# 4. package.json의 버전을 manifest.json에 적용
version=$(node -p "require('./package.json').version") && \
node -e "
  const fs = require('fs');
  const manifest = require('./public/manifest.json');
  manifest.version = '$version';
  fs.writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
" && \
# 5. git push
git push --follow-tags && \
# . obsidian 플러그인 배포
# cp -R dist/* {{vault_root}}/.obsidian/plugins/{{name}}/
cp -R dist/* "$PLUGIN_DIR/"