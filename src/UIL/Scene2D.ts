/**
 * 表现层的2d部分
 */
class Scene2d extends egret.DisplayObjectContainer{
    private father;
    constructor(the_father){
        super();
        this.father = the_father;
        this.gene_btns();
    }
    private gene_btns(){
        console.log(this.father.stage.stageHeight);
        /**
         * 绘制各种按钮
         */
        //悔棋按钮
        var undo_btn = new Undo_Button(this.father);
        this.addChild(undo_btn);
        undo_btn.x = this.father.stage.stageWidth - 166;
        undo_btn.y = this.father.stage.stageHeight - 456;
        //认输按钮
        var giveup_btn = new Giveup_Button(this.father);
        this.addChild(giveup_btn);
        giveup_btn.x = this.father.stage.stageWidth - 166;;
        giveup_btn.y = this.father.stage.stageHeight - 520;
    }
    public game_over(winner: string){  //游戏结束胜负已分的显示
         //先蒙上一层幕布
        let shape:egret.Shape = new egret.Shape();
        shape.graphics.beginFill(0x888888);
        shape.graphics.drawRect( 0, 0, this.stage.stageWidth, this.stage.stageHeight );
        shape.graphics.endFill();
        shape.alpha = 0.5;
        shape.touchEnabled = true;
        this.addChild( shape );
        //显示游戏结束文字
        let game_over_label:egret.TextField = new egret.TextField();
        this.addChild( game_over_label );
        game_over_label.x = this.father.stage.stageWidth/2;
        game_over_label.y = this.father.stage.stageHeight/2;
        game_over_label.fontFamily = "KaiTi";
        if (winner == "r"){
            game_over_label.text = "红方获胜！";
        }else if(winner == "b"){
            game_over_label.text = "黑方获胜！";
        }else{
            game_over_label.text = "平局！！";
        }
        
        //显示再来一局
        let reset_game_label:egret.TextField = new egret.TextField();
        this.addChild(reset_game_label);
        reset_game_label.x = game_over_label.x;
        reset_game_label.y = game_over_label.y + 100;
        reset_game_label.text = "再来一局";
        reset_game_label.touchEnabled = true;
        reset_game_label.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
            console.log("点击了再来一局",this);
            let CheInput_Event : CheInpEvt = new CheInpEvt(CheInpEvt.Tap);
            CheInput_Event._reset = true;
            this.father.logic.dispatchEvent(CheInput_Event);
        },this)
    }
}