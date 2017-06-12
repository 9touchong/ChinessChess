class ShowPlay extends egret.DisplayObject{
    private master; //因为这里用不了parent，就将调用它的主人或叫宿主引进来
    private logic;  //配套的逻辑系统
    protected active_piece: Piece;    //当前活跃棋子，即被拿起来的那个
    public constructor(the_master,the_logic){
        /**
         *the_master 代表引入此类的对象的父容器，因这里用不了parent所以要这样
         *the_logic 配套的逻辑程序
         */
        super();
        this.master = the_master;
        this.logic = the_logic;
        this.addEventListener(CheInpEvt.ADDED,this.tra_CheInp,this);
    }
    public startone(){  //开一局
        //棋盘和棋盘位点生成
        var board = new ChessBoardBed();
        this.master.addChild(board);
        board.place_sites();
        //初始化棋子及摆放
        var initMap = this.logic.Map;
        for (var t_i  = 0 ; t_i < initMap.length ; t_i++){
            for (var t_j = 0 ; t_j < initMap[t_i].length ; t_j++){
                if (initMap[t_i][t_j]){
                    let t_piece = new Piece(initMap[t_i][t_j][0],initMap[t_i][t_j][1],board.sites_points[t_i][t_j][0],board.sites_points[t_i][t_j][1],t_i,t_j);
                    this.master.addChild(t_piece);
                }
            }
        }
        
    }
    public tra_CheInp(evt:CheInpEvt){
        console.log("得到了某child的邀请！" );
    }
}