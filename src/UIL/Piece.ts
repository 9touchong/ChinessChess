/**
 * 棋子类
 */
class Piece extends egret.Bitmap {
	private m_x : number;
    private m_y : number;
	public constructor(p_role:string,p_faction:string,p_x:number,p_y:number,m_x:number,m_y:number) {
		/**
		 * p_role:兵种角色,j:将，c:车，s:士 等等 兵卒都用b，将帅都用j
		 * p_faction:阵营，红或黑，红先黑后。r或b
		 */
		super();
		this.m_x = m_x;
		this.m_y = m_y;
		let texture: egret.Texture = RES.getRes(p_faction+"_"+p_role+"_png");
		this.texture = texture;
		this.width = 50;
		this.height = 50;
		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height/2;
		this.x = p_x;
		this.y = p_y;
	}
	public move(m_x,m_y,p_x,p_y){
		this.m_x = m_x;
		this.m_y = m_y;
		this.x = p_x;
		this.y = p_y;
	}
}