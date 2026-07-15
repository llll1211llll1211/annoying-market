const myNickname = localStorage.getItem('nickname');

//주소 끝에 붙어온 ?id=3 값을 읽어오는 부분
const params = new URLSearchParams(window.location.search);
const postId = Number(params.get('id'));

const posts = loadPosts();
const post = posts.find(function (p) { return p.id === postId; });

//화면에 글 내용 채워넣기
document.getElementById('detail-title').textContent = post.title;
document.getElementById('detail-meta').textContent =
    post.region + ' | ' + post.category + ' | ' + post.author;
document.getElementById('detail-content').textContent = post.content;

//뒤로가기 버튼
document.getElementById('back-btn').addEventListener('click', function () {
    window.location.href = 'list.html';
});

//댓글 목록을 화면에 그리는 함수
function renderComments() {
    const comments = loadComments();
    const thisPostComments = comments.filter(function (c) {
        return c.postId === postId;
    });

    const commentListEl = document.getElementById('comment-list');
    commentListEl.innerHTML = '';

    thisPostComments.forEach(function (comment) {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment-item';
        commentEl.innerHTML = `
      <p class="comment-author">${comment.author}</p>
      <p class="comment-content">${comment.content}</p>
    `;
        commentListEl.appendChild(commentEl);
    });
}

renderComments(); //페이지 열리자마자 한 번 그리기

//댓글 등록 버튼
document.getElementById('comment-submit-btn').addEventListener('click', function () {
    const content = document.getElementById('comment-input').value.trim();

    if (content === '') {
        alert('댓글 내용을 입력해주세요!');
        return;
    }

    const comments = loadComments();

    const newComment = {
        id: getNextCommentId(comments),
        postId: postId,
        author: myNickname,
        content: content
    };

    comments.push(newComment);
    saveComments(comments);

    document.getElementById('comment-input').value = ''; //입력창 비우기
    renderComments(); //댓글 목록 다시 그리기
});