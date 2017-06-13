class CheActEvt extends egret.Event{
    /**
     * 由逻辑层发给表现层的事件类
     * 通常可以传递要移动、吃子、胜负等行动
     */
    public static Act:string = "act";
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
        super(type,bubbles,cancelable);
    }
}