/**
 * Created by brooklyn on 14-6-18.
 */
var vee = vee || {};


var VeeShareBox = vee.Class.extend({
    btnClose: null,

    lyEditBox: null,
    lyImage: null,


    _editBox: null,
    _imgPath: null,

    _onConfirmCallback : null,
    _onCloseCallback : null,

    onDidLoadFromCCB: function(){
        this._editBox =  cc.EditBox.create(this.lyEditBox.getContentSize(), cc.Scale9Sprite.create("edit_bg.png"));
        this._editBox.setPosition(this.lyEditBox.getPosition());
        this.lyEditBox.removeFromParent();
        this._editBox.setFontColor(cc.c3b(106, 45, 16));
        this.rootNode.addChild(this._editBox);
    },

    onConfirm : function(){
        vee.PopMgr.closeLayerByCtl(this);
        if (this._onConfirmCallback) this._onConfirmCallback(this._editBox.getText(), this._imgPath);
    },

    onClose : function(){
        vee.PopMgr.closeLayerByCtl(this);
        if (this._onCloseCallback) this._onCloseCallback();
    },

    onKeyBack: function(){
        this.onClose();
        return true;
    },

    setContent : function(content) {
        if (content){
            this._editBox.setText(content);
        }
    },

    setConfirmCallback : function(callback){
        this._onConfirmCallback = callback;
    },

    setCloseCallback : function(callback){
        this._onCloseCallback = callback;
    },

    setSprite: function(imagePath){
        this._imgPath = imagePath;
        var spImage = cc.Sprite.create(imagePath);
        spImage.setPosition(this.lyImage.getPosition());
        spImage.setScale(this.lyImage.getScale());
        this.lyImage.removeFromParent();
        this.rootNode.addChild(spImage);
    }

});

vee.showSocialBox = function(content, imagePath, onConfirm, onClose){
    var node = vee.PopMgr.popCCB("vShareBox.ccbi", true);
    var ctl = node.controller;
    ctl.setContent(content);
    ctl.setSprite(imagePath);
    ctl.setConfirmCallback(onConfirm);
    ctl.setCloseCallback(onClose);
}
