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
    public startone(){
        /**
         * 开一局
         * 先进行Map、pieces_set的初始化工作和棋子的生成
         */
        this.Map = new Array();
        this.pieces_set = {};
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
        console.log ("收到显示层的消息",evt);
        if (!evt._pieceID){ //不应该出现没_pieceID的evt传到logic这里的，最多传到showplay里
            console.log("logicplay 接收到的CheInpEvt竟没有_pieceID",evt);
            return 0;
        }
        if (evt._moveToX && evt._moveToY){  //将要移动或吃子的请求
            let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
            var t_piece = this.pieces_set[evt._pieceID];
            CheAct_Event._actPieceid = t_piece.p_id;
            
            CheAct_Event._invalid = true;
            t_piece.effect_update(this.Map,this.pieces_set);
            
            if (t_piece.landing_points){
                //判断[evt._moveToX,evt._moveToY]是否在t_piece.landing_points中，方法比较笨
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
                        this.Map[t_piece.m_x][t_piece.m_y] = null;
                        t_piece.move(evt._moveToX,evt._moveToY);
                        this.Map[evt._moveToX][evt._moveToY] = t_piece.p_id;
                    }else if (this.pieces_set[this.Map[evt._moveToX][evt._moveToY]].p_faction != t_piece.p_faction){
                        //可以吃子
                        CheAct_Event._moveToX = evt._moveToX;
                        CheAct_Event._moveToY = evt._moveToY;
                        CheAct_Event._dyingPieceid = this.Map[evt._moveToX][evt._moveToY];
                        CheAct_Event._invalid = false;
                        this.pieces_set[this.Map[evt._moveToX][evt._moveToY]].kill_self();
                        this.Map[t_piece.m_x][t_piece.m_y] = null;
                        t_piece.move(evt._moveToX,evt._moveToY);
                        this.Map[evt._moveToX][evt._moveToY] = t_piece.p_id;
                    }
                }
            }
            this.showplay.dispatchEvent(CheAct_Event);
        }else{  //仅仅要求一个棋子的可移动范围等
            var t_piece = this.pieces_set[evt._pieceID];
            t_piece.effect_update(this.Map,this.pieces_set);
            //console.log("hehrht",t_piece.landing_points);
            let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
            CheAct_Event._actPieceid = t_piece.p_id;
            CheAct_Event._effectSites = t_piece.landing_points;
            CheAct_Event._invalid = false;
            this.showplay.dispatchEvent(CheAct_Event);
        }
    }
}