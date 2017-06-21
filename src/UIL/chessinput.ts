class CheInpEvt extends egret.Event{
    /**
     * 表现层关于点击输入的事件类
     * 目前只涉及两种情况：1、点击一个棋子，向逻辑层要求可移动范围；2、点击一棋子再点击一无子位点或另一棋子，要求是否构成移动或吃子条件，得到无效或一两个棋子的新状态。
     */
    public static Tap:string = "Tap";
    public _pieceID:string;
    public _faction:string;
    //public _moveing:boolean = false;
    public _moveToX:number;
    public _moveToY:number;
    public _undo:boolean;   //悔棋
    public _reset:boolean;  //重新游戏
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
        super(type,bubbles,cancelable);
    }
}