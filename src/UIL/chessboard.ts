class ChessBoard extends egret3d.Mesh{
    public constructor() {
        super(new egret3d.PlaneGeometry(),new egret3d.TextureMaterial());
        this.enablePick = true;
        this.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.onClickBoard, this);
    }
    private onClickBoard(e: egret3d.Event3D) {
       //console.log ("clicked the chess board in test"); 
       console.log ("clicked the chess board","material",e.target.material);
       e.target.parent.active_piece.x += 50;
       e.target.parent.active_piece.y += 50;
    }
}