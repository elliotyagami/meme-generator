var meme = {

    canvas: document.getElementById('canvas'),

    memeimg: "",

    resizew: 0,

    resizeh: 0

};

var glasses = new Image(),
    face = new Image(),
    fun = new Image(),
    threshold = 80;
var firstimage = true;

function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}

var gid = "";
function canvasscroll() {

    var canvastop = $("#mainviewport");
    var elOffset = canvastop.offset().top;
    offset = elOffset;

    var speed = 700;
    $('html, body').animate({ scrollTop: offset }, speed);
}

function Textscroll() {

    var canvastop = $("#editarea");
    var elOffset = canvastop.offset().top;
    var elHeight = canvastop.height();
    var windowHeight = $(window).height();
    var offset;

    if (elHeight < windowHeight) {
        offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
    }
    else {
        offset = elOffset;
    }
    var speed = 700;
    $('html, body').animate({ scrollTop: offset }, speed);
}

var textarea = document.getElementById("memetxt");

var currnttext, currnttextnode;
var memeimage = {
    currntimage: '',
    node: ''
};

var url, zindex = 1;

var stage, output;

var equalheight = function (container, selectNode) {

    var currentTallest = 0, currentRowStart = 0, rowDivs = new Array(), $el, topPosition = 0;

    jQuery(container).each(function () {

        $el = jQuery(this);

        jQuery($el).height('auto')

        topPostion = $el.position().top;

        if (currentRowStart != topPostion) {

            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {

                rowDivs[currentDiv].height(currentTallest);

            }

            rowDivs.length = 0;

            // empty the array

            currentRowStart = topPostion;

            currentTallest = 80;

            rowDivs.push($el);

        } else {

            rowDivs.push($el);

            //currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);

        }

        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {

            if (selectNode.length > 1) {

                rowDivs[currentDiv].find(selectNode).height(currentTallest);

            } else {

                rowDivs[currentDiv].height(currentTallest, "");

            }

        }

    });

}

$(document).ready(function() {
    $('.meme_img').click(function(){
        console.log("done")
    addImageToCanvas(this);
    })
});

function adjustAllImage() {

    $("#inputs li img").each(function (index) {

        var w1 = $(this).attr("width");

        var h1 = $(this).attr("height");

        var w2 = $(this).width();

        var h2 = $(this).parent().height();

        nh = (h1 / w1) * w2;

        if (h2 > nh) {

            var per = (h2 / nh) * 100;

            $(this).css("width", per + "%");

        }

    });

}


function handleClick(evt) {

    currnttext = evt.currentTarget;

    var originalfont = currnttext.font;

    var fontt = originalfont.split(" ");

    $("#memetxt").val(currnttext.text);

    $("#fontsize").val(fontt[1]);

    var enc = originalfont.replace(fontt[0], "").replace(fontt[1], "").trim();

    var enc = enc.replace(/'/g, "");

    $("#fontfamily").val(enc);

    document.getElementById('memetxtcolor').color.fromString(currnttext.color.replace("#", ""));

    //Textscroll();
}

function handleImageScale(evt) {
    memeimage.currntimage = evt.currentTarget;
    $('#weight').val(memeimage.currntimage.scaleX * 100);
    zindex = zindex + 1;
}



function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var newimage = new Image();
        newimage.src = event.target.result;
        newimage.onload = function () {
            addClickEvent(this);
            addImageToCanvas(this);
        }
    }
    reader.readAsDataURL(e.target.files[0]);
}


