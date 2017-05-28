class Main extends egret.DisplayObject {
                // Canvas操作对象
                protected _egret3DCanvas: egret3d.Egret3DCanvas;
                // View3D操作对象
                protected _view3D: egret3d.View3D;
                // 当前的相机对象
                protected _camera: egret3d.Camera3D;
                // 当前按键状态
                protected _key: number;
                public constructor() {
                    super();
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
                    var mat_cube: egret3d.TextureMaterial = new egret3d.TextureMaterial();
                    //使用内置cube数据构造出一个默认参数cube
                    var geometery_Cube: egret3d.CubeGeometry = new egret3d.CubeGeometry();
                    //通过材质球和geometery数据创建一个mesh对象
                    var cube = new egret3d.Mesh(geometery_Cube, mat_cube);
                    //将mesh节点添加到View3D内
                    this._view3D.addChild3D(cube);
                    ///创建面片，放置于场景内(0,0,0)位置
                    ///创建一个默认的贴图材质球
                    var mat_Plane: egret3d.TextureMaterial = new egret3d.TextureMaterial();
                    //使用内置Plane数据构造出一个默认参数Plane
                    var geometery_Plane: egret3d.PlaneGeometry = new egret3d.PlaneGeometry();
                    //通过材质球和geometery数据创建一个mesh对象
                    var plane = new egret3d.Mesh(geometery_Plane, mat_Plane);
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