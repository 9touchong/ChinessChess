class Normal_Button extends egret.TextField{  //普通按钮，可用于悔棋等按钮，目前就用文本显示
    private father;
    public event_key:string;
    public constructor(the_father){
        super();
        this.father = the_father;
        //this.width = 50;
        //this.height = 50;
        this.size = 49;
        this.textAlign = egret.HorizontalAlign.CENTER;
        this.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.textColor = 0xFF7F00;
        this.text = "按钮";
        this.touchEnabled = true;
        this.event_key = "";
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ontap,this);
    }
    private ontap(evt:egret.TouchEvent){
        console.log("您点击了按钮",this.text);
        let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
        CheInput_Event[this.event_key] = true;
        this.father.dispatchEvent(CheInput_Event);
    }
}
class Giveup_Button extends Normal_Button{
    public constructor(the_father){
        super(the_father);
        this.text = "认输";
        this.event_key = "_giveup";
    }
}
class Undo_Button extends Normal_Button{
    public constructor(the_father){
        super(the_father);
        this.text = "悔棋";
        this.event_key = "_undo";
    }
}
