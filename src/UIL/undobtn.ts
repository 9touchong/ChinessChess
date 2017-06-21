class Undo_Button extends egret.TextField{  //悔棋按钮，目前就用文本显示
    public constructor(){
        super();
        //this.width = 50;
        //this.height = 50;
        this.size = 49;
        this.textAlign = egret.HorizontalAlign.CENTER;
        this.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.textColor = 0xFF7F00;
        this.text = "悔棋";
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ontap,this);
    }
    private ontap(evt:egret.TouchEvent){    //悔棋功能现在的实现还很不成熟，还有很大的改进空间
        let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
        CheInput_Event._undo = true;
        this.parent.dispatchEvent(CheInput_Event);
    }
}