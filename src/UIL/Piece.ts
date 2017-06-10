/**
 * 棋子类
 */
class Piece extends egret.Bitmap {
	public constructor(p_role:string,p_faction:string,p_x:number,p_y:number) {
		/**
		 * p_role:兵种角色,j:将，c:车，s:士 等等
		 * p_faction:阵营，红或黑，红先黑后。r或b
		 */
		super();
		this.x = p_x;
		this.y = p_y;
		let texture: egret.Texture = RES.getRes(p_faction+"_"+p_role+"_png");
		this.texture = texture;
	}
}