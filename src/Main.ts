@RES.mapConfig("config.json", () => "resource", path => {
    var ext = path.substr(path.lastIndexOf(".") + 1);
    var type = "";
    if (path.indexOf("3d") >= 0) {
        type = "unit";
    } else {
        let typeMap = {
            "jpg": "image",
            "png": "image",
            "webp": "image",
            "json": "json",
            "fnt": "font",
            "pvr": "pvr",
            "mp3": "sound"
        }
        type = typeMap[ext];
        if (type == "json") {
            if (path.indexOf("sheet") >= 0) {
                type = "sheet";
            } else if (path.indexOf("movieclip") >= 0) {
                type = "movieclip";
            };
        }
    }
    return type;
})
class Main extends egret.DisplayObjectContainer{
    private _ShowPlay:ShowPlay;
    private _LogicPLay:LogicPlay;
    constructor() {
        super();
        utils.map();
        this.once(egret.Event.ADDED_TO_STAGE, async () => {
            // 创建Egret3DCanvas，传入 2D stage，将开启混合模式
            let context3d = new egret3d.Egret3DCanvas(this.stage);
            egret.setRendererContext(context3d);
            await this.loadAssets();
            this._LogicPLay = new LogicPlay();
            this._ShowPlay = new ShowPlay(context3d,this._LogicPLay);
            this._LogicPLay.bind(this._ShowPlay);
            this.addChild(this._ShowPlay);
            this._LogicPLay.startone();
        },this);
    }
    private async loadAssets() {

        async function load(resources: string[]) {
            for (let r of resources) {
                await RES.getResAsync(r);
            }
        }
        try {
            let loading = new LoadingUI();
            this.stage.addChild(loading);
            await RES.loadConfig();
            let resources = [
                "3d/chess/Model/chesspiece.esm",
                "3d/background.jpg",
                "3d/chess/Texture/B_che_D.png",
				"3d/chess/Texture/B_che_N.png",
				"3d/chess/Texture/B_che_S.png",
				"3d/chess/Texture/B_jiang_D.png",
				"3d/chess/Texture/B_jiang_N.png",
				"3d/chess/Texture/B_jiang_S.png",
				"3d/chess/Texture/B_ma_D.png",
				"3d/chess/Texture/B_ma_N.png",
				"3d/chess/Texture/B_ma_S.png",
				"3d/chess/Texture/B_pao_D.png",
				"3d/chess/Texture/B_pao_N.png",
				"3d/chess/Texture/B_pao_S.png",
				"3d/chess/Texture/B_shi_D.png",
				"3d/chess/Texture/B_shi_N.png",
				"3d/chess/Texture/B_shi_S.png",
				"3d/chess/Texture/B_xiang_D.png",
				"3d/chess/Texture/B_xiang_N.png",
				"3d/chess/Texture/B_xiang_S.png",
				"3d/chess/Texture/B_zu_D.png",
				"3d/chess/Texture/B_zu_N.png",
				"3d/chess/Texture/B_zu_S.png",
				"3d/chess/Texture/chessboard.png",
                "3d/chess/Texture/canputsite.png",
				"3d/chess/Texture/piece_bodyD.png",
				"3d/chess/Texture/R_bing_D.png",
				"3d/chess/Texture/R_bing_N.png",
				"3d/chess/Texture/R_bing_S.png",
				"3d/chess/Texture/R_che_D.png",
				"3d/chess/Texture/R_che_N.png",
				"3d/chess/Texture/R_che_S.png",
				"3d/chess/Texture/R_ma_D.png",
				"3d/chess/Texture/R_ma_N.png",
				"3d/chess/Texture/R_ma_S.png",
				"3d/chess/Texture/R_pao_D.png",
				"3d/chess/Texture/R_pao_N.png",
				"3d/chess/Texture/R_pao_S.png",
				"3d/chess/Texture/R_shi_D.png",
				"3d/chess/Texture/R_shi_N.png",
				"3d/chess/Texture/R_shi_S.png",
				"3d/chess/Texture/R_shuai_D.png",
				"3d/chess/Texture/R_shuai_N.png",
				"3d/chess/Texture/R_shuai_S.png",
				"3d/chess/Texture/R_xiang_D.png",
				"3d/chess/Texture/R_xiang_N.png",
				"3d/chess/Texture/R_xiang_S.png"
            ];
            await load(resources);
            this.stage.removeChild(loading)
        }
        catch (e) {
            alert(e.message)
        }
    }
}

namespace utils {

    function promisify(loader: egret3d.UnitLoader, url: string) {
        return new Promise((reslove, reject) => {
            loader.addEventListener(egret3d.LoaderEvent3D.LOADER_COMPLETE, () => {
                reslove(loader.data);
            }, this);
            loader.load("resource/" + url);
        });
    }

    export function map() {

        RES.processor.map("unit", {

            onLoadStart: async (host, resource) => {
                var loader = new egret3d.UnitLoader();
                return promisify(loader, resource.url)
            },

            onRemoveStart: async (host, resource) => Promise.resolve()
        });
    }

}