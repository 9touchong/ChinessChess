/**
 * 表现层主程
 */

class ShowPlay extends egret.DisplayObjectContainer {
    private logic;  //配套的逻辑系统
    private assets_ready:boolean;
    protected pieces_set: Object;   //所有棋子的集合
    protected sites_tab;    //所有位点的表
    protected active_pieceId: string;    //当前活跃棋子的id，即被拿起来的那个
    protected active_faction: string;  //当前应该行动的阵营,r或b 但表现层似乎不用这个也行 所有判断工作都交给逻辑层呢 
    protected shining_points_list;   //当前高亮显示的位点列表，用[m_x,m_y]表示
    protected human_faction: string;    //玩家控制方 r或b
    private context3d;
    private part2d:Scene2d;
    private part3d:Scene3d;
    constructor(the_context3d,the_logic?) {
        super();
        this.context3d = the_context3d;
        if (the_logic){
            this.bind(the_logic);
        }
    }

    public bind(the_logic){ //绑定逻辑层程序对象
        this.logic = the_logic;
    }

    public startone(){
        if (!this.logic){
            console.log("logic与show必须互相绑定");
            return 0;
        };
        this.removeChildren();

            this.human_faction = this.logic.get_property("human_faction");

            this.part3d = new Scene3d(this.context3d,this);
            this.part3d.createGameScene();

            this.part2d = new Scene2d(this);
            this.addChild(this.part2d);

            this.active_faction = this.logic.get_property("active_faction");
            this.addEventListener(CheInpEvt.Tap,this.tra_CheInp,this);
            this.addEventListener(CheActEvt.Act,this.do_Action,this);
        console.log("it is show's startone");
    }
    private tra_CheInp(evt:CheInpEvt){  //处理棋盘棋子按钮等点击后的消息
        if (evt._undo || evt._giveup){ //悔棋按钮
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
    private adjustByLogic(){
        /**
         * 自行矫正与logic一致
         * 完善中
         */
        this.human_faction = this.logic.get_property("human_faction");
        this.active_faction = this.logic.get_property("active_faction");
    }
    private do_Action(evt:CheActEvt){   //处理逻辑层给的命令
        console.log("收到逻辑层的消息",evt);
        if (evt._adjust){
            console.log("收到了逻辑层传来的矫正的命令");
            //this.adjustByLogic();
        }
        console.log("收到逻辑层的消息",new Date().getTime(),evt);
        if (evt._reset){
            console.log("收到了逻辑层传来的再来一局的命令");
            this.startone();
            return 0;
        }
        //if (!evt._actPieceid || evt._invalid){  //没有_actPieceid的肯定是不合法的,或得到操作错误的命令，要做的是把所有激活状态的元件放下
        if (evt._invalid){  //没有_actPieceid的判断弊大于利，不进行判断了 出现!evt._actPieceid 而又有其他移动的操作的情况本就是bug，不能用!evt._actPieceid掩盖
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
        
        console.log("do_Action 处理完成",new Date().getTime(),evt);
    }
    private change_faction(t_faction?:string){  //切换当前控制阵营
        if (t_faction){
            this.active_faction = t_faction;
        }else{
            (this.active_faction == "r") ? this.active_faction = "b" : this.active_faction = "r";
        }
        if (this.active_faction != this.human_faction){
            //console.log("显示层轮到AI了",new Date().getTime());
            //let CheInp_Event: CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
            //CheInp_Event._AiAct = true;
            //this.logic.dispatchEvent(CheInp_Event,true);
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
        this.pieces_set[pieceID].move(m_x,m_y,t_site.body.x,t_site.body.z);
    }
    public game_over(winner: string){
        if (!winner){   //理论上不会出现这种情况
            console.log("显示层收到逻辑层的gameover消息但没有winner");
            //this.calm_down();
            return 0;
        };
        console.log("胜负已分");
        this.part2d.game_over(winner);
    }
}