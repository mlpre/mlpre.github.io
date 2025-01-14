function chat() {
    const chat_input = document.getElementById('chat-input');
    const chat_box = document.getElementById('chat-box');
    const message = chat_input.value.trim();
    if (message) {
        chat_box.innerHTML += `<div><strong>ME: </strong>${message}</div>`;
        chat_input.value = '';
        const source = new EventSource(`https://ai.minli.cc?chat=${encodeURIComponent(message)}`);
        chat_box.innerHTML += `<strong>AI: </strong>`;
        source.onmessage = function (event) {
            chat_box.innerHTML += JSON.parse(event.data).response;
            chat_box.scrollTop = chat_box.scrollHeight;
        }
        source.onerror = function (event) {
            source.close();
        }
    }
}
