//class LogicPiece extends egret.DisplayObject{
class LogicPiece{
    /**
     * 逻辑模式棋子
     * 一些属性的命名考虑了与表现层中的Piece类一致
     */
    private m_x : number;
    private m_y : number;
	private p_role : string;
	private p_faction : string;
	private p_id : string;
    private living : boolean = true;    //是否活着
    private landing_points; //棋子下一步可能落点集,包括有敌子在的落点而不包括自身,数组，元素是[m_x,m_y]
    private menace_pieces;  //棋子可以威胁到的敌方子，即下一步可以吃到的子,数组,元素是p_id
    public constructor(p_role:string,p_faction:string,m_x:number,m_y:number,p_id?:string){
        //super();
        if (p_id){
			this.p_id = p_id;
		}
        this.m_x = m_x;
		this.m_y = m_y;
		this.p_role = p_role;
		this.p_faction = p_faction;
    }
    public set_p_id(p_id:string){
		this.p_id = p_id;
	}
    public effect_update(map,piece_set){
        /**
         * 影响力更新
         * 获得当前棋子的所有合法着点和可直接吃掉的子，这些可以看做棋子在棋局中的影响力
         * 因为这个的实现要一个完整的map和所有棋子对照表p_set，所以放在上一级logicplay中也可以，好像还更合理，以后也可能转移
         * 参数map和p_set就是LogicPlay中的Map和pieces_set；
         * 不设返回值，只是更新当前棋子的landing_points和menace_pieces属性
         */
        let tem_points = [];
        let tem_pieces = [];
        let [Min_x,Min_y,Max_x,Max_y] = [0,0,8,9]; //map的最大范围，横9纵10，这样声明一下主要便于以后修改
        switch(this.p_role){
            case "c":   //车
                for (let t_x=this.m_x-1 ; t_x>=Min_x ; t_x--){    //左遍历
                    let t_p_id = map[t_x][this.m_y];
                    if (!t_p_id){  //未遇到棋子
                        tem_points.push([t_x,this.m_y]);
                    }else{  //遇到棋子
                        if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                            tem_points.push([t_x,this.m_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                for (let t_x = this.m_x+1 ; t_x <= Max_x ; t_x++){  //右遍历
                    let t_p_id = map[t_x][this.m_y];
                    if (!t_p_id){  //未遇到棋子
                        tem_points.push([t_x,this.m_y]);
                    }else{  //遇到棋子
                        if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                            tem_points.push([t_x,this.m_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                for (let t_y = this.m_y-1 ; t_y >= Min_y ; t_y--){  //上遍历
                    let t_p_id = map[this.m_x][t_y];
                    if (!t_p_id){  //未遇到棋子
                        tem_points.push([this.m_x,t_y]);
                    }else{  //遇到棋子
                        if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                            tem_points.push([this.m_x,t_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                for (let t_y = this.m_y+1 ; t_y <= Max_y ; t_y++){  //下遍历
                    let t_p_id = map[this.m_x][t_y];
                    if (!t_p_id){  //未遇到棋子
                        tem_points.push([this.m_x,t_y]);
                    }else{  //遇到棋子
                        if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                            tem_points.push([this.m_x,t_y]);
                            tem_pieces.push(t_p_id);
                        }
                        break;
                    }
                };
                break;
            case "m":
                let possible_legpoints = [  //马腿可以走的八组位置，每组包括移动或吃子点和別腿点
                    [this.m_x + 1 , this.m_y - 2 , this.m_x , this.m_y - 1],    //前两个代表移动或吃子点，后两个代表別腿点
                    [this.m_x + 2 , this.m_y - 1 , this.m_x + 1 , this.m_y],
                    [this.m_x + 2 , this.m_y + 1 , this.m_x + 1 , this.m_y],
                    [this.m_x + 1 , this.m_y + 2 , this.m_x , this.m_y + 1],
                    [this.m_x - 1 , this.m_y + 2 , this.m_x , this.m_y + 1],
                    [this.m_x - 2 , this.m_y + 1 , this.m_x - 1 , this.m_y],
                    [this.m_x - 2 , this.m_y - 1 , this.m_x - 1 , this.m_y],
                    [this.m_x - 1 , this.m_y - 2 , this.m_x , this.m_y - 1],
                ];
                for (let t_points of possible_legpoints){
                    if (t_points[0]<Min_x || t_points[0]>Max_x || t_points[1]<Min_y || t_points[1]>Max_y){  //跳过棋盘外点
                        continue;
                    }
                    if (map[t_points[2]][t_points[3]]){ //别腿
                        continue;
                    }
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //空白点
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //有敌子
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "p":
                break;
            case "x":
                break;
            case "s":
                break;
            case "z":
                break;
            case "j":
                break;
            default:
                tem_points = tem_pieces = null;
        }
        this.landing_points = tem_points;
        this.menace_pieces = tem_pieces;
    }
    public move(m_x:number,m_y:number){
        this.m_x = m_x;
        this.m_y = m_y;
    }
    public kill_self(){
        this.living = false;
    }
}