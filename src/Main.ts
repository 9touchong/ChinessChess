class Main extends egret.DisplayObject {
//class Main extends egret.DisplayObjectContainer {
	//加载页面
    private loadingView: LoadingUI;
	// Canvas操作对象
	protected _egret3DCanvas: egret3d.Egret3DCanvas;
	// View3D操作对象
	protected _view3D: egret3d.View3D;
	//一个被选中的棋子
	protected active_piece: egret3d.Mesh;
	// 当前的相机对象
	protected _camera: egret3d.Camera3D;
	// 当前按键状态
	protected _key: number;
	//构造函数
	public constructor() {
		super();
		var queueLoader: egret3d.QueueLoader = new egret3d.QueueLoader();
		queueLoader.load("resource/default.res.json");
		queueLoader.load("resource/assets/background.jpg");
		queueLoader.load("resource/assets/wood_Material.jpg");
		//queueLoader.load("resource/assets/ttt/Teapot001.esm");
		queueLoader.addEventListener(egret3d.LoaderEvent3D.LOADER_COMPLETE, this.createGameScene, this);
		//this.createGameScene();
	}
	private createGameScene(e: egret3d.LoaderEvent3D) {
		var the_queueLoader: egret3d.QueueLoader = e.target;
		//创建Canvas对象。
		this._egret3DCanvas = new egret3d.Egret3DCanvas();
		//Canvas的起始坐标，页面左上角为起始坐标(0,0)。
		this._egret3DCanvas.x = 0;
		this._egret3DCanvas.y = 0;
		//设置Canvas页面尺寸。
		this._egret3DCanvas.width = window.innerWidth;
		this._egret3DCanvas.height = window.innerHeight;
		//创建View3D对象,页面左上角为起始坐标(0,0)
		this._view3D = new egret3d.View3D(0, 0, window.innerWidth, window.innerHeight);
		//材质定义
		var mat_sky : egret3d.ImageTexture = the_queueLoader.getAsset("resource/assets/background.jpg");
		let mat_wood : egret3d.ImageTexture = the_queueLoader.getAsset("resource/assets/wood_Material.jpg");
		//显示背景
		//this._view3D.backImage = mat_sky;
		//当前对象对视位置,其参数依次为:
		//@param pos 对象的位置
		//@param target 目标的位置
		this._view3D.camera3D.lookAt(new egret3d.Vector3D(0, 500, 500), new egret3d.Vector3D(0, 0, 0));
		//View3D的背景色设置
		this._view3D.backColor = 0xffffff;
		//将View3D添加进Canvas中
		this._egret3DCanvas.addView3D(this._view3D);
		//初始化当前相机
		this._camera = this._view3D.camera3D;
		//启动_egret3DCanvas
		this._egret3DCanvas.start();
		
		//在场景中生成并添加物体了
		//棋盘
		var Bed = new ChessBoardBed();	//棋盘底儿即主体
		this._view3D.addChild3D(Bed);
		for (var t_i = 0 ; t_i < Bed.sites_points.length ; t_i++ ){
			for (var t_j = 0 ; t_j < Bed.sites_points[t_i].length ; t_j++){
				let t_point = Bed.sites_points[t_i][t_j];
				let t_site = new ChessBoardSite(t_point[0],t_point[1]);
				this._view3D.addChild3D(t_site);
			}
		}
		//棋子
		var Piece1 = new Piece(100,0,mat_wood);
		var Piece2 = new Piece(-100,0,mat_wood);
		//var Piecet : egret3d.Geometry = the_queueLoader.getAsset("resource/assets/Text02.esm");
		this._view3D.addChild3D(Piece1);
		this._view3D.addChild3D(Piece2);
		//console.log("haha",Piecet);
		//this._view3D.addChild3D(Piecet);
		//var Site1 = new ChessBoardSite(200,250);
		//var Site2 = new ChessBoardSite(-200,260);
		//var Site3 = new ChessBoardSite(180,200);
		//var Site4 = new ChessBoardSite(-200,-200);
		//将mesh节点添加到View3D内
		//this._view3D.addChild3D(Site1);
		//this._view3D.addChild3D(ChessBoardSite2);
		//this._view3D.addChild3D(ChessBoardSite3);
		//this._view3D.addChild3D(ChessBoardSite4);

		///设置默认值-1
		this._key = -1;
		///注册事件，持有对象为_egret3DCanvas，每帧触发该注册方法，需要依次写入事件标识符，注册方法和注册对象。
		this._egret3DCanvas.addEventListener(egret3d.Event3D.ENTER_FRAME, this.OnUpdate, this);
		///注册鼠标按下事件
		egret3d.Input.addEventListener(egret3d.KeyEvent3D.KEY_DOWN, this.OnKeyDown, this);
		///注册鼠标回弹事件
		egret3d.Input.addEventListener(egret3d.KeyEvent3D.KEY_UP, this.OnKeyUp, this);
		console.log("Hello World,Hello Egret3D");
	}
	//鼠标回弹事件
	public OnKeyUp(e: egret3d.KeyEvent3D) {
		//重置按键信息
		this._key = -1;
	}
	//鼠标按下事件
	public OnKeyDown(e: egret3d.KeyEvent3D) {
		//记录按键信息
		this._key = e.keyCode;
	}
	///注册后，该事件将每帧响应
	public OnUpdate(e: egret3d.Event3D) {
		if (!this._camera || this._key == -1) {
			return;
		}
		//qw控制上下 wasd控制前后左右
		switch (this._key) {
			case egret3d.KeyCode.Key_Q:
				this._camera.y += 1;
				break;
			case egret3d.KeyCode.Key_E:
				this._camera.y += -1;
				break;
			case egret3d.KeyCode.Key_W:
				this._camera.z += -1;
				break;
			case egret3d.KeyCode.Key_S:
				this._camera.z += 1;
				break;
			case egret3d.KeyCode.Key_A:
				this._camera.x += 1;
				break;
			case egret3d.KeyCode.Key_D:
				this._camera.x += -1;
				break;
		}
	}
}
