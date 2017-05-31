class ChessBoard extends egret3d.Mesh{
    public constructor() {
        super(new egret3d.PlaneGeometry(),new egret3d.TextureMaterial());
        this.enablePick = true;
        this.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.tclickBoard, this);
    }
    private tclickBoard(e: egret3d.Event3D) {
       console.log ("clicked the chess board in test"); 
    }
}