function init() {
    stage = new createjs.Stage("canvas");
    stage.enableMouseOver();

    $("label.title.closable").click(function () {
        $("div.optionblock").hide();
        $(this).closest("div.mainblock").find("div.optionblock").toggle();
        return false;
    });

    $("#fontfamily, #fontsize, #memetxtcolor").change(function (event) {
        updateMEMEFont();
    });

    $("#clearbackground").click(function () {
        stage.removeAllChildren();
        stage.update();
        return false;
    });

    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

    $("#addtextlayer").click(function () {

        var text = new createjs.Text("[New MEME]", "300 30px Bangers", "#ff7700");

        text.on("click", handleClick, null, false, null, false);
        text.on("mouseover", handleInteraction, null, false, null, false);
        text.on("mouseout", handleInteraction, null, false, null, false);
        text.cursor = "pointer";
        var dragger = new createjs.Container();
        dragger.x = dragger.y = 100;
        dragger.addChild(text);
        var bounds = text.getBounds();
        var pad = 10;
        var bg = new createjs.Shape();
        var border = bg.graphics.beginFill("red").drawRect(text.x - pad + bounds.x, text.y - pad + bounds.y, bounds.width + pad * 2, bounds.height + pad * 2);
        border.beginStroke("#000");
        border.snapToPixel = true;
        border.setStrokeStyle(1);
        bg.outline = 5;
        text.hitArea = bg;
        dragger.cursor = "pointer";
        stage.addChild(dragger);

        dragger.on("mousedown", function (evt) {
            currnttextnode = this;
            this.offset = {
                x: this.x - evt.stageX,
                y: this.y - evt.stageY
            };
        });

        dragger.on("pressmove", function (evt) {
            currnttextnode = this;
            evt.currentTarget.x = evt.stageX + this.offset.x;
            evt.currentTarget.y = evt.stageY + this.offset.y;
            stage.update();

        });

        currnttext = text;

        var fontt = currnttext.font.split("px");

        $("#fontfamily").val("Shadows Into Light");

        $("#memetxt").val(currnttext.text);

        document.getElementById('memetxtcolor').color.fromString("FF7700");

        $("#fontsize").val("20px");

        stage.update();

        return false;

    });

    textarea.addEventListener('input', function (event) {
        updateMEMEText($("#memetxt").val());
    }, false);

    $("#saveclick").click(function () {
        downloadCanvas(this, 'canvas', 'meme-image.png');
        return true;
    });

    $("#removeImage").click(function () {
        stage.removeChild(memeimage.node);
        var name = memeimage.currntimage.name;
        $("li[title~=" + name + "]").removeClass("selected");
        canvasscroll();
        return false;
    });

    $("#removeText").click(function () {
        stage.removeChild(currnttextnode);
        $("memetxt").val("");
        // Textscroll();
        return false;
    });


    addClickEvent($("#inputs li"), true);

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        createjs.Touch.enable(stage);
    } else {
        adjustAllImage();
    }

    stage.autoClear = true;

    $(window).resize(function () {
        var width = $("#canvas").width();
        var clientW = document.documentElement.clientWidth;
        if (clientW < 610) {
            clientW = clientW - 30;
            $("#canvas").css("width", clientW + "px");

        } else {
            $("#canvas").css("width", "536px");
        }
        stage.update();
    });

    $(window).load(function () {
        var width = $("#canvas").width();
        var clientW = document.documentElement.clientWidth;
        if (clientW < 610) {
            clientW = clientW - 30;
            $("#canvas").css("width", clientW + "px");

        } else {
            $("#canvas").css("width", "600px");
        }
        stage.update();
    });

    // this lets our drag continue to track the mouse even when it leaves the canvas:

    // play with commenting this out to see the difference.

    stage.mouseMoveOutside = false;

    stage.update();

    createjs.Ticker.addEventListener("tick", stage);

}


function handleInteraction(event) {
    event.target.alpha = (event.type == "mouseover") ? 0.5 : 1;
    event.target.cursor = 'hand';
}

function addClickEvent(node) {
    node.click(function () {
        addImageToCanvas(this);
    });
}

function addImageToCanvas(node) {
    console.log("addimagetocanvas")
    $(node).addClass("selected");

    meme.memeimg = $(node).attr("src");
    var bitmap = new createjs.Bitmap(meme.memeimg);

    bitmap.name = $(node).attr("title");
    bitmap.scaleX = 536 / bitmap.image.naturalWidth
    bitmap.scaleY = 400 / bitmap.image.naturalHeight

    memeimage.currntimage = bitmap;
    memeimage.originalimage = bitmap;

    bitmap.on("click", handleImageScale, null, false, null, false);

    var dragger = new createjs.Container();

    dragger.x = dragger.y = 0;

    dragger.addChild(bitmap);

    stage.addChild(dragger);

    memeimage.node = dragger;

    dragger.on("mousedown", function (evt) {
        this.offset = {
            x: this.x - evt.stageX,
            y: this.y - evt.stageY
        };
        memeimage.node = this;
    });

    dragger.on("pressmove", function (evt) {
        evt.currentTarget.x = evt.stageX + this.offset.x;
        evt.currentTarget.y = evt.stageY + this.offset.y;
        stage.update();
    });

    stage.update();

}

function updateMEMEText(text) {
    currnttext.text = text;
    var bounds = currnttext.getBounds();
    var pad = 1;
    var bg = new createjs.Shape();
    bg.graphics.beginFill("#ABC").drawRect(currnttext.x - pad + bounds.x, currnttext.y - pad + bounds.y, bounds.width + pad * 2, bounds.height + pad * 2);
    currnttext.hitArea = bg;
    stage.update();
}

function updateMEMEFont() {
    currnttext.font = "500 " + $("#fontsize").val() + " '" + $("#fontfamily").val() + "' ";
    currnttext.color = "#" + $('#memetxtcolor').val();
    var bounds = currnttext.getBounds();
    var pad = 1;
    var bg = new createjs.Shape();
    bg.graphics.beginFill("#ABC").drawRect(currnttext.x - pad + bounds.x, currnttext.y - pad + bounds.y, bounds.width + pad * 2, bounds.height + pad * 2);
    currnttext.hitArea = bg;
    stage.update();
}
