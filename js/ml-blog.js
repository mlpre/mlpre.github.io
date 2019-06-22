$(function () {
    $.ajax({
        url: 'json/ml-body.json',
        type: 'get',
        async: false,
        success: function (data) {
            for (var i = 0; i < data.technology.length; i++) {
                if (data.technology[i].mdPath != '') {
                    var list_num = 'list_';
                    showList(data.technology[i].list, list_num + i);
                    for (var j = 0; j < data.technology[i].body.length; j++) {
                        showListBody(data.technology[i].body[j].title, data.technology[i].body[j].mdPath, list_num + i);
                    }
                }
            }
            $.ajax({
                url: data.top.mdPath,
                type: 'get',
                async: false,
                success: function (data) {
                    $('#ml-body').html(marked(data));
                    $('code').each(function (i, block) {
                        hljs.highlightBlock(block);
                    });
                }
            })
        }
    });
});

function showList(list, list_num) {
    $("#ml-list").append("<ul id=" + list_num + "><li onclick=showBody('" + list_num + "') class='ml-list'>" + list + "</li></ul>");
}

function showListBody(body, mdPath, list_num) {
    $("#" + list_num).append("<div onmouseover='addOpacity(this)' onmouseout='removeOpacity(this)' onclick=openBody('" + mdPath + "') class='ml-list-body'>" + body + "</div>");
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
        }
    })
}

function addOpacity(body) {
    $(body).addClass('ml-list-body-show');
}

function removeOpacity(body) {
    $(body).removeClass('ml-list-body-show');
}
