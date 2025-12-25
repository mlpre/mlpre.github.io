const translations = {
    zh: {
        title: '闵立的个人网站',
        ml_title: '闵立的个人网站',
        ml_open: '开源项目',
        ml_blog: '我的博客',
        language: 'EN'
    }, en: {
        title: 'Min Li\'s Personal Website',
        ml_title: 'Min Li\'s Personal Website',
        ml_open: 'Open Source Projects',
        ml_blog: 'My Blog',
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
    document.getElementById('language').innerText = content.language;
    document.body.classList.add('loaded');
}

initLanguage();
