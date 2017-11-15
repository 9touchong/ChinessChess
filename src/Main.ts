class Main extends egret.DisplayObjectContainer{
    private _ShowPlay:ShowPlay;
    private _LogicPLay:LogicPlay;
    constructor() {
        super();
        this._LogicPLay = new LogicPlay();
        this._ShowPlay = new ShowPlay(this._LogicPLay);
        this._LogicPLay.bind(this._ShowPlay);
        this.addChild(this._ShowPlay);
        this._LogicPLay.startone();
    }
}