// ============================================
// 귀찮음 거래소 백엔드 서버
// 실행 방법: node server.js
// ============================================

const express = require("express");
const cors = require("cors");

const app = express();

// PORT: 배포 환경(Render)에서는 자동으로 주어지고, 내 컴퓨터에서는 4000번 사용
const PORT = process.env.PORT || 4000;

// ----- 기본 설정 -----
app.use(cors()); // 프론트(vercel)에서 이 서버를 호출할 수 있게 허용
app.use(express.json()); // 요청 body의 JSON을 읽을 수 있게 함

// ----- 허용되는 지역 / 카테고리 목록 -----
const REGIONS = [
  "본관동", "별관동", "1공학관", "2공학관", "3공학관",
  "담헌실학관", "인문경영관", "다산정보관", "미래학습관",
  "복지관", "학생회관", "정문", "후문",
];

const CATEGORIES = ["조립/설치", "청소/정리", "배달/장보기", "돌봄/동행", "심부름/대행"];

// 거절이 이 횟수 이상 쌓이면 자동으로 "거절됨" 처리
const REJECT_LIMIT = 5;

// ============================================
// 데이터 저장소 (서버 메모리에 저장)
// 서버가 재시작되면 초기 데이터로 돌아갑니다.
// ============================================
let posts = [
  {
    id: 1,
    title: "이삿짐 정리하고 나온 빈 박스들 1층에 버려주세요",
    content: "박스가 5개 정도 있습니다. 문 앞에 내놓을게요!",
    region: "1공학관",
    category: "조립/설치",
    author: "닉네임1",
    status: "대기중",
    acceptedBy: null,
    rejectCount: 0,
    deadline: "2026-07-20",
  },
  {
    id: 2,
    title: "택배 좀 대신 찾아주세요",
    content:
      "경비실에 택배가 와 있는데 제가 오늘 밤 11시는 되어야 집에 갈 것 같습니다...\n경비실에서 택배 찾아서 저희 집 문 앞에 놔주실 분 구합니다\n사례는 대즐 5000원권 드릴 수 있습니다",
    region: "학생회관",
    category: "심부름/대행",
    author: "닉네임3",
    status: "승낙됨",
    acceptedBy: "닉네임10",
    rejectCount: 0,
    deadline: "2026-07-15",
  },
];

let comments = [
  {
    id: 1,
    postId: 2,
    author: "닉네임10",
    content: "제가 마침 근처라 바로 도와드릴 수 있습니다! 호수랑 이름 뭐라고 쓰면 될까요?",
    createdAt: "2026-07-15 20:10",
  },
];

// 새 글/댓글에 붙일 id (기존 데이터 다음 번호부터 시작)
let nextPostId = 3;
let nextCommentId = 2;

// 현재 시간을 "2026-07-16 21:30" 형태의 문자로 만들어주는 함수 (한국 시간 기준)
function nowString() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000); // UTC → 한국 시간
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(
    now.getUTCDate()
  )} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`;
}

// id로 글을 찾아주는 함수 (없으면 undefined)
function findPost(id) {
  return posts.find((p) => p.id === Number(id));
}

// ============================================
// API 1. GET /posts — 전체 글 목록
// ============================================
app.get("/posts", (req, res) => {
  res.json(posts);
});

// ============================================
// API 2. POST /posts — 글 등록
// body: { title, content, region, category, author, deadline }
// ============================================
app.post("/posts", (req, res) => {
  const { title, content, region, category, author, deadline } = req.body;

  // 필수 값 확인
  if (!title || !content || !region || !category || !author || !deadline) {
    return res.status(400).json({ message: "필수 항목이 빠졌습니다." });
  }
  if (!REGIONS.includes(region)) {
    return res.status(400).json({ message: "올바르지 않은 지역입니다." });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "올바르지 않은 카테고리입니다." });
  }

  const newPost = {
    id: nextPostId++,
    title,
    content,
    region,
    category,
    author,
    status: "대기중",
    acceptedBy: null,
    rejectCount: 0,
    deadline,
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// ============================================
// API 3. GET /posts/:id — 글 하나 상세
// ============================================
app.get("/posts/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "글을 찾을 수 없습니다." });
  }
  res.json(post);
});

// ============================================
// API 4. PATCH /posts/:id — 글 수정
// body에 온 항목만 골라서 수정 (title, content, region, category, deadline)
// ============================================
app.patch("/posts/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "글을 찾을 수 없습니다." });
  }

  const { title, content, region, category, deadline } = req.body;

  if (region !== undefined && !REGIONS.includes(region)) {
    return res.status(400).json({ message: "올바르지 않은 지역입니다." });
  }
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return res.status(400).json({ message: "올바르지 않은 카테고리입니다." });
  }

  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (region !== undefined) post.region = region;
  if (category !== undefined) post.category = category;
  if (deadline !== undefined) post.deadline = deadline;

  res.json(post);
});

// ============================================
// API 5. DELETE /posts/:id — 글 삭제 (달린 댓글도 같이 삭제)
// ============================================
app.delete("/posts/:id", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "글을 찾을 수 없습니다." });
  }

  posts = posts.filter((p) => p.id !== post.id);
  comments = comments.filter((c) => c.postId !== post.id);

  res.json({ message: "삭제되었습니다.", id: post.id });
});

// ============================================
// API 6. PATCH /posts/:id/accept — 승낙
// body: { acceptedBy }
// ============================================
app.patch("/posts/:id/accept", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "글을 찾을 수 없습니다." });
  }

  const { acceptedBy } = req.body;
  if (!acceptedBy) {
    return res.status(400).json({ message: "acceptedBy가 필요합니다." });
  }

  // 이미 처리된 글은 승낙할 수 없음
  if (post.status !== "대기중") {
    return res.status(400).json({ message: `이미 ${post.status} 상태의 글입니다.` });
  }

  post.status = "승낙됨";
  post.acceptedBy = acceptedBy;

  res.json(post);
});

// ============================================
// API 7. PATCH /posts/:id/reject — 거절
// body 없음. rejectCount +1, 5 이상이면 자동으로 "거절됨"
// ============================================
app.patch("/posts/:id/reject", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "글을 찾을 수 없습니다." });
  }

  // 이미 처리된 글은 거절할 수 없음
  if (post.status !== "대기중") {
    return res.status(400).json({ message: `이미 ${post.status} 상태의 글입니다.` });
  }

  post.rejectCount += 1;

  // 핵심 로직: 거절 5회 이상이면 자동으로 거절됨 처리
  if (post.rejectCount >= REJECT_LIMIT) {
    post.status = "거절됨";
  }

  res.json(post);
});

// ============================================
// API 8. GET /posts/:id/comments — 댓글 목록
// ============================================
app.get("/posts/:id/comments", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "글을 찾을 수 없습니다." });
  }

  const postComments = comments.filter((c) => c.postId === post.id);
  res.json(postComments);
});

// ============================================
// API 9. POST /posts/:id/comments — 댓글 작성
// body: { author, content }
// ============================================
app.post("/posts/:id/comments", (req, res) => {
  const post = findPost(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "글을 찾을 수 없습니다." });
  }

  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ message: "author와 content가 필요합니다." });
  }

  const newComment = {
    id: nextCommentId++,
    postId: post.id,
    author,
    content,
    createdAt: nowString(),
  };

  comments.push(newComment);
  res.status(201).json(newComment);
});

// ----- 서버가 살아있는지 확인용 -----
app.get("/", (req, res) => {
  res.json({ message: "귀찮음 거래소 서버가 실행 중입니다!" });
});

// ----- 서버 시작 -----
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
