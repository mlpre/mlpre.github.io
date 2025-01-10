function chat() {
    const chat_input = document.getElementById('chat-input');
    const chat_box = document.getElementById('chat-box');
    const message = chat_input.value.trim();
    if (message) {
        chat_box.innerHTML += `<div><strong>你:</strong> ${message}</div>`;
        chat_input.value = '';
        fetch(`https://ai.minli.cc?chat=${encodeURIComponent(message)}`)
            .then(response => response.json())
            .then(data => {
                chat_box.innerHTML += `<div><strong>AI:</strong> ${data.response}</div>`;
                chat_box.scrollTop = chat_box.scrollHeight;
            })
            .catch(() => {
                chat_box.innerHTML += `<div><strong>AI:</strong> 出错了！</div>`;
            });
    }
}
