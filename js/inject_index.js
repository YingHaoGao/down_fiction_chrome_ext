// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
    let appendFiction = function() {
        chrome.storage.sync.get(
            ["wmutong_tool_select_stage", "wmutong_tool_pitc_fiction_next_doc_id", "wmutong_tool_pitc_fiction_box_doc_id"],
            function(result) {
                console.log(result);
                if(result.wmutong_tool_select_stage == 3) {
                    if(result.wmutong_tool_pitc_fiction_box_doc_id) {
                        let classStr = '';
                        let wmutong_tool_pitc_fiction_box_doc_id = JSON.parse(result.wmutong_tool_pitc_fiction_box_doc_id);
                        
                        if(wmutong_tool_pitc_fiction_box_doc_id.class && wmutong_tool_pitc_fiction_box_doc_id.class.length) wmutong_tool_pitc_fiction_box_doc_id.class.map(s => classStr += `.${s}`);
                        else if(wmutong_tool_pitc_fiction_box_doc_id.id) classStr = `#${wmutong_tool_pitc_fiction_box_doc_id.id}`;

                        if(!$(classStr).length) {
                            if(wmutong_tool_pitc_fiction_box_doc_id.class && wmutong_tool_pitc_fiction_box_doc_id.class.length) classStr = `.${wmutong_tool_pitc_fiction_box_doc_id.class[0]}`;
                            else if(wmutong_tool_pitc_fiction_box_doc_id.id) classStr = `#${wmutong_tool_pitc_fiction_box_doc_id.id}`;
                        }
                        let fictionStr = $(classStr).text();
                        console.log(classStr, $(classStr));

                        chrome.runtime.sendMessage({origin: "inject", target: "background", type: "appendFiction", str: fictionStr}, data => {
                            if(result.wmutong_tool_pitc_fiction_next_doc_id) {
                                let classStr = '';
                                let wmutong_tool_pitc_fiction_next_doc_id = JSON.parse(result.wmutong_tool_pitc_fiction_next_doc_id);
                        
                                if(wmutong_tool_pitc_fiction_next_doc_id.class && wmutong_tool_pitc_fiction_next_doc_id.class.length) wmutong_tool_pitc_fiction_next_doc_id.class.map(s => classStr += `.${s}`);
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

        if($target.attr("class")) {
            classes = $target.attr("class").replace(" tools_select_doc", "").split(" ");
        }
        if($target.attr("id")) id = $target.attr("id");
        if(!id) {

        }

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