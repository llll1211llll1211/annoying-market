const myNickname = localStorage.getItem('nickname');

const params = new URLSearchParams(window.location.search);
const editId = params.get('id') ? Number(params.get('id')) : null;

// 수정 모드라면, 서버에서 기존 글 내용을 받아와서 입력창에 채워넣기
async function initForm() {
  if (editId) {
    const existingPost = await loadPost(editId);

    document.getElementById('title-input').value = existingPost.title;
    document.getElementById('content-input').value = existingPost.content;
    document.getElementById('region-input').value = existingPost.region;
    document.getElementById('category-input').value = existingPost.category;
    document.getElementById('deadline-input').value = existingPost.deadline;

    document.querySelector('.write-header h2').textContent = '글 수정';
    document.getElementById('submit-btn').textContent = '수정하기';
  }
}

initForm();

// 뒤로가기 버튼
document.getElementById('back-btn').addEventListener('click', function () {
  window.location.href = 'list.html';
});

// 등록하기 / 수정하기 버튼
document.getElementById('submit-btn').addEventListener('click', async function () {
  const title = document.getElementById('title-input').value.trim();
  const content = document.getElementById('content-input').value.trim();
  const region = document.getElementById('region-input').value;
  const category = document.getElementById('category-input').value;
  const deadline = document.getElementById('deadline-input').value;

  if (title === '' || content === '' || deadline === '') {
    alert('제목, 본문, 마감일을 모두 입력해주세요!');
    return;
  }

  const postData = {
    title: title,
    content: content,
    region: region,
    category: category,
    deadline: deadline
  };

  if (editId) {
    // 수정 모드: 서버에 수정 요청
    await editPost(editId, postData);
  } else {
    // 새 글 모드: author 추가해서 서버에 등록 요청
    postData.author = myNickname;
    await createPost(postData);
  }

  window.location.href = 'list.html';
});