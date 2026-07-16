# 귀찮음 거래소 — 백엔드 서버

Express로 만든 귀찮음 거래소 API 서버입니다.

## 내 컴퓨터에서 실행하기

1. Node.js가 없다면 https://nodejs.org 에서 LTS 버전 설치
2. 이 폴더에서 터미널(명령 프롬프트)을 열고:

```bash
npm install
node server.js
```

3. 브라우저에서 `http://localhost:4000/posts` 를 열었을 때 글 목록(JSON)이 보이면 성공

## API 목록

| 메소드 | 주소 | 설명 |
|---|---|---|
| GET | /posts | 전체 글 목록 |
| POST | /posts | 글 등록 |
| GET | /posts/:id | 글 상세 |
| PATCH | /posts/:id | 글 수정 |
| DELETE | /posts/:id | 글 삭제 |
| PATCH | /posts/:id/accept | 승낙 (body: acceptedBy) |
| PATCH | /posts/:id/reject | 거절 (5회 이상 시 자동 "거절됨") |
| GET | /posts/:id/comments | 댓글 목록 |
| POST | /posts/:id/comments | 댓글 작성 (body: author, content) |

## Render로 배포하기 (무료)

1. 이 프로젝트를 깃헙 레포에 올린다
2. https://render.com 에서 깃헙 계정으로 가입
3. **New → Web Service** 클릭 → 깃헙 레포 연결
4. 설정:
   - Language: **Node**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: **Free**
5. **Deploy** 클릭 → 몇 분 뒤 `https://xxxx.onrender.com` 주소가 생김
6. `https://xxxx.onrender.com/posts` 열어서 글 목록 보이면 배포 성공
7. 이 주소를 프론트 팀원에게 전달

## 알아둘 점

- 데이터는 서버 메모리에 저장됩니다. **서버가 재시작되면 초기 데이터로 돌아갑니다.** (아이디어톤 시연용으로는 충분)
- Render 무료 플랜은 15분간 요청이 없으면 잠들었다가, 다음 요청 때 깨어나는 데 30초~1분 걸립니다. **시연 직전에 미리 한 번 접속해서 깨워두세요.**
