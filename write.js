const myNickname = localStorage.getItem('nickname');

// 주소에서 id 읽어오기 (없으면 null)
const params = new URLSearchParams(window.location.search);
const editId = params.get('id') ? Number(params.get('id')) : null;

const posts = loadPosts();

// 수정 모드라면, 기존 글 내용을 입력창에 미리 채워넣기
if (editId) {
    const existingPost = posts.find(function (p) { return p.id === editId; });

    document.getElementById('title-input').value = existingPost.title;
    document.getElementById('content-input').value = existingPost.content;
    document.getElementById('region-input').value = existingPost.region;
    document.getElementById('category-input').value = existingPost.category;
    document.getElementById('deadline-input').value = existingPost.deadline;

    // 화면 제목도 "글쓰기"에서 "글 수정"으로 바꿔주기
    document.querySelector('.write-header h2').textContent = '글 수정';
    document.getElementById('submit-btn').textContent = '수정하기';
}

// 뒤로가기 버튼
document.getElementById('back-btn').addEventListener('click', function () {
    window.location.href = 'list.html';
});

// 등록하기 / 수정하기 버튼
document.getElementById('submit-btn').addEventListener('click', function () {
    const title = document.getElementById('title-input').value.trim();
    const content = document.getElementById('content-input').value.trim();
    const region = document.getElementById('region-input').value;
    const category = document.getElementById('category-input').value;
    const deadline = document.getElementById('deadline-input').value;

    if (title === '' || content === '' || deadline === '') {
        alert('제목, 본문, 마감일을 모두 입력해주세요!');
        return;
    }

    if (editId) {
        // 수정 모드: 기존 글을 찾아서 값만 바꿔치기
        const existingPost = posts.find(function (p) { return p.id === editId; });
        existingPost.title = title;
        existingPost.content = content;
        existingPost.region = region;
        existingPost.category = category;
        existingPost.deadline = deadline;
    } else {
        // 새 글 모드: 새로운 글 추가
        const newPost = {
            id: getNextId(posts),
            title: title,
            content: content,
            region: region,
            category: category,
            author: myNickname,
            status: '대기중',
            acceptedBy: null,
            rejectCount: 0,
            deadline: deadline
        };
        posts.push(newPost);
    }

    savePosts(posts);
    window.location.href = 'list.html';
});