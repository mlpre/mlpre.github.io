$(function () {
    $.ajax({
        url: 'json/ml-body.json',
        type: 'get',
        async: false,
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                showList(data[i].list, 'list_' + i);
                for (let j = 0; j < data[i].body.length; j++) {
                    showListBody(data[i].body[j].title, data[i].body[j].mdPath, 'list_' + i);
                }
            }
        }
    });
});

function showList(list, list_num) {
    $("#ml-list").append("<ul id=" + list_num + "><li onclick=showBody('" + list_num + "') class='ml-list'>" + list + "</li></ul>");
}

function showListBody(body, mdPath, list_num) {
    $("#" + list_num).append("<div onmouseover='addOpacity(this)' onmouseout='removeOpacity(this)' onclick=openBody('" + mdPath + "') class='ml-list-body'>" + body + "</div>");
    $("#ml-body").append("<div onmouseover='addOpacity(this)' onmouseout='removeOpacity(this)' onclick=openBody('" + mdPath + "') class='ml-body-link'>" + body + "</div>")
}

function showBody(list_num) {
    $("#" + list_num + ">div").toggle();
}

function openBody(mdPath) {
    $('#ml-body').html('');
    $.ajax({
        url: mdPath,
        type: 'get',
        async: false,
        success: function (data) {
            $('#ml-body').html(marked(data));
            $('code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
            window.scrollTo(0, 0);
        }
    })
}

function addOpacity(body) {
    $(body).addClass('ml-list-body-show');
}

function removeOpacity(body) {
    $(body).removeClass('ml-list-body-show');
}
