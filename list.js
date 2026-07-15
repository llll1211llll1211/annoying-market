let posts = loadPosts();

//내 닉네임 가져오기
const myNickname = localStorage.getItem('nickname');
document.getElementById('my-nickname').textContent = myNickname;

//카드 화면에 그리는 함수
function renderPosts(postsToShow) {
    const listContainer = document.getElementById('post-list');
    listContainer.innerHTML = ''; //기존에 그려진 카드들을 지움(다시 그리기 위해)

    postsToShow.forEach(function (post) {
        const card = document.createElement('div');
        card.className = 'post-card';

        //이 글이 내가 쓴 글인지 확인
        const isMyPost = post.author === myNickname;

        //상태에 따라 오른쪽에 보여줄 버튼/표시를 다르게 만듦
        let actionHTML = '';

        if (isMyPost) {
            actionHTML = `
              <span class="edit-link" data-action="edit" data-id="${post.id}">수정</span>
              <span class="edit-link" data-action="delete" data-id="${post.id}">삭제</span>
            `;
        } else if (post.status === '대기중') {
            actionHTML = `
        <button class="accept-btn" data-id="${post.id}">승낙</button>
        <button class="reject-btn" data-id="${post.id}">거절 ${post.rejectCount}</button>
      `;
        } else if (post.status === '승낙됨') {
            actionHTML = `<span class="status-badge status-accepted">승낙됨</span>`;
        } else if (post.status === '거절됨') {
            actionHTML = `<span class="status-badge status-rejected">거절됨</span>`;
        }

        //카드 안에 들어갈 전체 내용 작성
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

//처음 화면 열렸을 때 전체 데이터로 한 번 그리기
renderPosts(posts);

//검색창, 지역 선택, 카테고리 선택을 각각 변수에 담아두기
const searchInput = document.getElementById('search-input');
const regionSelect = document.getElementById('region-select');
const categorySelect = document.getElementById('category-select');

//조건에 맞는 글만 걸러서 다시 그리는 함수
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

//검색창에 글자를 입력할 때마다 실행
searchInput.addEventListener('input', applyFilters);

//지역 선택을 바꿀 때마다 실행
regionSelect.addEventListener('change', applyFilters);

//카테고리 선택을 바꿀 때마다 실행
categorySelect.addEventListener('change', applyFilters);

const postListContainer = document.getElementById('post-list');

postListContainer.addEventListener('click', function (event) {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('accept-btn')) {
        const postId = Number(clickedElement.dataset.id);
        handleAccept(postId);
        return;
    }

    if (clickedElement.classList.contains('reject-btn')) {
        const postId = Number(clickedElement.dataset.id);
        handleReject(postId);
        return;
    }

    // 수정 클릭했을 때 (새로 추가)
    if (clickedElement.dataset.action === 'edit') {
        const postId = Number(clickedElement.dataset.id);
        window.location.href = 'write.html?id=' + postId;
        return;
    }

    // 삭제 클릭했을 때 (새로 추가)
    if (clickedElement.dataset.action === 'delete') {
        const postId = Number(clickedElement.dataset.id);
        handleDelete(postId);
        return;
    }

    const postInfo = clickedElement.closest('.post-info');
    if (postInfo) {
        const postId = Number(postInfo.dataset.id);
        window.location.href = 'detail.html?id=' + postId;
    }
});

//승낙 처리 함수
function handleAccept(postId) {
    const post = posts.find(function (p) { return p.id === postId; });
    post.status = '승낙됨';
    post.acceptedBy = myNickname;
    savePosts(posts);
    applyFilters(); //화면 다시 그리기(지금 걸려있는 필터 조건 유지한 채로)
}

//거절 처리 함수
function handleReject(postId) {
    const post = posts.find(function (p) { return p.id === postId; });
    post.rejectCount = post.rejectCount + 1;

    if (post.rejectCount >= 5) {
        post.status = '거절됨';
    }

    savePosts(posts);
    applyFilters();
}

function handleDelete(postId) {
    const confirmed = confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return; // 사용자가 "취소"를 누르면 여기서 함수 종료

    posts = posts.filter(function (p) { return p.id !== postId; });
    savePosts(posts);
    applyFilters();
}

document.getElementById('write-btn').addEventListener('click', function () {
    window.location.href = 'write.html';
});