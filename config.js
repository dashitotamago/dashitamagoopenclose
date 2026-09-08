// ここに、Google Apps Script をデプロイして発行された「ウェブアプリのURL」を貼り付けてください。
// 例: https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec
const GAS_URL = "https://script.google.com/macros/s/AKfycbwyByrORo1m-1bdjaFMcx1WUG8k0ARZfFDBShO8pYapUI3WnHCpr6M6BlJXamZrRmYZ/exec";

// デフォルトデータ(GASが未設定・通信エラー時のフォールバックとして使用)
const DEFAULT_DATA = {
  open: {
    title: "オープンチェック",
    header: "オープンチェック写真\n10時45分まで",
    photoCount: "計9枚",
    items: [
      {num:1, label:"石水窯横", detail:"ポスター看板2"},
      {num:2, label:"石水窯庭", detail:"うなぎ看板"},
      {num:2, label:"石水窯庭", detail:"のぼり旗"},
      {num:3, label:"坂前", detail:"看板2"},
      {num:3, label:"坂前", detail:"のぼり旗2"},
      {num:4, label:"店頭", detail:"A1メニュー表"},
      {num:4, label:"店頭", detail:"窓枠外し"},
      {num:4, label:"店頭", detail:"まな板"},
      {num:4, label:"店頭", detail:"ライト点灯"},
      {num:4, label:"店頭", detail:"スピーカー"},
      {num:4, label:"店頭", detail:"油"},
      {num:5, label:"通路", detail:"電気"},
      {num:5, label:"通路", detail:"お盆台"},
      {num:5, label:"通路", detail:"ゴミ箱蓋開ける"},
      {num:5, label:"通路", detail:"通路扉開く"},
      {num:6, label:"反対側道", detail:"起立式看板"},
      {num:7, label:"イートインスペース", detail:"机・イスが綺麗に並んでいるか"},
      {num:7, label:"イートインスペース", detail:"照明が付いているか"},
      {num:8, label:"", detail:"iPad Bluetooth接続確認"},
      {num:9, label:"", detail:"インスタストーリー投稿確認"}
    ]
  },
  close: {
    title: "クローズチェック",
    header: "クローズチェック写真",
    photoCount: "計8枚(雨天時は一部枚数変動あり)",
    items: [
      {num:1, label:"", detail:"ポスター看板×5(雨天時は8枚)"},
      {num:2, label:"", detail:"のぼり旗×5(雨天時は6)"},
      {num:2, label:"", detail:"起立式看板"},
      {num:3, label:"", detail:"窓施錠×2"},
      {num:3, label:"", detail:"元栓×2"},
      {num:3, label:"", detail:"机の上綺麗"},
      {num:3, label:"", detail:"パン在庫確認"},
      {num:3, label:"", detail:"電気消灯"},
      {num:4, label:"", detail:"客席綺麗か"},
      {num:4, label:"", detail:"電気消灯"},
      {num:5, label:"", detail:"金庫ロック確認"},
      {num:6, label:"", detail:"エアコン消す"},
      {num:7, label:"", detail:"牛乳瓶外出し(木曜、日曜のみ)"},
      {num:8, label:"", detail:"鍵施錠"},
      {num:8, label:"", detail:"ゴミ箱蓋"},
      {num:8, label:"", detail:"通路電気消灯"}
    ]
  }
};

// GASからチェック項目データを取得。失敗時はDEFAULT_DATAを返す。
async function loadChecklistData(){
  if(!GAS_URL || GAS_URL.indexOf("ここに") === 0){
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  try{
    const res = await fetch(GAS_URL + "?action=get", { method: "GET" });
    if(!res.ok) throw new Error("network error");
    const json = await res.json();
    if(json && json.open && json.close) return json;
    throw new Error("invalid data");
  }catch(e){
    console.warn("GASからの取得に失敗したため、デフォルトデータを使用します。", e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

// GASへチェック項目データを保存。成功時true、失敗時falseを返す。
async function saveChecklistData(data){
  if(!GAS_URL || GAS_URL.indexOf("ここに") === 0){
    throw new Error("GAS_URLが未設定です。config.jsを編集してください。");
  }
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "save", data: data })
  });
  const json = await res.json();
  if(!json.ok) throw new Error(json.message || "保存に失敗しました");
  return true;
}
