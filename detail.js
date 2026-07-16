const myNickname = localStorage.getItem('nickname');

const params = new URLSearchParams(window.location.search);
const postId = Number(params.get('id'));

// 화면에 글 내용 채워넣기
async function initDetail() {
  const post = await loadPost(postId);

  document.getElementById('detail-title').textContent = post.title;
  document.getElementById('detail-meta').textContent =
    post.region + ' | ' + post.category + ' | ' + post.author;
  document.getElementById('detail-content').textContent = post.content;
}

initDetail();

// 뒤로가기 버튼
document.getElementById('back-btn').addEventListener('click', function () {
  window.location.href = 'list.html';
});

// 댓글 목록을 화면에 그리는 함수
async function renderComments() {
  const comments = await loadComments(postId);

  const commentListEl = document.getElementById('comment-list');
  commentListEl.innerHTML = '';

  comments.forEach(function (comment) {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment-item';
    commentEl.innerHTML = `
      <p class="comment-author">${comment.author}</p>
      <p class="comment-content">${comment.content}</p>
    `;
    commentListEl.appendChild(commentEl);
  });
}

renderComments();

// 댓글 등록 버튼
document.getElementById('comment-submit-btn').addEventListener('click', async function () {
  const content = document.getElementById('comment-input').value.trim();

  if (content === '') {
    alert('댓글 내용을 입력해주세요!');
    return;
  }

  await createComment(postId, {
    author: myNickname,
    content: content
  });

  document.getElementById('comment-input').value = '';
  await renderComments();
});