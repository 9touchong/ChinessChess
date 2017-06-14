class LogicPiece extends Object{
    /**
     * 逻辑模式棋子
     * 一些属性的命名考虑了与表现层中的Piece类一致
     */
    private m_x : number;
    private m_y : number;
	private p_role : string;
	private p_faction : string;
	private p_id : string;
    private Landing_points; //棋子下一步可能落点集
    public constructor(p_role:string,p_faction:string,m_x:number,m_y:number,p_id?:string){
        super();
        if (p_id){
			this.p_id = p_id;
		}
        this.m_x = m_x;
		this.m_y = m_y;
		this.p_role = p_role;
		this.p_faction = p_faction;
    }
    public set_p_id(p_id:string){
		this.p_id = p_id;
	}
    public get_LandingPoints(map){
        /**
         * 获得当前棋子的所有合法着点
         * 因为这个的实现要一个完整的map，所以放在上一级logicplay中也可以，好像还更合理，以后也可能转移
         */
        let tem_points = [];
        let [Min_x,Min_y,Max_x,Max_y] = [0,0,9,10]; //map的最大范围，横9纵10，这样声明一下主要便于以后修改
        switch(this.p_role){
            case "c":
                break;
            default:
                tem_points = null;
        }
        this.Landing_points = tem_points;
    }
}