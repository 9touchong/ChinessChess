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
    }
    private ontap(evt:egret.TouchEvent){
        console.log("you have tap a ChessBoardSite");
    }
}