class ChessboardBed{
    private father;
    public body:egret3d.Mesh;
    private pWidth:number = 1000;
    private pHeight:number = 1000;
    public sites_points;   //棋盘所有落点的坐标  一个9*10的二维数组
    protected _reverse:boolean;    //是否逆向显示，正向时红在上，逆向时黑在上
    constructor(reverse:boolean = false,the_father){
        this.father = the_father;
        this.body = new egret3d.Mesh(new egret3d.PlaneGeometry(this.pWidth,this.pHeight));
        this.body.material.diffuseTexture = RES.getRes("3d/chess/Texture/chessboard.png");
        this.body.enablePick = true;
        //this.body.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.onClickBed, this);
        this._reverse = reverse;
        this.gene_sites_points();
    }
    public gene_sites_points(){
        /**
         *生成sites_points
         *点位横纵坐标是x和z，不涉及y
         */
        this.place_board();
        let startX,startZ,spaceX,spaceZ:number;
        if (this._reverse){
            startX = this.body.x - this.pWidth/2 + 110.7;
            startZ = this.body.z + this.pHeight/2 - 62;
            spaceX = 97.3;
            spaceZ = -97.7;
        }else{
            startX = this.body.x + this.pWidth/2 - 110.7;
            startZ = this.body.z - this.pHeight/2 + 62;
            spaceX = -97.3;
            spaceZ = 97.7;
        };
        this.sites_points = new Array();
        for (var t_i = 0 ; t_i < 9 ; t_i++){
            this.sites_points[t_i] = new Array();
            for (var t_j = 0; t_j < 10 ; t_j++){
                this.sites_points[t_i][t_j] = [startX+t_i*spaceX , startZ+t_j*spaceZ];
            }
        };
    }
    private place_board(){
        /**
         * 2d版本遗留 改变本体中心(锚点)和全局位置，3d版本不需要，本体是个平面，垂直面向y轴。默认就是中间点锚点且位置在空间中心点(0,0,0)
         */
    }
    private onClickBed(e: egret3d.TouchEvent3D){
        console.log("board has been clicked");
        let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
        this.father.dispatchEvent(CheInput_Event);
    }
}

class ChessboardSite{
    private father;
    public body:egret3d.Mesh;
    private pWidth:number = 100;
    private pHeight:number = 100;
    private m_x : number;
    private m_y : number;
    constructor(s_x:number,s_z:number,m_x:number,m_y:number,the_father){
        this.father = the_father;
        this.m_x = m_x;
        this.m_y = m_y;
        this.body = new egret3d.Mesh(new egret3d.PlaneGeometry(this.pWidth,this.pHeight));
        this.body.material.diffuseTexture = RES.getRes("3d/chess/Texture/canputsite.png");
        this.body.x = s_x;
        this.body.z = s_z;
        this.body.y = 1; //这里为了使site在bed其上方显示出来设置一个较小的数
        this.body.enablePick = true;
        this.body.visible = false;   //非激活状态下不可见
        this.body.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.onClickSite, this);
        this.body.mouseChildren = true;
    }
    private onClickSite(e: egret3d.Event3D){
        console.log("site clicked",this.m_x,this.m_y,this.body.x,this.body.z,this.body.y);
        let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
        CheInput_Event._moveToX = this.m_x;
        CheInput_Event._moveToY = this.m_y;
        this.father.dispatchEvent(CheInput_Event);
    }
    public shining(on_off){
        if (on_off == "on"){
            this.body.visible = true;
            this.body.enablePick = true;
        }else{
            this.body.visible = false;
            this.body.enablePick = false;
        }
    }
}