class ChessBoardSite extends egret3d.Mesh{  //棋盘位点
    public constructor(x:number,z:number) {
        super(new egret3d.PlaneGeometry(30,30),new egret3d.TextureMaterial());
        this.x = x;
        this.z = z;
        this.enablePick = true;
        this.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.onClickBoard, this);
    }
    private onClickBoard(e: egret3d.Event3D) {
       //console.log ("clicked the chess board sites","material",e.target.material);
       let tem_active_piece = e.target.parent.active_piece;
       if (!tem_active_piece){
           console.log("tem_active_piece is null : ",tem_active_piece);
           return;
       }
       console.log("have clicked a piece");
       //将选中棋子移至该位点
       tem_active_piece.x = this.x;
       tem_active_piece.z = this.z;
       //移除棋子被选中状态
       e.target.parent.active_piece = null;
    }
}