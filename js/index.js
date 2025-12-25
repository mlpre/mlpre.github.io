const translations = {
    zh: {
        title: '闵立的个人网站',
        open: '开源项目',
        blog: '我的博客',
        language: 'EN'
    }, en: {
        title: 'Min Li\'s Personal Website',
        open: 'Open Source Projects',
        blog: 'My Blog',
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
    document.getElementById('title').innerText = content.title;
    document.getElementById('open').querySelector('span').innerText = content.open;
    document.getElementById('blog').querySelector('span').innerText = content.blog;
    document.getElementById('language').innerText = content.language;
    document.body.classList.add('loaded');
}

initLanguage();
