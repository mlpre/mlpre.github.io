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
            const data = JSON.parse(event.data);
            chat_box.innerHTML += data.response || '';
            chat_box.scrollTop = chat_box.scrollHeight;
        }
        source.onerror = function (event) {
            source.close();
        }
    }
}

const translations = {
    zh: {
        title: '闵立的个人网站',
        ml_title: '闵立的个人网站',
        ml_open: '开源项目',
        ml_blog: '我的博客',
        chat_input: '中文讲个笑话',
        chat_button: '发送',
        language: 'EN'
    }, en: {
        title: 'Min Li\'s Personal Website',
        ml_title: 'Min Li\'s Personal Website',
        ml_open: 'Open Source Projects',
        ml_blog: 'My Blog',
        chat_input: 'Tell me a joke in English',
        chat_button: 'Send',
        language: 'ZH'
    }
};

function initLanguage() {
    const language = (localStorage.getItem('language') || navigator.language).startsWith('zh') ? 'zh' : 'en';
    loadLanguage(language);
}

function switchLanguage() {
    const language = localStorage.getItem('language') || 'zh';
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    localStorage.setItem('language', newLanguage);
    loadLanguage(newLanguage);
}

function loadLanguage(language) {
    const content = translations[language];
    document.title = content.title;
    document.getElementById('ml-title').innerText = content.ml_title;
    document.getElementById('ml-open').querySelector('span').innerText = content.ml_open;
    document.getElementById('ml-blog').querySelector('span').innerText = content.ml_blog;
    document.getElementById('chat-input').value = content.chat_input;
    document.getElementById('chat-button').innerText = content.chat_button;
    document.getElementById('language').innerText = content.language;
    document.body.classList.add('loaded');
}

initLanguage();
