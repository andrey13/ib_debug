// глобальные константы -----------------------------------------------------------------
const ESK_ON  = '2'; // признак активного компьютера или пользователя в ЕСК
const ESK_OFF = '1'; // признак заблокированного компьютера или пользователя в ЕСК
const ESK_NO  = '0'; // признак отсутствия компьютера или пользователя в ЕСК
const SELECTABLE_ON  = true;
const SELECTABLE_OFF = false;
const SELECTABLE_1   = 1;

// // функция, выполняемая после нажания на клавишу ESC ------------------------------------
// let esc_fun = () => { console.log('esc_fun') }


// параметры пользователя ---------------------------------------------------------------
let g_user =  {usr:"", pwd:"", name:"", account:""};

// цвета уязвимостей --------------------------------------------------------------------
let g_color_v3 = "#fc0505";
let g_color_v2 = "#e6922c";
let g_color_v1 = "#ffc175";
let g_color_v0 = "#ffdd75";
let g_color_vn = "#7ede7e";

// активный модуль ----------------------------------------------------------------------
let g_moduleActive = "";

// таймеры ------------------------------------------------------------------------------
let g_timerId = 0

// ??? ----------------------------------------------------------------------------------
let ifns_auth = "";
let c_user_mode = "A";

// серекторы ----------------------------------------------------------------------------
//let sel_STAT = loadSelector("status");
//let sel_LVST = loadSelector("lvs_type");
//let sel_TORM = loadSelector("torm");
let sel_STAT = '';
let sel_LVST = '';
let sel_TORM = '';
let div_modal = '';

// указатели табулятора tableGroups
let tableGroups = 0;
let g_id_prog      = 0;
let g_name_prog    = "";
let g_row_goups    = 0;
let g_row_goups_bg = 0;
let g_new_rec_bg   = "#ffdd75";
let g_upd_rec_bg   = "#00dd00";

// указатели табулятора tableScans
let g_id_scan      = 0;
let g_id_scan_last = 0; 
let g_row_scans    = 0;
let g_row_scans_bg = 0;

let allow_R = "0";
let allow_E = "0";
let allow_C = "0";
let allow_D = "0";
let allow_A = "0";

let field_kol_requested = "";
let field_sum_requested = "";
let field_kol_completed = "";
let field_sum_completed = "";
let field_kol_work      = "";

let g_tableFirPrf  = {id_current:0};
let g_tableFirCmp  = {id_current:0};
let g_tableNews    = {id_current:0};
let g_tableComp    = {id_current:0};
let g_tableResTyp  = {id_current:0};
let g_tableResRes  = {id_current:0};
let g_tableResUsr  = {id_current:0};
let g_tableResCmp  = {id_current:0};
let g_tableDionis  = {id_current:0};
let g_tableMod     = {id_current:0};
let g_tableModGrp  = {id_current:0};
let g_tableGrp     = {id_current:0};
let g_tableGrpUsr  = {id_current:0};
let g_tableUsr     = {id_current:0};
let g_tableScns    = {id_current:0};
let g_tableVln     = {id_current:0};
let g_tableIFNS    = {id_current:0};
let g_tableTORM    = {id_current:0};
let g_tableLVS     = {id_current:0};
let g_tableLVST    = {id_current:0};
let g_tableLog     = {id_current:0};
let g_tableQuart   = {id_current:0};
let g_tableScans   = {id_current:0};
let g_tableVulners = {id_current:0};
let g_tableVocab   = {id_current:0};
let g_tableFirUsr  = {};
//let g_tableSZ      = {id_current:0};
//let g_tableD1      = {id_current:0};
//let g_tableD2      = {id_current:0};
//let g_tableD3      = {id_current:0};
//let g_tableD4      = {id_current:0};
//let g_tableD       = [{id_current:0},{id_current:0},{id_current:0},{id_current:0},{id_current:0}];

let dt_now  = moment().format('YYYY-MM-DD');

//get_id_scan_last();
//get_ip();


let g_mainModal = document.getElementById("mainModal");



