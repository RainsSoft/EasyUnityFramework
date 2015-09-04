var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by yuan on 14-9-18.
*/
/// <reference path="../vee.d.ts" />
var HelpHandCtl = (function (_super) {
    __extends(HelpHandCtl, _super);
    HelpHandCtl["__ts"]=true;
    function HelpHandCtl() {
        if(_super.__ts){_super.apply(this, arguments)}else if(typeof _super.prototype.ctor==="function"){_super.prototype.ctor.apply(this, arguments)};this.__instanceId = ClassManager.getNewInstanceId();;
    }
    HelpHandCtl.prototype.onDidLoadFromCCB = function () {
        this.rootNode.animationManager.runAnimationsForSequenceNamed("tap");
    };

    HelpHandCtl.prototype.getPosition = function () {
        return this.nodePos.getParent().convertToWorldSpace(this.nodePos.getPosition());
    };

    HelpHandCtl.prototype.setPosition = function (pos) {
        // Relative to rootNode
        var offset = this.nodePos.getPosition();
        this.rootNode.setPosition(cc.pSub(pos, offset));
    };

    HelpHandCtl.prototype.setText = function (text) {
        this.lbHelp.setString(text);
    };
    return HelpHandCtl;
})(cc.Class);
