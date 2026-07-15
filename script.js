//시작버튼과 입력창 변수에 담아두기
const startBtn = document.getElementById('start-btn');
const nicknameInput = document.getElementById('nickname-input');

//버튼을 눌렀을 때 실행될 동작
startBtn.addEventListener('click', function () {
    const nickname = nicknameInput.value.trim();

    if (nickname === '') {
        alert('닉네임을 입력해주세요!');
        return;
    }

    //브라우저에 닉네임 저장 (새로고침해도 유지됨)
    localStorage.setItem('nickname', nickname);

    //목록 화면으로 이동
    window.location.href = 'list.html';
});