class ShowPlay extends egret.DisplayObjectContainer{
    private logic;  //配套的逻辑系统
    protected pieces_set: Object;   //所有棋子的集合
    protected sites_tab;    //所有位点的表
    protected active_pieceId: string;    //当前活跃棋子的id，即被拿起来的那个
    protected active_faction: string;  //当前应该行动的阵营,r或b
    protected shining_points_list;   //当前高亮显示的位点列表，用[m_x,m_y]表示
    public constructor(the_logic?){
        /**
         *the_master 代表引入此类的对象的父容器，因这里用不了parent所以要这样
         *the_logic 配套的逻辑程序
         */
        super();
        if (the_logic){
            this.bind(the_logic);
        }   
    }
    public bind(the_logic){ //绑定逻辑层程序对象
        this.logic = the_logic;
    }
    public startone(){  //开一局
        //棋盘和棋盘位点生成
        var board = new ChessBoardBed();
        this.addChild(board);
        board.gene_sites_points();
        this.sites_tab = new Array();
        for (var t_i = 0 ; t_i < board.sites_points.length ; t_i++){
            this.sites_tab[t_i] = new Array();
            for (var t_j = 0 ; t_j < board.sites_points[t_i].length ; t_j++){
                let t_point = board.sites_points[t_i][t_j];
                let t_site = new ChessBoardSite(t_point[0],t_point[1],t_i,t_j);
                this.addChild(t_site);
                this.sites_tab[t_i][t_j] = t_site;
            }
        }
        //初始化棋子及摆放
        this.pieces_set = {};
        var initMap = this.logic.initMap;
        var tem_P_id_num:number = 0;
        for (var t_i  = 0 ; t_i < initMap.length ; t_i++){
            for (var t_j = 0 ; t_j < initMap[t_i].length ; t_j++){
                if (initMap[t_i][t_j]){
                    let t_piece = new Piece(initMap[t_i][t_j][0],initMap[t_i][t_j][1],board.sites_points[t_i][t_j][0],board.sites_points[t_i][t_j][1],t_i,t_j);
                    t_piece.set_p_id("p_"+tem_P_id_num);
                    this.addChild(t_piece);
                    this.pieces_set["p_"+tem_P_id_num] = t_piece;
                    tem_P_id_num += 1;
                }
            }
        }
        this.active_faction = this.logic.active_faction;
        this.addEventListener(CheInpEvt.Tap,this.tra_CheInp,this);
        this.addEventListener(CheActEvt.Act,this.do_Action,this);
    }
    private tra_CheInp(evt:CheInpEvt){
        if (evt._pieceID && evt._faction){  //棋子发来的
            if (evt._faction == this.active_faction){   //点击“己方”棋子
                if (evt._pieceID == this.active_pieceId){   //点的是正被拿起的子
                    this.active_pieceId = null;
                    this.pieces_set[evt._pieceID].put_down();
                    this.shine_sites("off");
                }else{  //放下当前手中的，拿起另一个
                    if (this.active_pieceId){
                        this.pieces_set[this.active_pieceId].put_down();
                    };
                    this.active_pieceId = evt._pieceID;
                    this.pieces_set[this.active_pieceId].picking_up();
                    this.logic.dispatchEvent(evt);  //将CheInpEvt转发给逻辑层
                }
            }else{  //点击敌方棋子
                if (this.active_pieceId){
                    let t_piece = this.pieces_set[evt._pieceID];
                    evt._moveToX = t_piece.m_x;
                    evt._moveToY = t_piece.m_y;
                    evt._pieceID = this.active_pieceId;
                    this.logic.dispatchEvent(evt);
                }
                this.calm_down();
            }
        }
        else if(evt._moveToX && evt._moveToY){  //位点发来的
            console.log("得到一个位点的点击消息");
            if (this.active_pieceId){   //如果没有棋子，单纯的位点没作用
                evt._pieceID = this.active_pieceId;
                this.logic.dispatchEvent(evt);
            }
        }
        else{   //棋盘空白发来的
            console.log("得到棋盘空白的点击消息");
            if (this.active_pieceId){
                this.pieces_set[this.active_pieceId].put_down();
                this.active_pieceId = null;
            }
            this.shine_sites("off");
        }
    }
    private do_Action(evt:CheActEvt){   //处理逻辑层给的命令
        console.log("收到逻辑层的消息",evt);
        if (!evt._actPieceid || evt._invalid){  //没有_actPieceid的肯定是不合法的,或得到操作错误的命令，要做的是把所有激活状态的元件放下
            this.calm_down();
            return 0;
        }
        if (evt._effectSites){  //接收到要高亮显示的位点
            this.shine_sites("on",evt._effectSites);
        }
        if (evt._moveToX && evt._moveToY){  //接收到有棋子该移动
            this.movepiece(evt._actPieceid,evt._moveToX,evt._moveToY);
            this.calm_down();
        }
        if (evt._dyingPieceid){ //接受到某棋子被吃掉的命令
            this.pieces_set[evt._dyingPieceid].kill_self();
            this.calm_down();
        }
    }
    private calm_down(){    //所有激活状态的元件复归平静
        if (this.active_pieceId){
            this.pieces_set[this.active_pieceId].put_down();
            this.active_pieceId = null;
        }
        this.shine_sites("off");
    }
    private shine_sites(on_off:string,sites_list?){
        if (on_off == "on"){
            if (!sites_list){
                return 0;
            }
            if (this.shining_points_list){
                for (let t_point of this.shining_points_list){
                    this.sites_tab[t_point[0]][t_point[1]].shining("off");
                }
            }            
            this.shining_points_list = sites_list;
            for (let t_point of this.shining_points_list){
                this.sites_tab[t_point[0]][t_point[1]].shining("on");
            }
        }else{
            if (this.shining_points_list){
                for (let t_point of this.shining_points_list){
                    this.sites_tab[t_point[0]][t_point[1]].shining("off");
                }
            }
            
            this.shining_points_list = null;
        }
    }
    private movepiece(pieceID: string , m_x: number , m_y: number){
        let t_site = this.sites_tab[m_x][m_y];
        this.pieces_set[pieceID].move(m_x,m_y,t_site.x,t_site.y);
    }
}