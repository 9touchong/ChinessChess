class ChessBoardBed extends egret.Bitmap{
    public sites_points;   //棋盘所有落点的坐标 一个9*10的二维数组
    public constructor(){
        super();
        let texture: egret.Texture = RES.getRes("board_png");
        this.texture = texture;
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ontap,this);
    }
    public gene_sites_points(){
        /**
         * 生成sites_points
         * 这个当然是与棋盘的贴图大小规格有关的
         * 因为所有site的坐标都是全局的，要受board自身位置影响所以先place_board一下
         * 一些诸如spaceX之类的变量因为只在这里用一次就不设为类属性了
         */
        this.place_board();
        var startX = this.x + 22;
        var startY = this.y + 23;
        var spaceX:number = 57;
        var spaceY:number = 57;
        this.sites_points = new Array();
        for (var t_i = 0 ; t_i < 9 ; t_i++){
            this.sites_points[t_i] = new Array();
            for (var t_j = 0; t_j < 10 ; t_j++){
                this.sites_points[t_i][t_j] = [startX+t_i*spaceX , startY+t_j*spaceY];
            }
        }
    }
    private place_board(){   //安放棋盘到画面中央
        this.x = (this.parent.stage.stageWidth - this.width)/2;
        this.y = (this.parent.stage.stageHeight - this.height)/2;
    }
    private ontap(evt:egret.TouchEvent){
        let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
        this.parent.dispatchEvent(CheInput_Event);
    }
}