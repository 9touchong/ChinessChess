class ShowPlay extends egret.DisplayObjectContainer{
    private logic;  //配套的逻辑系统
    protected pieces_set: Object;   //所有棋子的集合
    protected active_pieceId: string;    //当前活跃棋子的id，即被拿起来的那个
    protected active_faction: string;  //当前应该行动的阵营,r或b
    public constructor(the_logic){
        /**
         *the_master 代表引入此类的对象的父容器，因这里用不了parent所以要这样
         *the_logic 配套的逻辑程序
         */
        super();
        this.logic = the_logic;       
    }
    public startone(){  //开一局
        //棋盘和棋盘位点生成
        var board = new ChessBoardBed();
        this.addChild(board);
        board.place_sites();
        //初始化棋子及摆放
        this.pieces_set = {};
        var initMap = this.logic.Map;
        var tem_P_id_num:number = 0;
        for (var t_i  = 0 ; t_i < initMap.length ; t_i++){
            for (var t_j = 0 ; t_j < initMap[t_i].length ; t_j++){
                if (initMap[t_i][t_j]){
                    let t_piece = new Piece(initMap[t_i][t_j][0],initMap[t_i][t_j][1],board.sites_points[t_i][t_j][0],board.sites_points[t_i][t_j][1],t_i,t_j);
                    tem_P_id_num += 1;
                    t_piece.set_p_id("p_"+tem_P_id_num);
                    this.addChild(t_piece);
                    this.pieces_set["p_"+tem_P_id_num] = t_piece;
                }
            }
        }
        this.active_faction = "r";
        this.addEventListener(CheInpEvt.Tap,this.tra_CheInp,this);
        this.addEventListener(CheActEvt.Act,this.do_Action,this.logic);
        console.log("zhe za hui shi ",this.active_faction);
    }
    private tra_CheInp(evt:CheInpEvt){
        if (evt._pieceID && evt._faction){  //棋子发来的
            console.log("得到一个piece的点击请求");
            if (evt._faction == this.active_faction){   //点击“己方”棋子
                if (evt._pieceID == this.active_pieceId){   //点的是正被拿起的子
                    this.active_pieceId = null;
                }else{
                    
                    this.active_pieceId = evt._pieceID;
                    this.pieces_set[this.active_pieceId].picking_up();
                }
            }
        }
        else if(evt._moveToX && evt._moveToY){  //位点发来的
            console.log("得到一个位点的点击消息");
        }
        else{   //棋盘空白发来的
            console.log("得到棋盘空白的点击请求")
        }
    }
    private do_Action(evt:CheActEvt){

    }
}