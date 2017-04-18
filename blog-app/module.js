'use strict';
var Handle = function() {
    var $ = jQuery,
        reg = /\"{(.*?)}\"/g,
        //存放abadata与文本的数组
        list = [],
        //获取所有dom转换为string，去除转移符
        outerhtml = '',
        p_reg = /abtext/gi,
        text_reg = /abtext(.*?)<\/p><\/div>/gi,
        //生成的dom字符串，可以直接在页面渲染
        Html_string = '',
        topicDomString = "",
        //提取abdata信息，文本信息。转换为json对象依次放入数组list
        getDataArray = function(outerhtml_arg) {
            var outerhtml_array = outerhtml_arg.split(/abtype/i);
            for (var i in outerhtml_array) {
                var array_handle = outerhtml_array[i].match(reg);
                if (outerhtml_array[i].indexOf('abtext') > 0) {
                    var text_content = outerhtml_array[i].replace(/[\r\n]/g, '').match(text_reg);
                    var text = text_content[0].replace(/abtext\">/gi, '').replace(/<\/p><\/div>/gi, '');
                    list.push(text);
                }
                if (array_handle) {
                    list.push(array_handle[0].replace(' ', ''));
                }

            }
        },
        // if img size null
        getSize = function(size) {
            if (typeof(size) == 'undefined' || size == '') {
                return "";
            } else {
                return size;
            }
        },
        getScreenWidth = function(width, height) {
            var screenWitdh = window.screen.width - 30;
            var scale = screenWitdh / width;
            var size_array = [screenWitdh, height * scale];
            return size_array;
        },
        //初始化事件
        initEvent = function(info) {
            //关注状态事件
            if (info.is_attentioned - 0 === 0 || info.is_attentioned - 0 === 1) {
                $("#concern_box a").on('click', function() {
                    //关注与取消关注点击
                    if ($(this).attr('data-att') == "0") {
                        //TODO 添加一个loading的转圈状态
                        //点击关注
                        if (navigator.userAgent.match(/Android/gi)) {
                            reader_event.attention(1);
                        } else if (navigator.userAgent.match(/iPhone/gi)) {
                            document.location.href = 'sinablog://attention/1';
                        }

                    } else if ($(this).data('att') == "1") {
                        //点击取消关注
                        if (navigator.userAgent.match(/Android/gi)) {
                            reader_event.attention(0);
                        } else if (navigator.userAgent.match(/iPhone/gi)) {
                            document.location.href = 'sinablog://attention/0';
                        }
                    }

                });
            }
        },
        //关注状态显示操作
        isShowConcernBox = function(attentionCode) {
            switch (attentionCode - 0) {
                case 0:
                    //未关注状态
                    return '<span id="concern_box" class="concern_box"><a data-att="0" href="javascript:void(0);" class="btn_concern"><i class="ico ico_plus"></i>关注</a></span>';
                case 1:
                    //已关注状态
                    return '<span id="concern_box" class="concern_box"><a data-att="1" href="javascript:void(0);" class="btn_concern">已关注</a></span>';
                default:
                    //不显示关注按钮
                    return '';
            }

        },
        //通过数组的json对象，生成dom的字符串
        getDomString = function(list_array, info) {
            var reg_1 = /^{/,
                sizeArray = [],
                vd_sizeArray = [];
            for (var i in list_array) {
                var adjust = list_array[i].replace(/\"{/gi, '{').replace(/\}\"/gi, '}');
                if (!reg_1.test(adjust)) {
                    Html_string = Html_string + '<div id="ab_module_text_index" class="prgrph">' + adjust + '</div>';
                } else {
                    var adjust_obj = JSON.parse(adjust);
                    if (i == 0) {
                        //头部更换
                        Html_string = Html_string + ("<div id=\"ab_module_poster\" " + (adjust_obj.postersrc ? 'class="head_poster"' : 'class="head_poster head_noposter"') + ">" + (adjust_obj.postersrc ? "<div class=\"imgCover\"></div><img id=\"ab_poster_bg\" class=\"poster_bg\" src= " + adjust_obj.postersrc + " >" : "<img src=\"\" id=\"ab_poster_bg\"  class=\"poster_bg\"/>") + "<div class=\"auther_info\"><img id=\"ab_poster_auther_head\" class=\"auther_avtr\" src=" + info.head_src + "><div id=\"ab_poster_auther_name\" class=\"auther_name\">" + info.name + "</div>" + isShowConcernBox(info.is_attentioned) + "</div><div id=\"ab_poster_title\" class=\"poster_title\">" + info.title + "</div></div>" + (adjust_obj.postersrc ? "" : "<div class=\"gray_line\"></div>") + "<div class=\"articl_content\"><div class=\"pblsh_tm\"><span class=\"lbl_tm\" id=\"publish_date\">" + info.time + "</span><span class=\"lbl_read\" id=\"read_num\"><i class=\"ico ico_read\"></i>" + info.read_count + "</span><span class=\"lib_ctgry\" id=\"class_name\">" + (info.categary ? '<i class="ico ico_label1"></i>' + info.categary : '') + "</span></div>");
                    } else if (adjust_obj.src) {
                        var img_location = adjust_obj.location.split('|')[2],
                            img_width = getSize(adjust_obj.iw),
                            img_height = getSize(adjust_obj.ih);
                        if (img_width !== "" && img_width > window.screen.width - 30) {
                            sizeArray = getScreenWidth(img_width, img_height);
                        } else {
                            sizeArray = [img_width, img_height];
                        }
                        Html_string = Html_string + ("<div id=\"ab_module_image_index\" class=\"img_location\"><img id=\"ab_image_bg_0\" width=" + sizeArray[0] + " height=" + sizeArray[1] + " class=\"travel_img\" src=" + adjust_obj.src + ">" + (img_location ? "<div class=\"location_info\"><i id=\"ab_image_location_0\" class=\"ico ico_location\"></i><span class=\"location_txt\">" + img_location + "</span></div>" : "") + "<div id=\"ab_image_description_0\" class=\"img_descrt\">" + adjust_obj.descrt + "</div></div>");

                    } else if (adjust_obj.abvideo_src) {
                        var vd_location = adjust_obj.abvideo_location.split('|')[2],
                            vd_width = getSize(adjust_obj.abvideo_vw),
                            vd_height = getSize(adjust_obj.abvideo_vh);
                        if (vd_width !== "" && vd_width > window.screen.width - 30) {
                            vd_sizeArray = getScreenWidth(vd_width, vd_height);
                        } else {
                            vd_sizeArray = [vd_width, vd_height];
                        }
                        Html_string = Html_string + ("<div id=\"ab_module_video_index\" width=" + vd_sizeArray[0] + " height=" + vd_sizeArray[1] + " class=\"img_location video_location\"><center><video id=" + adjust_obj.id + " class=\"travel_video\"  poster=" + adjust_obj.abvideo_poster + " width=" + vd_sizeArray[0] + " height=" + vd_sizeArray[1] + " onplaying=\"onplayingCount(this);\" " + (navigator.userAgent.match(/iPhone/gi) ? "controls=\"\" webkit-playsinline=\"\"" : "") + "><source src=" + adjust_obj.abvideo_src + "/></video></center>" + (vd_location ? "<div class=\"location_info\" id=\"ab_location_info\"><i id=\"ab_video_location_0\" class=\"ico ico_location\"></i><span class=\"location_txt\">" + vd_location + "</span></div>" : "") + "<div id=\"ab_video_description_0\" class=\"img_descrt\">" + adjust_obj.abvideo_descrt + "</div></div>");
                    }
                }
            }
            Html_string = Html_string + '</div>';
        },
        //渲染
        render = function(info) {
            $('.cont #cont-replace').replaceWith(Html_string);
            // if (navigator.userAgent.match(/Android/gi)) {
            //  $('.location_info').css('padding-top','0.75em');
            // }

            //判断是否隐藏入选主题
            if(topicDomString !== ''){
                $("#artcl_subject .artcl_sbjct_list").html(topicDomString);
                $("#artcl_subject").show();
            }
            //判断是否隐藏禁止模块
            if (info.is_forbidden_comment == '1' || info.is_forbidden_repost == '1' || info.is_show_report == '1') {
                $('.artcl_optn').css('display', 'block');
            }
            if (info.is_forbidden_repost == "0") {
                $('.frbdn span').eq(0).css('display', 'none');
            }
            if (info.is_forbidden_comment == "0") {
                $('.frbdn span').eq(1).css('display', 'none');
            }
            if (info.is_show_report == "0") {
                $('.artic_rprt').css('display', 'none');
            }
            switch (info.font_size) {
                case "0":
                    $('.articl_content').removeClass('bl-middle bl-large bl-xlarge');
                    $('.articl_content').addClass('bl-small');
                    break;
                case "1":
                    $('.articl_content').removeClass('bl-small bl-large bl-xlarge');
                    $('.articl_content').addClass('bl-middle');
                    break;
                case "2":
                    $('.articl_content').removeClass('bl-small bl-middle bl-xlarge');
                    $('.articl_content').addClass('bl-large');
                    break;
                case "3":
                    $('.articl_content').removeClass('bl-small bl-middle bl-large');
                    $('.articl_content').addClass('bl-xlarge');
                    break;
            }
            switch (info.vip) {
                case "0":
                    $('#ab_poster_auther_name i').remove('');
                    break;
                case "1":
                    $('#ab_poster_auther_name i').remove('');
                    $('#ab_poster_auther_name').append('<i class="ico_level ico_lvl_yllw"></i>');
                    break;
                case "2":
                    $('#ab_poster_auther_name i').remove('');
                    $('#ab_poster_auther_name').append('<i class="ico_level ico_lvl_blue"></i>');
                    break;
            }
        },
        //获取 主题dom字符串
        getTopicListDomString = function(info){
            if(info.topic_list && info.topic_list.length > 0){
                for(var i = 0, item; item = info.topic_list[i++];){
                    topicDomString += ['<a href="javascript:void(0);" onclick="clickTopic(',item.topic_ic,')">',item.topic_name,'</a>'].join('');
                }
            }
        },
        init = function(info_arg) {
            outerhtml = info_arg.article_body.replace(/&quot;/g, '"').replace(/\\n/gm, '<br>').replace(/\\/g, '');
            getDataArray(outerhtml);
            getDomString(list, info_arg);
            getTopicListDomString(info_arg);
            render(info_arg);
            initEvent(info_arg);
        };

    function renderFinish() {
        if (navigator.userAgent.match(/Android/gi)) {
            reader_event.renderFinish();
        } else if (navigator.userAgent.match(/iPhone/gi)) {
            document.location.href = 'sinablog://render_finish';
        }

    };
    return {
        //渲染页面的接口
        renderFunc: function(info) {
            init(info);
            renderFinish();
            if (navigator.userAgent.match(/Android/gi)) {
                $('video').attr('preload', 'none').mediaelementplayer({
                    features: ['playpause', 'progress', 'current', 'duration', 'volume'],
                    alwaysShowControls: false,
                    AndroidUseNativeControls: false,
                    pauseOtherPlayers: true
                })
            }
        }
    };
}();

function onplayingCount(videoEle) {

    if (navigator.userAgent.match(/Android/gi)) {
        reader_event.executeCallback("callback-video-playing", videoEle.src);
    } else if (navigator.userAgent.match(/iPhone/gi)) {
        document.location.href = 'sinablog://video/playing';
    }
}

function report() {
    if (navigator.userAgent.match(/Android/gi)) {
        reader_event.jump2Report();
    } else if (navigator.userAgent.match(/iPhone/gi)) {
        document.location.href = 'sinablog://report';
    }
}
//点击入选主题的跳转操作
function clickTopic(topicId){
    //TODO 需要跳转函数 以及参数的传递的方式
    if (navigator.userAgent.match(/Android/gi)) {
        reader_event.jump2Topic(topicId);
    } else if (navigator.userAgent.match(/iPhone/gi)) {
        document.location.href = 'sinablog://topic/' + topicId;
    }
}

//更改Attention状态
function changeAttention(result) {
    if (result - 0 === 0) {
        //变更为未关注状态
        $("#concern_box a").attr('data-att', '0').html('<i class="ico ico_plus"></i>关注');
    } else if (result - 0 === 1) {
        //变更过为已关注状态
        $("#concern_box a").attr('data-att', '1').html('已关注');
    }
}
