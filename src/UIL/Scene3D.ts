/**
 *表现层的3d部分
 */
class Scene3d {
    private father;  //上级的showplay
    private _chessboard: ChessboardBed;

    // View3D操作对象
    protected view: egret3d.View3D;

    protected lightGroup: egret3d.LightGroup;

    /**
    * look at 摄像机控制器 。</p>
    * 指定摄像机看向的目标对象。</p>
    * 1.按下鼠标左键并移动鼠标可以使摄像机绕着目标进行旋转。</p>
    * 2.按下键盘的(w s a d) 可以摄像机(上 下 左 右)移动。</p>
    * 3.滑动鼠标滚轮可以控制摄像机的视距。</p>
    */
    private cameraCtl: egret3d.LookAtController;

    constructor(context3d: egret3d.Egret3DCanvas,thefather:ShowPlay) {
        this.father = thefather;
        var view = new egret3d.View3D(0, (context3d.height - context3d.width) / 2, context3d.width, context3d.width);
        view.camera3D.lookAt(new egret3d.Vector3D(0,500,1000), new egret3d.Vector3D());   //这里随便设置 会被cameraCtl覆盖 其实不要这句也没差
        view.backColor = 0xff181818;

        context3d.addView3D(view);
        this.view = view;

        this.cameraCtl = new egret3d.LookAtController(view.camera3D, new egret3d.Object3D());
        this.cameraCtl.lookAtObject.y = 700;  //注意这里lookAtObject会改变旋转的中心 如果有代替方法就不设置这里
        this.cameraCtl.lookAtObject.z = 800;

        this.cameraCtl.distance = 600;
        this.cameraCtl.rotationX = 30;
        this.cameraCtl.rotationY = 180;
        context3d.addEventListener(egret3d.Event3D.ENTER_FRAME, this.update, this);

    }

    public createGameScene() {
        //背景
        let bg_texture = RES.getRes("3d/background.jpg");
        this.view.backImage = bg_texture;

        //内容
        ///棋盘
        if (this.father.human_faction == "r"){
            this._chessboard = new ChessboardBed(true,this.father);
        }else{
            this._chessboard = new ChessboardBed(null,this.father);
        };
        this.view.addChild3D(this._chessboard.body);
        this.father.sites_tab = new Array();
        for (let t_i = 0 ; t_i < this._chessboard.sites_points.length ; t_i++){
            this.father.sites_tab[t_i] = new Array();
            for (let t_j = 0 ; t_j < this._chessboard.sites_points[t_i].length ; t_j++){
                let t_point = this._chessboard.sites_points[t_i][t_j];
                let t_site = new ChessboardSite(t_point[0],t_point[1],t_i,t_j,this.father);
                this.view.addChild3D(t_site.body);
                this.father.sites_tab[t_i][t_j] = t_site;
            }
        };
        ///棋子
        this.father.pieces_set = {};
        let initMap = this.father.logic.get_property("initMap");
        let tem_P_id_num:number = 0;
        for (var t_i  = 0 ; t_i < initMap.length ; t_i++){
            for (var t_j = 0 ; t_j < initMap[t_i].length ; t_j++){
                if (initMap[t_i][t_j]){
                    //console.log(initMap[t_i][t_j][0],initMap[t_i][t_j][1],this._chessboard.sites_points[t_i][t_j][0],this._chessboard.sites_points[t_i][t_j][1],t_i,t_j);
                    let t_piece = new Chesspiece(initMap[t_i][t_j][0],initMap[t_i][t_j][1],this._chessboard.sites_points[t_i][t_j][0],this._chessboard.sites_points[t_i][t_j][1],t_i,t_j,null,this.father);
                    t_piece.set_p_id("p_"+tem_P_id_num);
                    this.view.addChild3D(t_piece.body);
                    this.father.pieces_set["p_"+tem_P_id_num] = t_piece;
                    tem_P_id_num += 1;
                }
            }
        }

        //灯光
        this.lightGroup = new egret3d.LightGroup();
        var dirLight = new egret3d.DirectLight(new egret3d.Vector3D(1, -1, 0))
        this.lightGroup.addLight(dirLight);
        //this._chessboard.body.lightGroup = this.lightGroup;
    }

    protected update(e: egret3d.Event3D) {
        this.cameraCtl.update();
    }
}
