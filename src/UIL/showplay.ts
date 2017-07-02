class ShowPlay extends egret.DisplayObjectContainer{
    private logic;  //配套的逻辑系统
    protected pieces_set: Object;   //所有棋子的集合
    protected sites_tab;    //所有位点的表
    protected active_pieceId: string;    //当前活跃棋子的id，即被拿起来的那个
    protected active_faction: string;  //当前应该行动的阵营,r或b
    protected shining_points_list;   //当前高亮显示的位点列表，用[m_x,m_y]表示
    protected human_faction: string;    //玩家控制方 r或b
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
        if (!this.logic){
            console.log("logic与show必须互相绑定");
            return 0;
        }
        this.removeChildren();
        this.human_faction = this.logic.human_faction;
        //棋盘和棋盘位点生成
        if (this.human_faction == "r"){
            var board = new ChessBoardBed(true);
        }else{
            var board = new ChessBoardBed();
        };
        this.addChild(board);
        board.gene_sites_points();
        this.sites_tab = new Array();
        for (let t_i = 0 ; t_i < board.sites_points.length ; t_i++){
            this.sites_tab[t_i] = new Array();
            for (let t_j = 0 ; t_j < board.sites_points[t_i].length ; t_j++){
                let t_point = board.sites_points[t_i][t_j];
                let t_site = new ChessBoardSite(t_point[0],t_point[1],t_i,t_j);
                this.addChild(t_site);
                this.sites_tab[t_i][t_j] = t_site;
            }
        }
        //悔棋按钮
        var undo_btn = new Undo_Button();
        this.addChild(undo_btn);
        undo_btn.x = board.x + board.width/2;
        undo_btn.y = board.y + board.height/2 - 100;
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
        this.addEventListener(CheActEvt.Act,this.do_Action,this,false,100);
    }
    private tra_CheInp(evt:CheInpEvt){  //处理棋盘棋子按钮等点击后的消息
        if (evt._undo){ //悔棋按钮
            this.logic.dispatchEvent(evt);
        }else if (evt._pieceID && evt._faction){  //棋子发来的
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
                    evt._faction = this.pieces_set[evt._pieceID].p_faction;
                    this.logic.dispatchEvent(evt);
                }
                this.calm_down();
            }
        }
        else if(evt._moveToX!=null && evt._moveToY!=null){  //位点发来的
            console.log("得到一个位点的点击消息");
            if (this.active_pieceId){   //如果没有棋子，单纯的位点没作用
                evt._pieceID = this.active_pieceId;
                this.logic.dispatchEvent(evt);
            }
        }
        else{   //棋盘空白发来的
            console.log("得到棋盘空白的点击消息");
            this.calm_down();
        }
    }
    private do_Action(evt:CheActEvt){   //处理逻辑层给的命令
        console.log("收到逻辑层的消息",evt);
        if (evt._reset){
            console.log("收到了逻辑层传来的再来一局的命令");
            this.startone();
            return 0;
        }
        if (!evt._actPieceid || evt._invalid){  //没有_actPieceid的肯定是不合法的,或得到操作错误的命令，要做的是把所有激活状态的元件放下
            this.calm_down();
            return 0;
        };
        if (evt._effectSites){  //接收到要高亮显示的位点
            this.shine_sites("on",evt._effectSites);
        };
        if (evt._moveToX!=null && evt._moveToY!=null){  //接收到有棋子该移动
            this.movepiece(evt._actPieceid,evt._moveToX,evt._moveToY);
            this.calm_down();
        };
        if (evt._dyingPieceid){ //接受到某棋子被吃掉的命令
            this.pieces_set[evt._dyingPieceid].kill_self();
            this.calm_down();
        };
        if (evt._change_faction){   //接受到换边的命令
            this.change_faction();
        };
        if (evt._revivePieceid){    //接受到要复活某子的命令
            this.pieces_set[evt._revivePieceid].revive_self();
        }
        if (evt._gameover){
            this.game_over(evt._winner);
        }
    }
    private change_faction(t_faction?:string){  //切换当前控制阵营
        if (t_faction){
            this.active_faction = t_faction;
        }else{
            (this.active_faction == "r") ? this.active_faction = "b" : this.active_faction = "r";
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
    private game_over(winner: string){  //游戏结束胜负已分的显示
        if (!winner){   //理论上不会出现这种情况
            console.log("显示层收到逻辑层的gameover消息但没有winner");
            this.calm_down();
            return 0;
        };
        console.log("胜负已分");
        //先蒙上一层幕布
        let shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x888888);
        shape.graphics.drawRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight );
        shape.graphics.endFill();
        shape.alpha = 0.5;
        shape.touchEnabled = true;
        this.addChild( shape );
        //显示游戏结束文字
        let game_over_label:egret.TextField = new egret.TextField();
        this.addChild( game_over_label );
        game_over_label.x = this.stage.width/2;
        game_over_label.y = this.stage.height/2;
        game_over_label.fontFamily = "KaiTi";
        let str_winner: string;
        if (winner == "r"){
            str_winner = "红方";
        }else{
            str_winner = "黑方";
        }
        game_over_label.text = str_winner+"获胜！";
        //显示再来一局
        let reset_game_label:egret.TextField = new egret.TextField();
        this.addChild(reset_game_label);
        reset_game_label.x = game_over_label.x;
        reset_game_label.y = game_over_label.y + 100;
        reset_game_label.text = "再来一局";
        reset_game_label.touchEnabled = true;
        reset_game_label.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            console.log("点击了再来一局",this);
            let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
            CheInput_Event._reset = true;
            this.logic.dispatchEvent(CheInput_Event);
        },this)
    }
}