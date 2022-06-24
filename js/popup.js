$(function(){
	// 加载设置
	var defaultConfig = {color: 'white'}; // 默认配置
	chrome.storage.sync.get(defaultConfig, function(items) {
		document.body.style.backgroundColor = items.color;
	});

	// 初始化国际化
	// $('#test_i18n').html(chrome.i18n.getMessage("helloWorld"));
})

var bg = chrome.extension.getBackgroundPage();

let selectDoc = function() {
	bg.getFictrionObj().resetFictionStorage();
	bg.getFictrionObj().resetFiction();
	chrome.storage.sync.set({ "wmutong_tool_select_stage": 1 });
	alert("请在页面中点击小说完整内容区域");

	// chrome.notifications.getPermissionLevel(function(level){
	// 	if(level == "granted") {
	// 		localStorage.setItem("wmutong_tool_select_stage", true);

	// 		chrome.notifications.create(
	// 			"notifu_alert",
	// 			{
	// 				type: "basic", iconUrl: "../icon/get_fiction.png", title: "选取小说内容", message: "请在页面中点击小说完整内容区域"
	// 			},
	// 			function(notifyId) {

	// 			}
	// 		)
	// 	}
	// })
}

$('#get_fiction').click(e => {
	selectDoc();
});

$('#stop_fiction').click(e => {
	bg.getFictrionObj().resetFictionStorage();
	bg.getFictrionObj().resetFiction();
});
