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
    public get_property(property:string){
        let return_property: any;
        switch (property){
            case "m_x":
                return_property =  this.m_x;
                break;
            case "m_y":
                return_property =  this.m_y;
                break;
            case "p_role":
                return_property =  this.p_role;
                break;
            case "p_faction":
                return_property =  this.p_faction;
                break;
            case "p_id":
                return_property =  this.p_id;
                break;
            case "living":
                return_property =  this.living;
                break;
            case "landing_points":
                return_property =  this.landing_points;
                break;
            case "menace_pieces":
                return_property =  this.menace_pieces;
                break;
            default:
                return null;
        }
        return return_property;
    }
    public effect_update(map,piece_set){
        /**
         * 影响力更新
         * 获得当前棋子的所有合法着点和可直接吃掉的子，这些可以看做棋子在棋局中的影响力
         * 因为这个的实现要一个完整的map和所有棋子对照表p_set，所以放在上一级logicplay中也可以，好像还更合理，以后也可能转移
         * 参数map和p_set就是LogicPlay中的Map和pieces_set；
         * 不设返回值，只是更新当前棋子的landing_points和menace_pieces属性
         */
        if (map[this.m_x][this.m_y] != this.p_id){  //要首先验证map与棋子本身位置状态是否一致，否则以map校准
            for (let t_x = 0 ; t_x < map.length ; t_x++){
                for (let t_y = 0 ; t_y < map[t_x].length ; t_y++){
                    if (map[t_x][t_y] == this.p_id){
                        this.move(t_x,t_y);
                        break;
                    }
                }
            };
        };
        let tem_points = [];
        let tem_pieces = [];
        let [Min_x,Min_y,Max_x,Max_y] = [0,0,8,9]; //map的最大范围，横9纵10，这样声明一下主要便于以后修改
        let [r_minY,r_maxY,b_minY,b_maxY] = [0,4,5,9];  //以y坐标区分红黑分界，目的同上
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
                        if (piece_set[t_p_id].get_property("p_faction") != this.p_faction){ //敌子
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
            case "m":   //马
                let possible_legpoints_ma:number[][] = [  //马腿可以走的八组位置，每组包括移动或吃子点和別腿点
                    [this.m_x + 1 , this.m_y - 2 , this.m_x , this.m_y - 1],    //前两个代表移动或吃子点，后两个代表別腿点
                    [this.m_x + 2 , this.m_y - 1 , this.m_x + 1 , this.m_y],
                    [this.m_x + 2 , this.m_y + 1 , this.m_x + 1 , this.m_y],
                    [this.m_x + 1 , this.m_y + 2 , this.m_x , this.m_y + 1],
                    [this.m_x - 1 , this.m_y + 2 , this.m_x , this.m_y + 1],
                    [this.m_x - 2 , this.m_y + 1 , this.m_x - 1 , this.m_y],
                    [this.m_x - 2 , this.m_y - 1 , this.m_x - 1 , this.m_y],
                    [this.m_x - 1 , this.m_y - 2 , this.m_x , this.m_y - 1],
                ];
                for (let t_points of possible_legpoints_ma){
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
            case "p":   //炮
                let hill:boolean = false;   //炮要隔山打
                for (let t_x=this.m_x-1 ; t_x>=Min_x ; t_x--){    //左遍历
                    let t_p_id = map[t_x][this.m_y];
                    if (hill){
                        if (t_p_id){  //遇到棋子
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                                tem_points.push([t_x,this.m_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){    //第一次遇到棋子，就是可以架炮的那个山
                            hill = true;
                        }else{
                            tem_points.push([t_x,this.m_y]);
                        }
                    }
                };
                hill = false;
                for (let t_x = this.m_x+1 ; t_x <= Max_x ; t_x++){  //右遍历
                    let t_p_id = map[t_x][this.m_y];
                    if (hill){
                        if (t_p_id){  //遇到棋子
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                                tem_points.push([t_x,this.m_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){
                            hill = true;
                        }else{
                            tem_points.push([t_x,this.m_y]);
                        }
                    }
                };
                hill = false;
                for (let t_y = this.m_y-1 ; t_y >= Min_y ; t_y--){  //上遍历
                    let t_p_id = map[this.m_x][t_y];
                    if (hill){   
                        if (t_p_id){  //遇到棋子
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){
                            hill = true;
                        }else{
                            tem_points.push([this.m_x,t_y]);
                        }
                    }
                };
                hill = false;
                for (let t_y = this.m_y+1 ; t_y <= Max_y ; t_y++){  //下遍历
                    let t_p_id = map[this.m_x][t_y];
                    if (hill){
                        if (t_p_id){  //遇到棋子
                            if (piece_set[t_p_id].p_faction != this.p_faction){ //敌子
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }
                            break;
                        }
                    }else{
                        if (t_p_id){
                            hill = true;
                        }else{
                            tem_points.push([this.m_x,t_y]);
                        }
                    }
                };
                break;
            case "x":   //相
                let y_min : number;
                let y_max : number;
                if (this.p_faction == "r"){
                    y_min = r_minY;
                    y_max = r_maxY;
                }else{  //b
                    y_min = b_minY;
                    y_max = b_maxY;
                };
                let possible_legpoints_xiang:number[][] = [   //这里设定和马类似 四组象腿可走点和别腿点 两个点四个数
                    [this.m_x + 2 , this.m_y - 2 , this.m_x + 1 , this.m_y - 1],
                    [this.m_x + 2 , this.m_y + 2 , this.m_x + 1 , this.m_y + 1],
                    [this.m_x - 2 , this.m_y + 2 , this.m_x - 1 , this.m_y + 1],
                    [this.m_x - 2 , this.m_y - 2 , this.m_x - 1 , this.m_y - 1],
                ];
                for (let t_points of possible_legpoints_xiang){
                    if (t_points[0]<Min_x || t_points[0]>Max_x || t_points[1]<y_min || t_points[1]>y_max){
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
            case "s":   //仕
                let [x_min_s,x_max_s,y_min_s,y_max_s] = [0,0,0,0];
                if (this.p_faction == "r"){
                    [x_min_s,x_max_s,y_min_s,y_max_s] = [3,5,0,2];
                }else{  //"b"
                    [x_min_s,x_max_s,y_min_s,y_max_s] = [3,5,7,9];
                };
                let possible_landpoints_shi : number[][] = [
                    [this.m_x + 1 , this.m_y + 1],
                    [this.m_x + 1 , this.m_y - 1],
                    [this.m_x - 1 , this.m_y + 1],
                    [this.m_x - 1 , this.m_y - 1],
                ];
                for (let t_points of possible_landpoints_shi){
                    if (t_points[0]<x_min_s || t_points[0]>x_max_s || t_points[1]<y_min_s || t_points[1]>y_max_s){
                        continue;
                    };
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //空白点
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //有敌子
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "z":   //卒
                let forward_z: number;  //其实就是正负一，代表前进方向
                let cross_river:boolean = false;    //是否过河
                if (this.p_faction == "r"){
                    //forward_z = (b_minY - r_maxY) / Math.abs(b_minY - r_maxY);
                    forward_z = 1;
                    if (this.m_y > r_maxY){
                        cross_river = true;
                    }
                }else{  //b
                    //forward_z = (r_maxY - b_minY) / Math.abs(r_maxY - b_minY);
                    forward_z = -1;
                    if (this.m_y < b_minY){
                        cross_river = true;
                    }
                };
                let possible_landpoints_zu : number[][];
                if (cross_river){
                    possible_landpoints_zu = [
                        [this.m_x,this.m_y + forward_z],
                        [this.m_x - 1 , this.m_y],
                        [this.m_x + 1 , this.m_y],
                    ];
                }else{
                    possible_landpoints_zu = [
                        [this.m_x,this.m_y + forward_z],
                    ];                    
                };
                for (let t_points of possible_landpoints_zu){
                    if (t_points[0]<Min_x || t_points[0]>Max_x || t_points[1]<Min_y || t_points[1]>Max_y){
                        continue;
                    };
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //空白点
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //有敌子
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                }
                break;
            case "j":
                let [x_min_j,x_max_j,y_min_j,y_max_j] = [0,0,0,0];
                if (this.p_faction == "r"){
                    [x_min_j,x_max_j,y_min_j,y_max_j] = [3,5,0,2];
                }else{  //"b"
                    [x_min_j,x_max_j,y_min_j,y_max_j] = [3,5,7,9];
                };
                let possible_landpoints_jiang : number[][] = [
                    [this.m_x + 1 , this.m_y],
                    [this.m_x - 1 , this.m_y],
                    [this.m_x , this.m_y + 1],
                    [this.m_x , this.m_y - 1],
                ];
                for (let t_points of possible_landpoints_jiang){
                    if (t_points[0]<x_min_j || t_points[0]>x_max_j || t_points[1]<y_min_j || t_points[1]>y_max_j){
                        continue;
                    };
                    let t_p_id = map[t_points[0]][t_points[1]];
                    if (!t_p_id){   //空白点
                        tem_points.push([t_points[0],t_points[1]]);
                    }else if (piece_set[t_p_id].p_faction != this.p_faction){   //有敌子
                        tem_points.push([t_points[0],t_points[1]]);
                        tem_pieces.push(t_p_id);
                    }
                };
                //帅对将情况
                
                if (this.p_faction == "r"){
                    for (let t_y = this.m_y+1 ; t_y <= Max_y ; t_y++){
                        let t_p_id = map[this.m_x][t_y];
                        if (t_p_id){
                            let t_p = piece_set[t_p_id];
                            if (t_p.p_role == "j"){
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }else{
                                break;
                            }
                        }
                    }
                }else{  //b
                    for (let t_y = this.m_y-1 ; t_y >= Min_y ; t_y--){
                        let t_p_id = map[this.m_x][t_y];
                        if (t_p_id){
                            let t_p = piece_set[t_p_id];
                            if (t_p.p_role == "j"){
                                tem_points.push([this.m_x,t_y]);
                                tem_pieces.push(t_p_id);
                            }else{
                                break;
                            }
                        }
                    }
                }
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
    public revive_self(){
        this.living = true;
    }
}