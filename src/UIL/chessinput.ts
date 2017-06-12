class CheInpEvt extends egret.Event{
    /**
     * 表现层关于点击输入的事件类
     */
    public static DATE:string = "约会";
    public _year:number = 0;
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
        super(type,bubbles,cancelable);
    }
}