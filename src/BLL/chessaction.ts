class CheActEvt extends egret.Event{
    /**
     * 由逻辑层发给表现层的事件类
     * 通常可以传递要移动、吃子、胜负等行动
     */
    public static Act:string = "act";
    public _actPieceid:string;  //响应棋子的id，可能会移动的
    public _effectSites; //要表现效果的位点，即可落点，数组
    public _effectPieces;   //要表现效果的棋子，数组
    public _moveToX:number;
    public _moveToY:number;
    public _dyingPieceid:string;    //要杀死的棋子id
    public _change_faction:boolean = false;  //是否要切换当前控制阵营
    public _invalid:boolean = false;    //为true时代表无效操作
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
        super(type,bubbles,cancelable);
    }
}