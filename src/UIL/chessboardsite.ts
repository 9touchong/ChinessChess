class ChessBoardSite extends egret.Shape{  //棋盘位点,暨可点击区域
    private m_x : number;
    private m_y : number;
    public constructor(s_x:number,s_y:number,m_x:number,m_y:number){
        super();
        this.m_x = m_x;
        this.m_y = m_y;
        this.graphics.beginFill( 0xff0000, 1);
        this.graphics.drawCircle(0,0,16);   //半径不宜过大
        this.graphics.endFill();
        this.x = s_x;
        this.y = s_y;
        this.alpha = 0.3;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ontap,this);
        this.addEventListener(CheInpEvt.DATE,this.tra_CheInp,this);
    }
    private ontap(evt:egret.TouchEvent){
        console.log("哈哈you have tap a ChessBoardSite");
        var CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.DATE,true);
        CheInput_Event._year = 1010;
        this.dispatchEvent(CheInput_Event);
        console.log("haha",CheInput_Event);
    }
    public tra_CheInp(evt:CheInpEvt){
        console.log("得到了的邀请009！" );
    }
}