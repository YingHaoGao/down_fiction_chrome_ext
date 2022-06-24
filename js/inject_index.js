// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
    // 第一版主使用 img 显示部分图片的应对
    let dybz_img_replace = function() {
        let href = location.href;
    
        if(href.indexOf("diyibanzhu") > -1) {
            let imgs = "男人啊爱按暴醫逼擦潮操插吃抽处床春唇刺粗大洞逗硬儿反犯峰妇抚夫腹干搞根公宫勾股狠花滑坏魂鸡激夹奸交叫娇姐禁精进紧菊渴口裤胯快浪力楼乱裸妈毛迷靡妹摸嫩母娘尿咛女哦趴喷婆屁气枪窃骑妻情亲裙热日肉揉乳软润入塞骚色上舌射身深湿兽受舒爽水睡酥死烫痛舔天体挺头腿脱味慰吻握喔污下小性胸血穴阳痒药腰夜液野衣姨吟淫荫幽诱尤欲吁玉吮窄占征汁嘴,。.慾丢弄";
    
            for(let i = 1; i <= 168; i++) {
                $(`em.n_${i}`).text(imgs[i-1]);
            }
        }
    };

    // 轮询页面的处理
    let appendFiction = function() {
        chrome.storage.sync.get(
            ["wmutong_tool_select_stage", "wmutong_tool_pitc_fiction_next_doc_id", "wmutong_tool_pitc_fiction_box_doc_id"],
            function(result) {
                console.log(result);
                if(result.wmutong_tool_select_stage == 3) {
                    if(result.wmutong_tool_pitc_fiction_box_doc_id) {
                        dybz_img_replace();

                        let classStr = '';
                        let wmutong_tool_pitc_fiction_box_doc_id = JSON.parse(result.wmutong_tool_pitc_fiction_box_doc_id);
                        
                        if(wmutong_tool_pitc_fiction_box_doc_id.class && wmutong_tool_pitc_fiction_box_doc_id.class.length) wmutong_tool_pitc_fiction_box_doc_id.class.map(s => { if(s != "") {classStr += `.${s}`} });
                        else if(wmutong_tool_pitc_fiction_box_doc_id.id) classStr = `#${wmutong_tool_pitc_fiction_box_doc_id.id}`;

                        if(!$(classStr).length) {
                            if(wmutong_tool_pitc_fiction_box_doc_id.class && wmutong_tool_pitc_fiction_box_doc_id.class.length) classStr = `.${wmutong_tool_pitc_fiction_box_doc_id.class[0]}`;
                            else if(wmutong_tool_pitc_fiction_box_doc_id.id) classStr = `#${wmutong_tool_pitc_fiction_box_doc_id.id}`;
                        }
                        // console.log(classStr, $(classStr));
                        console.log(classStr);
                        let fictionStr = $(classStr).text();

                        chrome.runtime.sendMessage({origin: "inject", target: "background", type: "appendFiction", str: fictionStr}, data => {
                            if(result.wmutong_tool_pitc_fiction_next_doc_id) {
                                let classStr = '';
                                let wmutong_tool_pitc_fiction_next_doc_id = JSON.parse(result.wmutong_tool_pitc_fiction_next_doc_id);
                        
                                if(wmutong_tool_pitc_fiction_next_doc_id.class && wmutong_tool_pitc_fiction_next_doc_id.class.length) wmutong_tool_pitc_fiction_next_doc_id.class.map(s => { if(s != "") {classStr += `.${s}`} });
                                else if(wmutong_tool_pitc_fiction_next_doc_id.id) classStr = `#${wmutong_tool_pitc_fiction_next_doc_id.id}`;
                                
                                setTimeout(() => {
                                    $(classStr)[0] && $(classStr)[0].click();
                                }, 500);
                            }
                            else {
                                chrome.runtime.sendMessage({origin: "inject", target: "background", type: "download"}, data => {
                                    chrome.runtime.sendMessage({origin: "inject", target: "background", type: "resetFiction"});
                                    chrome.runtime.sendMessage({origin: "inject", target: "background", type: "resetFictionStorage"});
                                });
                            }

                            setTimeout(() => {
                                chrome.runtime.sendMessage({origin: "inject", target: "background", type: "download"}, data => {
                                    chrome.runtime.sendMessage({origin: "inject", target: "background", type: "resetFiction"});
                                    chrome.runtime.sendMessage({origin: "inject", target: "background", type: "resetFictionStorage"});
                                });
                            }, 2000);
                        });
                    }
                }
            }
        );
    };
    appendFiction();

    // 移入小说容器doc
    let selectDoc = function(e) {
        chrome.storage.sync.get(["wmutong_tool_select_stage"], function(result){
            console.log(result.wmutong_tool_select_stage, $(e.target).hasClass("tools_select_doc"));
            if(result.wmutong_tool_select_stage == 1 && !$(e.target).hasClass("tools_select_doc")) {
                $(e.target).addClass("tools_select_doc");
            }
        });
    };
    // 移出小说容器doc
    let unselectDoc = function(e) {
        $(".tools_select_doc").removeClass("tools_select_doc");
    };
    // 选中下一页
    let pitchNext = function(e) {
        let $target = $(e.target);
        let classes = [];
        let id = "";

        if($target.attr("class")) {
            classes = $target.attr("class").replace(" tools_select_doc", "").split(" ");
        }
        if($target.attr("id")) id = $target.attr("id");
        
        chrome.storage.sync.set({
            "wmutong_tool_select_stage": 3,
            "wmutong_tool_pitc_fiction_next_doc_id": JSON.stringify({ class: classes, id: id })
        });
    };
    // 选中小说容器doc
    let pitchDoc = function(e) {
        let $target = $(e.target);
        let classes = [];
        let id = false;

        dybz_img_replace();

        if($target.attr("class")) {
            let newClassStr = $target.attr("class").replace("tools_select_doc", "");
            if(newClassStr.indexOf(" ") > -1) classes = newClassStr.split(" ");
            else if(newClassStr != "") classes = [newClassStr];
        }
        console.log(classes, classes.length);
        if($target.attr("id")) id = $target.attr("id");
        if(!classes.length && !id) {
            let $parents = $target.parents("[class]");
            if($parents.length) {
                let newClassStr = $parents.eq(0).attr("class").replace("tools_select_doc", "");
                if(newClassStr.indexOf(" ") > -1) classes = newClassStr.split(" ");
                else if(newClassStr != "") classes = [newClassStr];

                console.log("newClassStr", classes, $parents.eq(0));
                $target = $parents;
            }   
        }
        console.log($target.text());

        chrome.runtime.sendMessage({origin: "inject", target: "background", type: "setFictionName", str: $("title").text()})
        chrome.runtime.sendMessage({origin: "inject", target: "background", type: "resetFiction"}, data => {
            chrome.runtime.sendMessage({origin: "inject", target: "background", type: "appendFiction", str: $target.text()}, data => {
                chrome.storage.sync.set({
                    "wmutong_tool_select_stage": 2,
                    "wmutong_tool_pitc_fiction_box_doc_id": JSON.stringify({ class: classes, id: id })
                });
                alert("请在页面中点击小说翻页操作");
        
                $(document).off("mousedown", ".tools_select_doc", pitchDoc);
                $(document).off("mousedown", pitchNext).on("mousedown", pitchNext);
            });
        });
    }
    
    $(document).off("mouseover", selectDoc).on("mouseover", selectDoc);
    $(document).off("mouseout", unselectDoc).on("mouseout", unselectDoc);
    $(document).off("mousedown", ".tools_select_doc", pitchDoc).on("mousedown", ".tools_select_doc", pitchDoc);
});