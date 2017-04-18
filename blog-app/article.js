/* ========================================================================
 * 文章正文页的js文件,用来显示编码的音频和视频等等功能
 * ======================================================================== */

window.BS = window.BS || {};

+function ($) {
    'use strict';

    var VideoAudio = function() {

        this.VERSION = '0.0.1';

        this.audioElements = null;

        this.videoElements = null;

        this.currentPlayVideo = null;

        var $self = this;
        $(document).ready(function() {
            $self.init();
        });
    };

    VideoAudio.prototype.init = function() {

        this.videoElements = $("img[type='vdvideo']");
        this.audioElements = $("p[type='vdaudio']");


        this.reloadVideo();
    };

    VideoAudio.prototype.reloadVideo = function() {
        var $self = this;

        this.videoElements.each(function(){
            var $p = $(this);
            var wh = $self.calVideoWH($p, $p.attr("data-bs-w"), $p.attr("data-bs-h"));
            var videoHTML = "<p>"+$self.videoTemplate($p.attr("vdvideoid"), $p.attr("vdvideosrc"), $p.attr("vdvideoposter"), wh[0], wh[1]);
            $p.replaceWith(videoHTML);
        });
    };

    VideoAudio.prototype.calVideoWH = function($parent, width, height) {

//        var parentWidth = $parent.width();
        var parentWidth = document.body.scrollWidth-30;
        var wantedHeight = parseInt(parentWidth * height / width);
        /*
        if (wantedHeight > 460) {
            wantedHeight = 460;
        }
         */
        var realHeight = wantedHeight;
        var realWidth = parseInt(realHeight * width / height);

        return [realWidth, realHeight];
    };

    VideoAudio.prototype.videoTemplate = function(videoid, videoURL, posterURL, w, h) {
        var html = '<video controls="" webkit-playsinline="" id="video_'+ videoid +'" poster="' + posterURL+ '" src="'
            + videoURL + '" onplaying="BS.VideoAudio.videoOnplaying(this);" style="width:'+w+'px;height:'+h+'px"></video>';

        return html;
    };

    VideoAudio.prototype.videoOnplaying = function(videoDom) {
        document.location.href = 'sinablog://video/playing';

        if (!this.currentPlayVideo) {
            this.currentPlayVideo = $(videoDom);
        }
        else {
            if (!this.currentPlayVideo[0].paused && !this.currentPlayVideo.is($(videoDom))) {
                this.currentPlayVideo[0].pause();
            }

            this.currentPlayVideo = $(videoDom);
        }
        
    };

    // 注册到外部空间
    BS.VideoAudio = new VideoAudio();

}(jQuery);
