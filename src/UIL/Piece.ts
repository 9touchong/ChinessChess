/**
 * 棋子类
 */
class Piece extends egret.Bitmap {
	private m_x : number;	//map坐标
    private m_y : number;
	private p_role : string;	//见下面
	private p_faction : string;
	private p_id : string;	//棋子id，与逻辑中棋子对应
	public constructor(p_role:string,p_faction:string,p_x:number,p_y:number,m_x:number,m_y:number,p_id?:string) {
		/**
		 * p_role:兵种角色,j:将，c:车，s:士 等等 兵卒都用b，将帅都用j
		 * p_faction:阵营，红或黑，红先黑后。r或b
		 */
		super();
		if (p_id){
			this.p_id = p_id;
		}
		this.m_x = m_x;
		this.m_y = m_y;
		this.p_role = p_role;
		this.p_faction = p_faction;
		let texture: egret.Texture = RES.getRes(p_faction+"_"+p_role+"_png");
		this.texture = texture;
		this.width = 50;
		this.height = 50;
		this.anchorOffsetX = this.width/2;
		this.anchorOffsetY = this.height/2;
		this.x = p_x;
		this.y = p_y;
		this.touchEnabled = true;
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.ontap,this);
	}
	public set_p_id(p_id:string){
		this.p_id = p_id;
	}
	public move(m_x,m_y,p_x,p_y){
		this.m_x = m_x;
		this.m_y = m_y;
		this.x = p_x;
		this.y = p_y;
	}
	public kill_self(){
		this.visible = false;	//这里如果用父级remove，要考虑悔棋的情况
	}
	public revive_self(){
		this.visible = true;
	}
	private ontap(evt:egret.TouchEvent){
		//console.log("you have click a piece");
		let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
		CheInput_Event._pieceID = this.p_id;
		CheInput_Event._faction = this.p_faction;
		this.parent.dispatchEvent(CheInput_Event)
		//setTimeout(() => {this.test();},3000);
	}
	public picking_up(){	//被拿起的显示效果
		console.log("piece picking_up");
		egret.Tween.get(this,{loop:true}).to({scaleX:1.3,scaleY:1.3},1000,egret.Ease.backIn);
	}
	public put_down(){	//被放下，停止一切效果
		console.log("piece put_down");
		egret.Tween.removeTweens(this);
		this.scaleX = 1;
		this.scaleY = 1;
	}
	public test(){
        let t = 0;
        for (let i = 0; i<9999999999; i++){
            t= i;
        };
		console.log(t);
    }
}