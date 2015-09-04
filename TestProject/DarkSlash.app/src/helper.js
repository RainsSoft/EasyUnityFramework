/**
* Created by yuan on 14-8-8.
*/
/// <reference path="cocos2d.d.ts" />
/// <reference path="vee.d.ts" />
var GLOBAL = this;
var helper;
(function (helper) {
    function getClass(className) {
        if (GLOBAL.hasOwnProperty(className)) {
            return GLOBAL[className];
        }
    }
    helper.getClass = getClass;
    function getClassName(obj) {
        var fun;
        if (typeof obj === "object") {
            fun = obj.constructor;
        } else if (typeof obj === "function") {
            fun = obj;
        }
        if (!fun) {
            cc.log(JSON.stringify(obj) + " is not object or function.");
            cc.log(arguments.callee.caller.toString());
        }
        var ret = fun.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }
    helper.getClassName = getClassName;

    function getRandomPosition(childSize, parentRect) {
        var x = parentRect.x + vee.Utils.randomInt(0, parentRect.width);
        var y = parentRect.y + vee.Utils.randomInt(0, parentRect.height);
        x = Math.max(childSize.width / 2, x);
        x = Math.min(x, parentRect.width - childSize.width / 2);
        y = Math.max(childSize.height / 2, y);
        y = Math.min(y, parentRect.height - childSize.height / 2);
        return cc.p(x, y);
    }
    helper.getRandomPosition = getRandomPosition;

    function beInRange(childPos, childSize, parentRect) {
        var x = childPos.x;
        var y = childPos.y;
        x = Math.max(childSize.width / 2, x);
        x = Math.min(x, parentRect.width - childSize.width / 2);
        y = Math.max(childSize.height / 2, y);
        y = Math.min(y, parentRect.height - childSize.height / 2);
        return cc.p(x, y);
    }
    helper.beInRange = beInRange;

    function buyProduct(id, isNonConsumable, success, failed) {
        vee.IAPMgr.buyProductWithCustomParams({ ProductID: id, NonConsumable: isNonConsumable.toString() }, success, failed);
    }
    helper.buyProduct = buyProduct;
    function getSpriteFrame(fileName) {
        var texture = cc.director.getTextureCache().addImage(fileName);
        var rect = cc.RectZero();
        rect.size = texture.getContentSize();
        return cc.SpriteFrame.createWithTexture(texture, rect);
    }
    helper.getSpriteFrame = getSpriteFrame;
})(helper || (helper = {}));
