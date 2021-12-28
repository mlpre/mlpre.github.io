let ajax = new XMLHttpRequest();

window.onload = function () {
    ajax.open('get', "json/ml-body.json", false);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            let data = JSON.parse(ajax.responseText);
            for (let i = 0; i < data.length; i++) {
                showList(data[i].list, 'list_' + i);
                for (let j = 0; j < data[i].body.length; j++) {
                    showListBody(data[i].body[j].title, data[i].body[j].mdPath, data[i].body[j].show, 'list_' + i);
                }
            }
        }
    };
    ajax.send(null);
};

function showList(list, list_num) {
    document.querySelector('#ml-list').innerHTML += "<ul id=" + list_num + "><li onclick=showBody('" + list_num + "') class='ml-list'>" + list + "</li></ul>";
}

function showListBody(body, mdPath, show, list_num) {
    document.querySelector('#' + list_num).innerHTML += "<div onmouseover='opacity(this)' onmouseout='opacity(this)' onclick=openBody('" + mdPath + "') class='ml-list-body'>" + body + "</div>";
    if (show) {
        document.querySelector('#ml-body').innerHTML += "<div onmouseover='opacity(this)' onmouseout='opacity(this)' onclick=openBody('" + mdPath + "') class='ml-body-link'>" + body + "</div>";
    }
}

function showBody(list_num) {
    let body = document.querySelectorAll('#' + list_num + '>div');
    for (let i = 0; i < body.length; i++) {
        if (body[i].style.display == 'block') {
            body[i].style.display = 'none';
        } else {
            body[i].style.display = 'block';
        }
    }
}

function openBody(mdPath) {
    document.querySelector('#ml-body').innerHTML = '';
    ajax.open('get', mdPath, false);
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            let data = ajax.responseText;
            document.querySelector('#ml-body').innerHTML = marked.parse(data);
            let code = document.querySelectorAll('code');
            for (let i = 0; i < code.length; i++) {
                hljs.highlightBlock(code[i]);
            }
            window.scrollTo(0, 0);
        }
    };
    ajax.send(null);
}

function opacity(body) {
    body.classList.toggle('ml-list-body-show');
}
