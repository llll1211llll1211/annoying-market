const myNickname = localStorage.getItem('nickname');
document.getElementById('my-nickname').textContent = myNickname;

let posts = []; // 서버에서 받아온 데이터를 담아둘 변수

// 화면에 카드를 그리는 함수 (기존과 동일)
function renderPosts(postsToShow) {
  const listContainer = document.getElementById('post-list');
  listContainer.innerHTML = '';

  postsToShow.forEach(function (post) {
  const card = document.createElement('div');
  card.className = 'post-card';

  const isMyPost = post.author === myNickname;
  const rejectedIds = JSON.parse(localStorage.getItem('rejectedPosts') || '[]');
  const alreadyRejected = rejectedIds.includes(post.id);
  let actionHTML = '';

    if (isMyPost) {
  // 본인 글: 상태 표시 + 수정/삭제를 같이 보여줌
  let statusHTML = '';

  if (post.status === '대기중') {
    statusHTML = `<span class="status-badge status-pending">대기중 (거절 ${post.rejectCount})</span>`;
  } else if (post.status === '승낙됨') {
    statusHTML = `<span class="status-badge status-accepted">승낙됨 (${post.acceptedBy})</span>`;
  } else if (post.status === '거절됨') {
    statusHTML = `<span class="status-badge status-rejected">거절됨</span>`;
  }

  actionHTML = `
    <div class="my-post-action">
      ${statusHTML}
      <div class="edit-delete-row">
        <span class="edit-link" data-action="edit" data-id="${post.id}">수정</span>
        <span class="edit-link" data-action="delete" data-id="${post.id}">삭제</span>
      </div>
    </div>
  `;
} else if (post.status === '대기중') {
  actionHTML = `
    <button class="accept-btn" data-id="${post.id}">승낙</button>
    <button class="reject-btn" data-id="${post.id}" ${alreadyRejected ? 'disabled' : ''}>거절 ${post.rejectCount}</button>
  `;
} else if (post.status === '승낙됨') {
  actionHTML = `<span class="status-badge status-accepted">승낙됨</span>`;
} else if (post.status === '거절됨') {
  actionHTML = `<span class="status-badge status-rejected">거절됨</span>`;
}

    card.innerHTML = `
      <div class="post-info" data-id="${post.id}">
        <p class="post-title">${post.title}</p>
        <p class="post-meta">${post.region} | ${post.category} | ${post.author} | ~${post.deadline}</p>
      </div>
      <div class="post-action">${actionHTML}</div>
    `;

    listContainer.appendChild(card);
  });
}

// 서버에서 목록을 새로 받아와서 화면에 그리는 함수
async function refreshPosts() {
  posts = await loadPosts();
  applyFilters();
}

// ===== 검색/필터 =====
const searchInput = document.getElementById('search-input');
const regionSelect = document.getElementById('region-select');
const categorySelect = document.getElementById('category-select');

function applyFilters() {
  const keyword = searchInput.value.trim();
  const selectedRegion = regionSelect.value;
  const selectedCategory = categorySelect.value;

  const filtered = posts.filter(function (post) {
    const matchKeyword = post.title.includes(keyword);
    const matchRegion = selectedRegion === '전체' || post.region === selectedRegion;
    const matchCategory = selectedCategory === '전체' || post.category === selectedCategory;
    return matchKeyword && matchRegion && matchCategory;
  });

  renderPosts(filtered);
}

searchInput.addEventListener('input', applyFilters);
regionSelect.addEventListener('change', applyFilters);
categorySelect.addEventListener('change', applyFilters);

// ===== 승낙/거절/수정/삭제/상세이동 =====
const postListContainer = document.getElementById('post-list');

postListContainer.addEventListener('click', async function (event) {
  const clickedElement = event.target;

  if (clickedElement.classList.contains('accept-btn')) {
    const postId = Number(clickedElement.dataset.id);
    await acceptPost(postId, myNickname);
    await refreshPosts();
    return;
  }

  if (clickedElement.classList.contains('reject-btn')) {
  const postId = Number(clickedElement.dataset.id);

  await rejectPost(postId);

  // 거절한 글 id를 브라우저에 기록해두기
  const rejectedIds = JSON.parse(localStorage.getItem('rejectedPosts') || '[]');
  rejectedIds.push(postId);
  localStorage.setItem('rejectedPosts', JSON.stringify(rejectedIds));

  await refreshPosts();
  return;
}

  if (clickedElement.dataset.action === 'edit') {
    const postId = Number(clickedElement.dataset.id);
    window.location.href = 'write.html?id=' + postId;
    return;
  }

  if (clickedElement.dataset.action === 'delete') {
    const postId = Number(clickedElement.dataset.id);
    const confirmed = confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;
    await deletePost(postId);
    await refreshPosts();
    return;
  }

  const postInfo = clickedElement.closest('.post-info');
  if (postInfo) {
    const postId = Number(postInfo.dataset.id);
    window.location.href = 'detail.html?id=' + postId;
  }
});

// ===== 글쓰기 버튼 =====
document.getElementById('write-btn').addEventListener('click', function () {
  window.location.href = 'write.html';
});

// ===== 처음 화면 열렸을 때 서버에서 데이터 받아오기 =====
refreshPosts();