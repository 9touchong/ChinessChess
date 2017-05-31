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
		//显示背景
		let sky : egret3d.ImageTexture = the_queueLoader.getAsset("resource/assets/background.jpg");
		//this._view3D.backImage = sky;
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
		//创建立方体，放置于场景内(0,0,0)位置
		//创建一个默认的贴图材质球
		//var mat_cube: egret3d.TextureMaterial = new egret3d.TextureMaterial();
		var mat_cube: egret3d.TextureMaterial =new egret3d.TextureMaterial(sky); 
		//使用内置cube数据构造出一个默认参数cube
		var geometery_Cube: egret3d.CubeGeometry = new egret3d.CubeGeometry();
		//通过材质球和geometery数据创建一个mesh对象
		var cube = new egret3d.Mesh(geometery_Cube, mat_cube);
		var cube2 = new egret3d.Mesh(new egret3d.CubeGeometry(),new egret3d.TextureMaterial());
		//将mesh节点添加到View3D内
		this._view3D.addChild3D(cube);
		cube2.x+=100;
		cube2.z+=100;
		this._view3D.addChild3D(cube2);
		cube2.enablePick = true;
		cube2.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.clickpiece, this);
		///创建面片，放置于场景内(0,0,0)位置
		///创建一个默认的贴图材质球
		var mat_Plane: egret3d.TextureMaterial = new egret3d.TextureMaterial();
		//使用内置Plane数据构造出一个默认参数Plane
		var geometery_Plane: egret3d.PlaneGeometry = new egret3d.PlaneGeometry();
		//通过材质球和geometery数据创建一个mesh对象
		//var plane = new egret3d.Mesh(geometery_Plane, mat_Plane);
		//plane.visible = false;
		//plane.enablePick = true;
		//plane.addEventListener(egret3d.PickEvent3D.PICK_CLICK, this.clickBoard, this);
		var plane = new ChessBoard();
		//将mesh节点添加到View3D内
		this._view3D.addChild3D(plane);
		///设置默认值-1
		this._key = -1;
		///注册事件，持有对象为_egret3DCanvas，每帧触发该注册方法，需要依次写入事件标识符，注册方法和注册对象。
		this._egret3DCanvas.addEventListener(egret3d.Event3D.ENTER_FRAME, this.OnUpdate, this);
		///注册鼠标按下事件
		egret3d.Input.addEventListener(egret3d.KeyEvent3D.KEY_DOWN, this.OnKeyDown, this);
		///注册鼠标回弹事件
		egret3d.Input.addEventListener(egret3d.KeyEvent3D.KEY_UP, this.OnKeyUp, this);
		console.log("Hello World,Hello Egret3D");
		console.log("cube",cube.x,cube.y,cube.z);
		console.log("cube1",cube2.x,cube2.y,cube2.z);
		console.log("plane",plane.x,plane.y,plane.z);
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
	//自定义鼠标事件
	///点选棋子
	public clickpiece(e: egret3d.Event3D){
        ///pick的世界坐标
        var pos = e.target.globalPosition;
        ///这里我们将信息输出
		console.log("you have picked me","pos:" + pos.x + "," + pos.y + "," + pos.z);
		//console.log("you have picked me position",e.target.position,"parent",e.target.parent)
		//this.active_piece = e.target;
	}
	///点击棋盘
	public clickBoard(e: egret3d.Event3D){
		console.log ("clicked the chess board","material",e.target.material);
		//this.active_piece.x += 50;
		//this.active_piece.y += 50;
	}
}
