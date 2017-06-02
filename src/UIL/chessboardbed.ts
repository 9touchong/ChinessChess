class ChessBoardBed extends egret3d.Mesh{  //棋盘底儿
    //棋盘所有落点的坐标 一个9*10的二维数组
    public sites_points;
    public constructor() {
        super(new egret3d.PlaneGeometry(600,600),new egret3d.TextureMaterial());
        this.Init_sites_points();
    }
    private Init_sites_points(){
        this.sites_points = [
            [[-200,100],[100,100]],
            [[-200,-100],[100,-100]]
        ];
    }
}