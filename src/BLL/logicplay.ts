class LogicPlay extends egret.EventDispatcher{
    public initMap = [
        [["c","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["c","b"]],
        [["m","r"],         ,["p","r"],         ,         ,         ,         ,["p","b"],         ,["m","b"]],
        [["x","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["x","b"]],
        [["s","r"],         ,         ,         ,         ,         ,         ,         ,         ,["s","b"]],
        [["j","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["j","b"]],
        [["s","r"],         ,         ,         ,         ,         ,         ,         ,         ,["s","b"]],
        [["x","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["x","b"]],
        [["m","r"],         ,["p","r"],         ,         ,         ,         ,["p","b"],         ,["m","b"]],
        [["c","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["c","b"]]
    ];//注意这数组，看起来就像是反了一样,以后再完善时，这里应该从数据层得到，所以现在设为public也是可以的
    private showplay;
    private Map;    //和initmap不是一样的，Map的元素是可唯一代表LogicPiece对象的id
    private pieces_set: Object;   //所有棋子的集合
    protected active_faction: string;  //当前应该行动的阵营,r或b
    protected human_faction: string;    //玩家控制方 r或b
    protected _gameover: boolean;   //标志此局游戏是否已结束
    private HistoryList: history_record[];   //历史纪录列表
    public constructor(the_showplay?){
        super();
        if (the_showplay){
            this.bind(the_showplay);
        };
    }
    public bind(the_showplay){  //绑定显示层
        this.showplay = the_showplay;
    }
    private change_faction(t_faction?:string){  //切换当前控制阵营
        if (t_faction){
            this.active_faction = t_faction;
        }else{
            (this.active_faction == "r") ? this.active_faction = "b" : this.active_faction = "r";
        }
    }
    private undo(){ //取游戏历史纪录中的最后一条，并按逆向规则修复逻辑层游戏状态并发命令给表现层
        let t_record = this.HistoryList.pop();
        if (!t_record){
            return 0;
        }
        let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
        CheAct_Event._actPieceid = t_record.MovePieceId;
        CheAct_Event._moveToX = t_record.FromX;
        CheAct_Event._moveToY = t_record.FromY;
        let t_act_piece = this.pieces_set[t_record.MovePieceId];
        this.Map[t_act_piece.m_x][t_act_piece.m_y] = null;
        t_act_piece.move(t_record.FromX,t_record.FromY);
        this.Map[t_record.FromX][t_record.FromY] = t_record.MovePieceId;
        if (t_record.DiePieceId){
            let t_re_piece = this.pieces_set[t_record.DiePieceId];
            t_re_piece.revive_self();
            CheAct_Event._revivePieceid = t_record.DiePieceId;
        }
        this.showplay.dispatchEvent(CheAct_Event);
    }
    public startone(){
        /**
         * 开一局
         * 先进行Map、pieces_set的初始化工作和棋子的生成
         */
        if (!this.showplay){
            console.log("logic与show必须互相绑定");
            return 0;
        }
        this.Map = new Array();
        this.pieces_set = {};
        this.HistoryList = new Array();
        this.human_faction = "r";
        this.change_faction("r");
        var tem_P_id_num:number = 0;
        for (var t_i  = 0 ; t_i < this.initMap.length ; t_i++){
            this.Map[t_i] = new Array();
            for (var t_j = 0 ; t_j < this.initMap[t_i].length ; t_j++){
                let tem_id: string = "p_"+tem_P_id_num;
                let tem_element = this.initMap[t_i][t_j];
                if (tem_element){
                    var t_logicpiece = new LogicPiece(tem_element[0],tem_element[1],t_i,t_j,tem_id);
                    this.Map[t_i][t_j] = tem_id;
                    this.pieces_set[tem_id] = t_logicpiece;
                    tem_P_id_num += 1;
                }else{
                    this.Map[t_i][t_j] = null;
                }  
            }
        }
        this.addEventListener(CheInpEvt.Tap,this.reply_showplay,this);
    }
    private reply_showplay(evt:CheInpEvt){   //处理并回应showplay的请求
        if (evt._reset){
            console.log("逻辑层收到了再来一局的请求");
            this.startone();
            let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
            CheAct_Event._reset = true;
            this.showplay.dispatchEvent(CheAct_Event);
            return 0;
        }
        if (evt._undo){
            console.log("逻辑层收到了悔棋的请求");
            this.undo(); this.undo();   //悔一合棋,也就是history中的后两个记录
            return 0;
        }
        if (!evt._pieceID){ //除了悔棋重开等特殊情况理论上不应该出现没_pieceID的evt传到logic这里的，最多传到showplay里
            console.log("logicplay 接收到的CheInpEvt竟没有_pieceID",evt);
            return 0;
        }
        let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
        if (evt._moveToX!=null && evt._moveToY!=null){  //将要移动或吃子的请求
            var t_piece = this.pieces_set[evt._pieceID];
            CheAct_Event._actPieceid = t_piece.p_id;
            CheAct_Event._invalid = true;   //这里先默认_invalid非法操作为true，因为毕竟除了达成移动或吃子的条件，其他情况的moveto请求都按非法操作处理
            t_piece.effect_update(this.Map,this.pieces_set);
            
            if (t_piece.landing_points){
                //判断[evt._moveToX,evt._moveToY]是否在t_piece.landing_points中，方法比较笨,因为js/ts没有现成的方法判断 一个数组 是否存在于 一个以数组为元素的数组中
                let IN_landing_points = false;
                for (let t_point of t_piece.landing_points){
                    if (t_point[0] == evt._moveToX && t_point[1] == evt._moveToY){
                        IN_landing_points = true;
                        break;
                    }
                };
                if (IN_landing_points){
                    
                    if (!this.Map[evt._moveToX][evt._moveToY]){
                        //可以移动
                        CheAct_Event._moveToX = evt._moveToX;
                        CheAct_Event._moveToY = evt._moveToY;
                        CheAct_Event._invalid = false;

                        let t_record = new history_record();
                        t_record.ActFaction = this.active_faction;
                        t_record.MovePieceId = t_piece.p_id;
                        t_record.FromX = t_piece.m_x;
                        t_record.FromY = t_piece.m_y;
                        this.HistoryList.push(t_record);

                        this.Map[t_piece.m_x][t_piece.m_y] = null;
                        t_piece.move(evt._moveToX,evt._moveToY);
                        this.Map[evt._moveToX][evt._moveToY] = t_piece.p_id;

                        CheAct_Event._change_faction = true;
                        this.change_faction();
                    }else{
                        let t_dying_p =this.pieces_set[this.Map[evt._moveToX][evt._moveToY]];
                        if (t_dying_p.p_faction != t_piece.p_faction){
                            //可以吃子
                            CheAct_Event._moveToX = evt._moveToX;
                            CheAct_Event._moveToY = evt._moveToY;
                            CheAct_Event._dyingPieceid = this.Map[evt._moveToX][evt._moveToY];
                            CheAct_Event._invalid = false;

                            let t_record = new history_record();
                            t_record.ActFaction = this.active_faction;
                            t_record.MovePieceId = t_piece.p_id;
                            t_record.FromX = t_piece.m_x;
                            t_record.FromY = t_piece.m_y;
                            t_record.DiePieceId = t_dying_p.p_id;
                            this.HistoryList.push(t_record);
                            
                            this.Map[t_piece.m_x][t_piece.m_y] = null;
                            t_piece.move(evt._moveToX,evt._moveToY);
                            this.Map[evt._moveToX][evt._moveToY] = t_piece.p_id;
                            CheAct_Event._change_faction = true;
                            this.change_faction();
                            t_dying_p.kill_self();
                            if (t_dying_p.p_role == "j"){   //将被吃了
                                CheAct_Event._gameover = true;
                                CheAct_Event._winner = (t_dying_p.p_faction == "r") ? "b" : "r";
                            };
                        } 
                    } 
                }
            }
        }else{  //仅仅要求一个棋子的可移动范围等
            var t_piece = this.pieces_set[evt._pieceID];
            t_piece.effect_update(this.Map,this.pieces_set);
            CheAct_Event._actPieceid = t_piece.p_id;
            CheAct_Event._effectSites = t_piece.landing_points;
            CheAct_Event._invalid = false;
        }
        this.showplay.dispatchEvent(CheAct_Event);
    }
}