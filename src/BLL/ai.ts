/** 
 * 最简单的AlphaBeta 局面评分 原理 AI
*/
class AI{
    private AI_faction: string; //代表阵营
    private Map;
    private pieces_set;
    private VALUE_set;  //子力表,记录或定义每个子在每个位置的价值
    private treeDepth: number;
    public constructor(Map,pieces_set,AI_faction){
        this.Map = Map;
        this.pieces_set = pieces_set;
        this.AI_faction = AI_faction;
        this.treeDepth = 4;
        this.gene_VALUE_set();
    }
    private arr2clone(ori_arr){    //得到一个二维数组的克隆
        let new_arr = [];
        for (let t = 0 ; t < ori_arr.length ; t++){
            new_arr[t] = ori_arr[t].slice();
        };
        return new_arr;
    }
    private gene_VALUE_set(){
        /**
         * 生成VALUE_set
         * VALUE_set格式是{"r":{"m":[[]....],"c":....},"b"{.....}}
         */
        this.VALUE_set = {"r":{},"b":{}};
        this.VALUE_set["r"]["c"] = [
            [206,206,206,206,208,208,204,198,200,194],
            [208,212,208,213,211,212,209,208,208,206],
            [207,209,207,213,211,212,204,204,206,204],
            [213,216,214,216,214,214,212,212,212,212],
            [214,233,216,216,215,215,214,212,200,200],
            [213,216,214,216,214,214,212,212,212,212],
            [207,209,207,213,211,212,204,204,206,204],
            [208,212,208,213,211,212,209,208,208,206],
            [206,206,206,206,208,208,204,198,200,194]  
        ];
        this.VALUE_set["r"]["m"] = [
            [ 90, 90, 92, 93, 90, 90, 92, 93, 85, 88],
            [ 90, 96, 98,108,100, 98, 94, 92, 90, 85],
            [ 90,103, 99,100, 99,101, 98, 94, 92, 90],
            [ 96, 97,103,107,103,102, 95, 95, 93, 88],
            [ 90, 94, 99,100,104,103, 98, 92, 78, 90],
            [ 96, 97,103,107,103,102, 95, 95, 93, 88],
            [ 90,103, 99,100, 99,101, 98, 94, 92, 90],
            [ 90, 96, 98,108,100, 98, 94, 92, 90, 85],
            [ 90, 90, 92, 93, 90, 90, 92, 93, 85, 88]
        ];
        this.VALUE_set["r"]["x"] = [
            [  0,  0, 18,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [ 20,  0,  0,  0, 20,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0, 23,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
        ];
        this.VALUE_set["r"]["s"] = [
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [ 20,  0, 20,  0,  0,  0,  0,  0,  0,  0],
            [  0, 23,  0,  0,  0,  0,  0,  0,  0,  0],
            [ 20,  0, 20,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
        ];
        this.VALUE_set["r"]["j"] = [
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
            [8888,8888,8888,   0,   0,   0,   0,8888,8888,8888],
            [8888,8888,8888,   0,   0,   0,   0,8888,8888,8888],
            [8888,8888,8888,   0,   0,   0,   0,8888,8888,8888],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
            [   0,   0,   0,   0,   0,   0,   0,   0,   0,   0]
        ];
        this.VALUE_set["r"]["p"] = [
            [100, 98, 97, 96, 96, 95, 96, 97, 96, 96],
            [100, 98, 97, 99, 96, 96, 96, 96, 97, 96],
            [ 96, 96, 96, 99, 96, 99, 96,100, 98, 97],
            [ 91, 92, 91, 98, 96, 96, 96, 99, 98, 99],
            [ 90, 89, 92,100,100,100, 96,101, 98, 99],
            [ 91, 92, 91, 98, 96, 96, 96, 99, 98, 99],
            [ 96, 96, 96, 99, 96, 99, 96,100, 98, 97],
            [100, 98, 97, 99, 96, 96, 96, 96, 97, 96],
            [100, 98, 97, 96, 96, 95, 96, 97, 96, 96]
        ];
        this.VALUE_set["r"]["z"] = [
            [  9, 19, 19, 19, 14,  7,  7,  0,  0,  0],
            [  9, 24, 24, 23, 18,  0,  0,  0,  0,  0],
            [  9, 34, 32, 27, 20, 13,  7,  0,  0,  0],
            [ 11, 42, 37, 29, 27, 16, 15,  0,  0,  0],
            [ 13, 44, 37, 30, 29, 16, 15,  0,  0,  0],
            [ 11, 42, 37, 29, 27, 16, 15,  0,  0,  0],
            [  9, 34, 32, 27, 20, 13,  7,  0,  0,  0],
            [  9, 24, 24, 23, 18,  0,  0,  0,  0,  0],
            [  9, 19, 19, 19, 14,  7,  7,  0,  0,  0]
        ];
        for (let k in this.VALUE_set["r"]){
            let t_2arr = this.arr2clone(this.VALUE_set["r"][k]);
            for (let t_arr of  t_2arr){
                t_arr.reverse();
            };
            this.VALUE_set["b"][k] = t_2arr;
        };
    }
    private getMoves(map?,faction?){
        /**
         * //取得当前this.Map或传入map棋谱下，AI_faction或传入阵营的所有棋子所有可能着法
         * return一个数组，元素是一个{"move_id": ,"oldX": ,"oldY": ,"newX": ,"newY": }
         */
        if (!map){map = this.Map;};
        if (!faction){faction = this.AI_faction;};
        let Moves = new Array();
        for (let t_x = 0 ; t_x < map.length ; t_x++){
            for (let t_y = 0 ; t_y < map[t_x].length ; t_y++){
                let t_p_id = map[t_x][t_y];
                if (!t_p_id){
                    continue;
                };
                let t_piece:LogicPiece = this.pieces_set[t_p_id];
                if (t_piece.get_property("p_faction") != faction){
                    continue;
                };
                t_piece.effect_update(map,this.pieces_set);
                for (let t_point of t_piece.get_property("landing_points")){
                    Moves.push({"move_id":t_p_id,"oldX":t_x,"oldY":t_y,"newX":t_point[0],"newY":t_point[1]});
                }
            }
        };
        return Moves;
    }
    private getEvaluate(map?,faction?){
        /**
         * //取得当前this.Map或传入map棋谱下，AI_faction或传入阵营的 棋面评价
         * 返回的应该是一个整数
         * 无论faction是什么期望的评价都是正的越大越好
         */
        if (!map){map = this.Map;};
        if (!faction){faction = this.AI_faction;};
        let Sum_value: number = 0;
        for (let t_x = 0 ; t_x < map.length ; t_x++){
            for (let t_y = 0 ; t_y < map[t_x].length ; t_y++){
                if (!map[t_x][t_y]){
                    continue;
                };
                let t_piece = this.pieces_set[map[t_x][t_y]];
                let t_role = t_piece.get_property("p_role");
                let t_faction = t_piece.get_property("p_faction");
                let t_value = this.VALUE_set[t_faction][t_role][t_x][t_y];
                if (t_faction == faction){
                    Sum_value += t_value;
                }else{
                    Sum_value -= t_value;
                }
            }
        };
        return Sum_value;
    }
    private getAlphaBeta(A, B, depth, map ,faction){
        /**
         * A:当前棋手value  B:对手value  depth：层级
         * 若有最佳解，返回一个与getMoves部分类似的obj,{"move_id": ,"oldX": ,"oldY": ,"newX": ,"newY": ,"value": };只多了个评分
         */
        if (depth == 0){
            return {"value":this.getEvaluate(map,faction)};
        }
        let Moves = this.getMoves(map,faction);
        for (let move of Moves){
            //走这个走法
            let dying_id = map[move["newX"]][move["newY"]]; //注意可能为null
            map[move["newX"]][move["newY"]] = move["move_id"];
            map[move["oldX"]][move["oldY"]] = null;
            this.pieces_set[move["move_id"]].move(move["newX"],move["newY"]);
            if (dying_id && this.pieces_set[dying_id].get_property("p_role") == "j"){   //吃的是将
                //先撤销走法
                map[move["oldX"]][move["oldY"]] = move["move_id"];
                map[move["newX"]][move["newY"]] = dying_id;
                this.pieces_set[move["move_id"]].move(move["oldX"],move["oldY"]);
                //直接return rootKey
                return {"move_id":move["move_id"],"oldX":move["oldX"],"oldY":move["oldY"],"newX":move["newX"],"newY":move["newY"],"value":8888}
            }else{
                let val: number;
                let next_val = this.getAlphaBeta(-B , -A , depth-1 , map , (faction == "r") ? "b" : "r");
                if (next_val){
                    val = -next_val.value;
                }else{
                    val = null;
                }
                //撤销走法
                map[move["oldX"]][move["oldY"]] = move["move_id"];
                map[move["newX"]][move["newY"]] = dying_id;
                this.pieces_set[move["move_id"]].move(move["oldX"],move["oldY"]);
                if (val >= B){
                    return {"move_id":move["move_id"],"oldX":move["oldX"],"oldY":move["oldY"],"newX":move["newX"],"newY":move["newY"],"value":B};
                };
                if (val > A){
                    A = val;    //更新最佳走法
                    if (this.treeDepth == depth){
                        var rootKey= {"move_id":move["move_id"],"oldX":move["oldX"],"oldY":move["oldY"],"newX":move["newX"],"newY":move["newY"],"value":A};
                    }
                };
            }
            
        };
        if (this.treeDepth == depth){
            if (!rootKey){
                return false;
            }else{
                return rootKey;
            }
        };
        return {"value":A};
    }
    public oneAImove(){
        return this.getAlphaBeta(-99999,99999,this.treeDepth,this.arr2clone(this.Map),this.AI_faction);
    }
}