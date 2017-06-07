class Piece extends egret3d.Mesh{
    public constructor(x:number,z:number,mat?:egret3d.ImageTexture) {
        super(new egret3d.CylinderGeometry(20,40),new egret3d.TextureMaterial(mat));
        this.x = x;
        this.z = z;
        this.y = 10;    //为了棋子不是镶嵌在棋盘上，否则不仅是不好看，点选也不灵
        this.enablePick = true;
        this.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.onClickPiece, this);
    }
    private onClickPiece(e: egret3d.Event3D) {
        ///pick的世界坐标
        var pos = e.target.globalPosition;
        ///这里我们将信息输出
		console.log("you have picked me","pos:" + pos.x + "," + pos.y + "," + pos.z);
		//console.log("you have picked me position",e.target.position,"parent",e.target.parent)
		e.target.parent.active_piece = e.target;
    }
}