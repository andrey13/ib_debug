import { getAllows, isRole } from '../myjs/start.js'
import { createTabulatorComp } from '../modules/mComp.js'
import { createTabulatorSoft } from '../modules/mSoft.js'

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

export {
    mSoftComp,
}