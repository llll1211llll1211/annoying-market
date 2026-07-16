const API_BASE = 'https://annoying-market-server.onrender.com';

// ===== 글(post) 관련 =====

// 전체 글 목록 가져오기
async function loadPosts() {
  const response = await fetch(API_BASE + '/posts');
  return await response.json();
}

// 글 하나 상세 가져오기
async function loadPost(id) {
  const response = await fetch(API_BASE + '/posts/' + id);
  return await response.json();
}

// 새 글 등록
async function createPost(postData) {
  const response = await fetch(API_BASE + '/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return await response.json();
}

// 글 수정
async function editPost(id, postData) {
  const response = await fetch(API_BASE + '/posts/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return await response.json();
}

// 글 삭제
async function deletePost(id) {
  await fetch(API_BASE + '/posts/' + id, {
    method: 'DELETE'
  });
}

// 승낙 처리
async function acceptPost(id, acceptedBy) {
  const response = await fetch(API_BASE + '/posts/' + id + '/accept', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ acceptedBy: acceptedBy })
  });
  return await response.json();
}

// 거절 처리
async function rejectPost(id) {
  const response = await fetch(API_BASE + '/posts/' + id + '/reject', {
    method: 'PATCH'
  });
  return await response.json();
}

// ===== 댓글(comment) 관련 =====

// 댓글 목록 가져오기
async function loadComments(postId) {
  const response = await fetch(API_BASE + '/posts/' + postId + '/comments');
  return await response.json();
}

// 댓글 작성
async function createComment(postId, commentData) {
  const response = await fetch(API_BASE + '/posts/' + postId + '/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData)
  });
  return await response.json();
}