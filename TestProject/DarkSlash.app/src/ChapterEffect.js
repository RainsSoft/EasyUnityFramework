/**
* Created by yuan on 14-8-7.
*/
/// <reference path="../cocos2d.d.ts" />
/// <reference path="../vee.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ChapterCtl = (function (_super) {
    __extends(ChapterCtl, _super);
    ChapterCtl["__ts"]=true;
    function ChapterCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};
    }
    ChapterCtl.prototype.showNewChapter = function (chapter) {
        this.lbChapter.setString(chapter);
        this.rootNode.animationManager.runAnimationsForSequenceNamed("show");
    };
    return ChapterCtl;
})(cc.Class);
