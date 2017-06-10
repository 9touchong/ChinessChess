class ChessBoardSite extends egret.Shape{  //棋盘位点,暨可点击区域
    public constructor(s_x:number,s_y:number){
        super();
        this.graphics.beginFill( 0xff0000, 1);
        this.graphics.drawCircle(0,0,50);
        this.graphics.endFill();
        this.x = s_x;
        this.y = s_y;
        //this.alpha = 0;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ontap,this);
    }
    private ontap(evt:egret.TouchEvent){
        console.log("you have tap a ChessBoardSite");
    }
}