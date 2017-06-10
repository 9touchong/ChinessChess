class GamePlay{
    private std_initMap = [
        [["c","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["c","b"]],
        [["m","r"],         ,["p","r"],         ,         ,         ,         ,["p","b"],         ,["m","b"]],
        [["x","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["x","b"]],
        [["s","r"],         ,         ,         ,         ,         ,         ,         ,         ,["s","b"]],
        [["j","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["j","b"]],
        [["s","r"],         ,         ,         ,         ,         ,         ,         ,         ,["s","b"]],
        [["x","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["x","b"]],
        [["m","r"],         ,["p","r"],         ,         ,         ,         ,["p","b"],         ,["m","b"]],
        [["c","r"],         ,         ,["z","r"],         ,         ,["z","b"],         ,         ,["c","b"]]
    ];//注意这数组，看起来就像是反了一样
    private master; //因为这里用不了parent，就将调用它的主人或叫宿主引进来
    public constructor(the_master){
        this.master = the_master;
    }
    public startone(){  //开一局
        var board = new ChessBoardBed();
        this.master.addChild(board);
        board.place_sites();
        for (var t_i  = 0 ; t_i < this.std_initMap.length ; t_i++){
            for (var t_j = 0 ; t_j < this.std_initMap[t_i].length ; t_j++){
                if (this.std_initMap[t_i][t_j]){
                    let t_piece = new Piece(this.std_initMap[t_i][t_j][0],this.std_initMap[t_i][t_j][1],board.sites_points[t_i][t_j][0],board.sites_points[t_i][t_j][1]);
                    this.master.addChild(t_piece);
                }
            }
        }
    }
}