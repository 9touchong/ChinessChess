class LogicPlay extends egret.DisplayObject{
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
    ];//注意这数组，看起来就像是反了一样,以后再完善时，这里应该从数据层得到，所以现在设为public也是可以的.可以看作是侧视图
    private showplay;
    private Map;    //和initmap不是一样的，Map的元素是可唯一代表LogicPiece对象的id
    private pieces_set: Object;   //所有棋子的集合
    private active_faction: string;  //当前应该行动的阵营,r或b
    private human_faction: string;    //玩家控制方,己方 r或b 不论哪种模式下
    private _gameover: boolean;   //标志此局游戏是否已结束
    private HistoryList: history_record[];   //历史纪录列表
    private phas_var: Object;   //一些在运行过程中个别游戏功能需要的全局的变量，因为这些变量多而杂，且非用于主体程序，而且之后版本有更改的可能，放在一个{}里了
    private AI;
    private CS_mode: boolean;   //是否是C/S模式 即联机对战
    private WS: egret.WebSocket; //与服务器的websocket连接，现在版本就是C/S模式，必须与服务器保持连接
    public constructor(the_showplay?){
        super();
        if (the_showplay){
            this.bind(the_showplay);
        };
    }
    public bind(the_showplay){  //绑定显示层
        this.showplay = the_showplay;
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
        this.open_CS();
        //this.setInitChess();     
    }
    public get_property(property:string){
        let return_property: any;
        switch (property){
            case "human_faction":
                return_property = this.human_faction;
                break;
            case "active_faction":
                return_property = this.active_faction;
                break;
            case "active_faction":
                return_property = this.active_faction;
                break;
            case "initMap":
                return_property = this.initMap;
                break;
            case "Map":
                return_property = this.Map;
                break;
            default:
                return null;
        };
        return return_property;
    }
    private setInitChess(your_faction: string = "r"){
        /**
         * 初始化棋局，包括摆棋等,每局游戏正式开始前的必须准备工作
         */
        this.Map = new Array();
        this.pieces_set = {}; 
        if (!this.CS_mode){
            this.HistoryList = new Array(); //现在版本本地模式需要，网络对战就不需要本地历史纪录了，以后若要优化强化AI可能AI还要更依赖历史纪录，而网络对战弱有挂机托管功能还是要依赖ai的
        };
        this.human_faction = your_faction;
        this.change_faction(your_faction);
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
        };
        if (!this.CS_mode){ //本地打电脑 ai代表对方
            let AI_faction = (this.human_faction == "r") ? "b" : "r";
            this.AI = new AI(this.Map,this.pieces_set,AI_faction);
        }else{  //网络对战模式 当托管时用的上ai 代表自己
            let AI_faction = this.human_faction
            this.AI = new AI(this.Map,this.pieces_set,AI_faction);
        }
        
        this.phas_var = {};
        this.phas_var["just_move_steps"] = 0;   //连续没发生吃子的步数,判断是否磨棋时有用
        if (!this.CS_mode){
            this.addEventListener(CheInpEvt.Tap,this.reply_showplay,this);
        }else{
            this.addEventListener(CheInpEvt.Tap,this.reply_showplay_toCS,this);
        }
        this.showplay.startone();
        console.log("客户端完成了自己的初始化",your_faction);
    }
    private adjust_show(){  //让显示层自行根据逻辑层矫正自己
        let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
        CheAct_Event._adjust = true;
        this.showplay.dispatchEvent(CheAct_Event);
    }
    private open_CS(){
        /*C/S模式的ws连接即处理函数等*/
        this.CS_mode = true;
        this.WS = new egret.WebSocket();
        this.WS.addEventListener(egret.Event.CONNECT,function(evt:egret.Event){
            console.log("logicplay 与ws服务器取得了连接");
            let send_d = {"join":true}; //请求加入游戏
            this.WS.writeUTF(JSON.stringify(send_d));
            this.WS.flush();
        },this);//连接服务器侦听
        this.WS.addEventListener(egret.ProgressEvent.SOCKET_DATA,this.reply_WS_toShow,this);//服务器消息侦听
        this.WS.addEventListener(egret.Event.CLOSE,function(evt:egret.Event){
            console.log("logicplay 与ws服务器连接断开了");
        },this);//ws连接断开侦听
        this.WS.connectByUrl("ws://192.168.1.102:2357/forChinessChess");
    }
    private change_faction(t_faction?:string){  //切换当前控制阵营
        if (t_faction){
            this.active_faction = t_faction;
        }else{
            (this.active_faction == "r") ? this.active_faction = "b" : this.active_faction = "r";
        };
        if (!this.CS_mode){ //本地对战电脑时 控制权传给ai
            if (this.active_faction != this.human_faction){ //轮到非人类玩家方，AI行动
            //this.ai_act();
            setTimeout(() => {this.ai_act();},100); //这里要延时一下，因为ai的运算量挺大，难免会造成卡顿，就在ai运行前把己方走棋动画的时间容出来，这里定100，保险起见更大些较好
            }
        };
    }
    private undo(){ //悔棋，取游戏历史纪录中的最后一条，并按逆向规则修复逻辑层游戏状态并发命令给表现层
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
    private reply_showplay(evt:CheInpEvt){   //处理并回应showplay的请求
        let whether_change_faction: boolean = false;    //标记是否换边，但不能当时马上换，要在把返回给表现层的消息发出之后再执行
        if (evt._reset){
            console.log("逻辑层收到了再来一局的请求");
            this.startone();
            let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
            CheAct_Event._reset = true;
            this.showplay.dispatchEvent(CheAct_Event);
            return 0;
        }
        if (evt._giveup){
            console.log("逻辑层收到了认输的请求");
            //this._gameover = true;
            let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
            CheAct_Event._gameover = true;
            CheAct_Event._winner = (this.active_faction == "r") ? "b" : "r";    //简化处理，其实本地对战或本地AI对战时，谁什么时候按投降时没有限制的
            this.showplay.dispatchEvent(CheAct_Event);
            return 0;

        }
        if (evt._undo){
            console.log("逻辑层收到了悔棋的请求");
            this.undo(); this.undo();   //悔一合棋,也就是history中的后两个记录,虽然this.undo()内部没有更改act faction，因为是两步一回合，act faction 没变
            return 0;
        }
        if (!evt._pieceID){ //除了悔棋重开等特殊情况理论上不应该出现没_pieceID的evt传到logic这里的，最多传到showplay里
            console.log("logicplay 接收到的CheInpEvt竟没有_pieceID",evt);
            return 0;
        }
        let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
        if (evt._moveToX!=null && evt._moveToY!=null){  //将要移动或吃子的请求
            let t_piece : LogicPiece  = this.pieces_set[evt._pieceID];
            if (t_piece.get_property("p_faction") != this.active_faction){
                console.log("逻辑层接收到来自表现层的非行动方行动请求，一定是bug，请检查");
                CheAct_Event._invalid = true;
                this.showplay.dispatchEvent(CheAct_Event);
                return 0;
            }
            CheAct_Event._actPieceid = evt._pieceID;
            CheAct_Event._invalid = true;   //这里先默认_invalid非法操作为true，因为毕竟除了达成移动或吃子的条件，其他情况的moveto请求都按非法操作处理
            t_piece.effect_update(this.Map,this.pieces_set);
            
            let landing_points = t_piece.get_property("landing_points");
            if (landing_points){
                //判断[evt._moveToX,evt._moveToY]是否在t_piece.landing_points中，方法比较笨,因为js/ts没有现成的方法判断 一个数组 是否存在于 一个以数组为元素的数组中
                let IN_landing_points = false;
                for (let t_point of landing_points){
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
                        t_record.MovePieceId = t_piece.get_property("p_id");
                        t_record.FromX = t_piece.get_property("m_x");
                        t_record.FromY = t_piece.get_property("m_y");
                        this.HistoryList.push(t_record);

                        //是否磨棋检查
                        this.phas_var["just_move_steps"] += 1;
                        if (this.phas_var["just_move_steps"] >8 ){
                            let l = this.HistoryList.length - 1;
                            if (this.compare_records(this.HistoryList[l],this.HistoryList[l-4]) && this.compare_records(this.HistoryList[l],this.HistoryList[l-8])){
                                if (this.compare_records(this.HistoryList[l-1],this.HistoryList[l-5]) && this.compare_records(this.HistoryList[l-2],this.HistoryList[l-6]) && this.compare_records(this.HistoryList[l-3],this.HistoryList[l-7])){
                                    //可以确定有磨棋行为
                                    console.log("发现有磨棋行为");
                                    CheAct_Event._gameover = true;
                                    //判断是要和棋还是先磨棋的一方输 要注意现在写进了历史纪录的这一步操作还没有在逻辑map中更新执行 要利用AI
                                    let move_order = this.AI.oneAImove(2,this.Map,this.active_faction);
                                    if (!move_order){
                                        //和棋
                                        console.log("磨棋是因为无棋可走，和棋");
                                        CheAct_Event._winner ="no";
                                    }else if (t_record.MovePieceId == move_order.move_id && evt._moveToX == move_order.newX && evt._moveToY == move_order.newY){
                                        //和棋
                                        console.log("磨棋是因为除此无棋可走，和棋");
                                        CheAct_Event._winner ="no";
                                    }else{
                                        //先磨棋的一方输
                                        console.log(this.active_faction,"方磨棋违规，判负")
                                        CheAct_Event._winner = (this.active_faction == "r") ? "b" : "r";
                                    }
                                }
                            }
                        };

                        this.Map[t_record.FromX][t_record.FromY] = null;
                        t_piece.move(evt._moveToX,evt._moveToY);
                        this.Map[evt._moveToX][evt._moveToY] = t_record.MovePieceId;

                        CheAct_Event._change_faction = true;
                        //this.change_faction();
                        whether_change_faction = true;
                    }else{
                        let t_dying_p: LogicPiece =this.pieces_set[this.Map[evt._moveToX][evt._moveToY]];
                        if (t_dying_p.get_property("p_faction") != t_piece.get_property("p_faction")){
                            //可以吃子
                            CheAct_Event._moveToX = evt._moveToX;
                            CheAct_Event._moveToY = evt._moveToY;
                            CheAct_Event._dyingPieceid = this.Map[evt._moveToX][evt._moveToY];
                            CheAct_Event._invalid = false;

                            let t_record = new history_record();
                            t_record.ActFaction = this.active_faction;
                            t_record.MovePieceId = t_piece.get_property("p_id");
                            t_record.FromX = t_piece.get_property("m_x");
                            t_record.FromY = t_piece.get_property("m_y");
                            t_record.DiePieceId = t_dying_p.get_property("p_id");
                            this.HistoryList.push(t_record);
                            this.phas_var["just_move_steps"] = 0;
                            
                            this.Map[t_record.FromX][t_record.FromY] = null;
                            t_piece.move(evt._moveToX,evt._moveToY);
                            this.Map[evt._moveToX][evt._moveToY] = t_record.MovePieceId;
                            CheAct_Event._change_faction = true;
                            //this.change_faction();
                            whether_change_faction = true;
                            t_dying_p.kill_self();
                            if (t_dying_p.get_property("p_role") == "j"){   //将被吃了
                                CheAct_Event._gameover = true;
                                CheAct_Event._winner = (t_dying_p.get_property("p_faction") == "r") ? "b" : "r";
                            };
                        } 
                    } 
                }
            }
        }else{  //仅仅要求一个棋子的可移动范围等
            let t_piece: LogicPiece = this.pieces_set[evt._pieceID];
            t_piece.effect_update(this.Map,this.pieces_set);
            CheAct_Event._actPieceid = t_piece.get_property("p_id");
            CheAct_Event._effectSites = t_piece.get_property("landing_points");
            CheAct_Event._invalid = false;
        }
        this.showplay.dispatchEvent(CheAct_Event);
        if (whether_change_faction){
            this.change_faction();
        }
    }
    private reply_showplay_toCS(evt:CheInpEvt){ //C/S模式下的reply_showplay
        if (evt._giveup || evt._reset){
            let send_d = {"_giveup":true};
            this.WS.writeUTF(JSON.stringify(send_d));
            this.WS.flush();
            return 0;
        }
        if (evt._undo){
            let send_d = {"_undo":true};
            this.WS.writeUTF(JSON.stringify(send_d));
            this.WS.flush();
            return 0;
        }
        if (!evt._pieceID){ //除了悔棋重开等特殊情况理论上不应该出现没_pieceID的evt传到logic这里的，最多传到showplay里
            console.log("logicplay 接收到的CheInpEvt竟没有_pieceID",evt);
            return 0;
        }
        if (evt._moveToX!=null && evt._moveToY!=null){
            let send_d = {"_pieceID":evt._pieceID,"_moveToX":evt._moveToX,"_moveToY":evt._moveToY};
            this.WS.writeUTF(JSON.stringify(send_d));
            this.WS.flush();
            return 0;
        }else{  //仅仅要求一个棋子的可移动范围等,不必麻烦服务器
            let t_piece: LogicPiece = this.pieces_set[evt._pieceID];
            t_piece.effect_update(this.Map,this.pieces_set);
            let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act);
            CheAct_Event._actPieceid = t_piece.get_property("p_id");
            CheAct_Event._effectSites = t_piece.get_property("landing_points");
            CheAct_Event._invalid = false;
            this.showplay.dispatchEvent(CheAct_Event);
        }
    }
    
    private ai_act(){   //AI 注意运行时间比较长
        console.log("AI start!!");
        let move_order = this.AI.oneAImove();
        if (!move_order){
            console.log("AI 不会走了 准备认输了");
            return 0;
        };
        let CheInp_Event: CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
        CheInp_Event._pieceID = move_order.move_id;
        CheInp_Event._moveToX = move_order.newX;
        CheInp_Event._moveToY = move_order.newY;
        this.reply_showplay(CheInp_Event);
    }
    private compare_records(r1,r2){
        /**
         * 比较两个操作记录是否一样
         * 不必所有项都比较遍了
         */
        if (r1.MovePieceId == r2.MovePieceId && r1.FromX == r2.FromX && r1.FromY == r2.FromY){
            return true;
        }
        return false;
    }
    private reply_WS_toShow(evt:egret.ProgressEvent){  //C/S模式下处理并回应ws服务器推送过来的消息转发行动命令给show 事实上此模式下一切实质性的行为都由服务器告诉的驱动
        let msg:string = this.WS.readUTF();
        let d_msg  = JSON.parse(msg);
        console.log("收到ws服务器的消息",d_msg);
        if (d_msg.your_faction){   //被允许加入游戏 得到了分配给你的身份
            this.setInitChess(d_msg.your_faction);
            return 0;
        };
        let CheAct_Event: CheActEvt = new CheActEvt(CheActEvt.Act); 
        if (d_msg._invalid){
            CheAct_Event._invalid = true;
            this.showplay.dispatchEvent(CheAct_Event);
            return 0;
        }
        if (d_msg._moveToX!=null && d_msg._moveToY!=null){  //移动棋子
            if (!d_msg._actPieceid){
                console.log("报错：接收到服务器传来无pieceid的移动命令，请修改代码");
                return 0;
            }
            let t_piece : LogicPiece  = this.pieces_set[d_msg._actPieceid];
            let old_x = t_piece.get_property("m_x");
            let old_y = t_piece.get_property("m_y");
            this.Map[old_x][old_y] = null;
            t_piece.move(d_msg._moveToX,d_msg._moveToY);
            this.Map[d_msg._moveToX][d_msg._moveToY] = d_msg._actPieceid;

            CheAct_Event._actPieceid = d_msg._actPieceid;
            CheAct_Event._moveToX = d_msg._moveToX;
            CheAct_Event._moveToY = d_msg._moveToY;
        }
        if (d_msg._dyingPieceid){   //吃子 注意这里就杀死被吃的子就行，不要注销其原map位置，因为吃他的子那里已经处理过了
            let t_piece : LogicPiece  = this.pieces_set[d_msg._dyingPieceid];
            t_piece.kill_self();
            CheAct_Event._dyingPieceid = d_msg._dyingPieceid;
        }
        if (d_msg._revivePieceid){  //复活 同时要在map上为其复位
            let t_piece : LogicPiece  = this.pieces_set[d_msg._revivePieceid];
            t_piece.revive_self();
            let re_x = t_piece.get_property("m_x");
            let re_y = t_piece.get_property("m_y");
            this.Map[re_x][re_y] = d_msg._revivePieceid;
            CheAct_Event._revivePieceid = d_msg._revivePieceid;
        }
        if (d_msg._change_faction){
            this.change_faction();
            CheAct_Event._change_faction = true;
        }
        if (d_msg._winner){
            CheAct_Event._gameover = true;
            CheAct_Event._winner = d_msg._winner;
        }
    }
}