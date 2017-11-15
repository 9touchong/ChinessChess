var pieceTextureSet = {
    "b":{
        "j":["3d/chess/Texture/B_jiang_D.png","3d/chess/Texture/B_jiang_N.png","3d/chess/Texture/B_jiang_S.png"],
        "s":["3d/chess/Texture/B_shi_D.png","3d/chess/Texture/B_shi_N.png","3d/chess/Texture/B_shi_S.png"],
        "x":["3d/chess/Texture/B_xiang_D.png","3d/chess/Texture/B_xiang_N.png","3d/chess/Texture/B_xiang_S.png"],
        "m":["3d/chess/Texture/B_ma_D.png","3d/chess/Texture/B_ma_N.png","3d/chess/Texture/B_ma_S.png"],
        "c":["3d/chess/Texture/B_che_D.png","3d/chess/Texture/B_che_N.png","3d/chess/Texture/B_che_S.png"],
        "p":["3d/chess/Texture/B_pao_D.png","3d/chess/Texture/B_pao_N.png","3d/chess/Texture/B_pao_S.png"],
        "z":["3d/chess/Texture/B_zu_D.png","3d/chess/Texture/B_zu_N.png","3d/chess/Texture/B_zu_S.png"]
    },
    "r":{
        "j":["3d/chess/Texture/R_shuai_D.png","3d/chess/Texture/R_shuai_N.png","3d/chess/Texture/R_shuai_S.png"],
        "s":["3d/chess/Texture/R_shi_D.png","3d/chess/Texture/R_shi_N.png","3d/chess/Texture/R_shi_S.png"],
        "x":["3d/chess/Texture/R_xiang_D.png","3d/chess/Texture/R_xiang_N.png","3d/chess/Texture/R_xiang_S.png"],
        "m":["3d/chess/Texture/R_ma_D.png","3d/chess/Texture/R_ma_N.png","3d/chess/Texture/R_ma_S.png"],
        "c":["3d/chess/Texture/R_che_D.png","3d/chess/Texture/R_che_N.png","3d/chess/Texture/R_che_S.png"],
        "p":["3d/chess/Texture/R_pao_D.png","3d/chess/Texture/R_pao_N.png","3d/chess/Texture/R_pao_S.png"],
        "z":["3d/chess/Texture/R_bing_D.png","3d/chess/Texture/R_bing_N.png","3d/chess/Texture/R_bing_S.png"]
    }
}
class Chesspiece{
    private father;
    public body:egret3d.Mesh;
    private body_constants = {"scale":new egret3d.Vector3D(0.4,0.4,0.4),"normal_rotationY":-45,"active_rotationY":90,"normal_y":1.2,"active_y":10};//因模型规格不标准或游戏效果需要等原因必须的一些用于模型的常量
    private m_x : number;	//map坐标  xy是横纵的意思 在3d中是相当于xz轴 因为是逻辑坐标就不细究了
    private m_y : number;
	private p_role : string;	//见下面
	private p_faction : string;
	private p_id : string;	//棋子id，与逻辑中棋子对应
    constructor(p_role:string,p_faction:string,p_x:number,p_z:number,m_x:number,m_y:number,p_id:string,the_father){
        /**
		 * p_role:兵种角色,j:将，c:车，s:士 等等 兵卒都用z，将帅都用j
		 * p_faction:阵营，红或黑，红先黑后。r或b
		 */
        this.father = the_father;
        if (p_id){
			this.p_id = p_id;
		}
		this.m_x = m_x;
		this.m_y = m_y;
		this.p_role = p_role;
		this.p_faction = p_faction;

        this.body = new egret3d.Mesh(RES.getRes("3d/chess/Model/chesspiece.esm"));
        this.body.x = p_x;
        this.body.z = p_z;
        this.body.y = this.body_constants.normal_y;
        let mat_shang:egret3d.MaterialBase = new egret3d.TextureMaterial(); //棋子模型上面下面部分的材质
        let mat_xia:egret3d.MaterialBase = new egret3d.TextureMaterial();
        mat_shang.diffuseTexture = RES.getRes(pieceTextureSet[this.p_faction][this.p_role][0]);
        mat_shang.normalTexture = RES.getRes(pieceTextureSet[this.p_faction][this.p_role][1]);
        mat_shang.specularTexture = RES.getRes(pieceTextureSet[this.p_faction][this.p_role][2]);
        mat_xia.diffuseTexture = RES.getRes("3d/chess/Texture/piece_bodyD.png");
        this.body.addSubMaterial(0,mat_xia);
        this.body.addSubMaterial(1,mat_shang);
        this.body.enablePick = true;
        this.body.addEventListener(egret3d.PickEvent3D.PICK_CLICK,this.on_Click,this);

        this.body.scale = this.body_constants.scale;    //缩放旋转是为了弥补建模时候的不讲究规格
        this.body.rotationY = -45;
        
    }
    public set_p_id(p_id:string){   //直接实例化时赋予id也行，这里只是为了以后更改id规划更方便些
		this.p_id = p_id;
	}
    public move(m_x,m_y,p_x,p_z){
		this.m_x = m_x;
		this.m_y = m_y;
		this.body.x = p_x;
		this.body.z = p_z;
	}
	public kill_self(){
        this.body.enablePick = false;
        this.body.removeEventListener(egret3d.PickEvent3D.PICK_CLICK,this.on_Click,this);
        this.body.visible = false;	//这里如果用父级remove，要考虑悔棋的情况
	}
	public revive_self(){   //复活 一般只在悔棋情况下作用
        this.body.enablePick = true;
        this.body.addEventListener(egret3d.PickEvent3D.PICK_CLICK,this.on_Click,this);
        this.body.visible = true;
	}
    private on_Click(e:egret3d.PickEvent3D){
        console.log("点击了piece",this.p_faction,this.p_role);
        let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
		CheInput_Event._pieceID = this.p_id;
		CheInput_Event._faction = this.p_faction;
		this.father.dispatchEvent(CheInput_Event);
    }
    public picking_up(){	//被拿起的显示效果
		console.log("piece picking_up",this.p_faction,this.p_role);
        egret.Tween.get(this.body,{loop:true}).to({rotationY:this.body_constants.active_rotationY,y:this.body_constants.active_y},1000,egret.Ease.backIn);
	}
    public put_down(){	//被放下，停止一切效果
		console.log("piece put_down",this.p_faction,this.p_role);
		egret.Tween.removeTweens(this.body);
        this.body.rotationY = this.body_constants.normal_rotationY;
        this.body.y = this.body_constants.normal_y;
    }
}