//console.log("load mSoftComp");

function mSoftComp(){
    console.log("run mSoftComp1");
    let appHeight = appBodyHeight();
    console.log("run mSoftComp2");
    $("#appBody").html('<div id="tab12"><div id="tabS"></div><div id="tabSC"></div></div><div id="tab34"><div id="tabC"></div><div id="tabCS"></div></div>');
    $("#appBody").height(appHeight);
    createTabulatorSoft("tabS", appHeight / 2, "");
    createTabulatorComp("tabC", appHeight / 2, "");
    console.log("run mSoftComp3");
}
