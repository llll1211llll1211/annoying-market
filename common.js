const initialPosts = [
    { id: 1, title: "이삿짐 정리하고 나온 빈 박스들 1층에 버려주세요", content: "박스가 많아서 혼자 옮기기 힘드네요", region: "본관동", category: "조립/설치", author: "닉네임1", status: "대기중", acceptedBy: null, rejectCount: 0, deadline: "2026-07-20" },
    { id: 2, title: "팝업스토어 줄 대신 서주실분 구합니다", content: "오전 9시부터 줄 서주실 분 구해요", region: "별관동", category: "심부름/대행", author: "닉네임3", status: "대기중", acceptedBy: null, rejectCount: 0, deadline: "2026-08-01" },
    { id: 3, title: "택배 좀 대신 찾아주세요", content: "경비실에 택배가 와 있는데 오늘 밤 11시는 되어야 집에 갈 것 같습니다. 문 앞에 놔주실 분 구합니다. 사례는 대충 5000원권 드릴 수 있습니다.", region: "1공학관", category: "돌봄/동행", author: "닉네임3", status: "승낙됨", acceptedBy: "닉네임10", rejectCount: 0, deadline: "2026-07-15" },
    { id: 4, title: "다이소에서 수납함 사다주세요", content: "3단짜리 수납함 사다주실 분", region: "2공학관", category: "심부름/대행", author: "닉네임4", status: "거절됨", acceptedBy: null, rejectCount: 12, deadline: "2026-07-15" },
    { id: 5, title: "방 청소 부탁드려요", content: "방이 너무 지저분해서 도움이 필요해요", region: "3공학관", category: "청소/정리", author: "닉네임5", status: "거절됨", acceptedBy: null, rejectCount: 6, deadline: "2026-07-12" },
    { id: 6, title: "고양이 밥 주고 가주세요", content: "여행 가는 동안 고양이 밥 좀 부탁드려요", region: "정문", category: "돌봄/동행", author: "닉네임2", status: "대기중", acceptedBy: null, rejectCount: 0, deadline: "2026-07-18" },
    { id: 7, title: "무거운 가구 옮겨주세요", content: "책상이 너무 무거워서 혼자 못 옮겨요", region: "인문경영관", category: "조립/설치", author: "닉네임6", status: "대기중", acceptedBy: null, rejectCount: 1, deadline: "2026-07-19" },
    { id: 8, title: "저녁에 대신 장 좀 봐주세요", content: "편의점에서 몇 가지만 사다주시면 됩니다", region: "다산정보관", category: "배달/장보기", author: "닉네임7", status: "대기중", acceptedBy: null, rejectCount: 0, deadline: "2026-07-17" },
    { id: 9, title: "화장실 청소 도와주세요", content: "공용 화장실 청소 같이 해주실 분", region: "미래학습관", category: "청소/정리", author: "닉네임8", status: "대기중", acceptedBy: null, rejectCount: 2, deadline: "2026-07-16" },
    { id: 10, title: "우편물 대신 받아주세요", content: "낮 동안 집에 없어서 우편물 좀 받아주세요", region: "복지관", category: "심부름/대행", author: "닉네임9", status: "대기중", acceptedBy: null, rejectCount: 0, deadline: "2026-07-16" }
];

function loadPosts() {
    const saved = localStorage.getItem('posts');
    if (saved) {
        return JSON.parse(saved);
    } else {
        localStorage.setItem('posts', JSON.stringify(initialPosts));
        return initialPosts;
    }
}

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

//새 글에 매길 id를 계산하는 함수 (기존 글 중 가장 큰 id + 1)
function getNextId(posts) {
    if (posts.length === 0) return 1;
    const maxId = Math.max(...posts.map(function (p) { return p.id; }));
    return maxId + 1;
}

//댓글 불러오기
function loadComments() {
    const saved = localStorage.getItem('comments');
    if (saved) {
        return JSON.parse(saved);
    } else {
        localStorage.setItem('comments', JSON.stringify([]));
        return [];
    }
}

//댓글 저장하기
function saveComments(comments) {
    localStorage.setItem('comments', JSON.stringify(comments));
}

//댓글에 매길 다음 id 계산
function getNextCommentId(comments) {
    if (comments.length === 0) return 1;
    const maxId = Math.max(...comments.map(function (c) { return c.id; }));
    return maxId + 1;
}