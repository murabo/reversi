
var color = 0; // 0は黒、1は白
var stlist = ["●","○"];
var counter = 60; // おける場所の数。
var chkArray = [];
var debug = false;
var vector = [[-1,1],[0,1],[1,1],[-1,0],[1,0],[-1,-1],[0,-1],[1,-1]];
var stCnt = [2,2];
var badlist = [[0,1],[1,1],[1,0],[0,6],[1,6],[1,7],[6,0],[6,1],[7,1],[6,6],[6,7],[7,6]];
var goodlist = [[0,0],[0,7],[7,0],[7,7]];
var cpuFlg = false;

function init(){
    /*
    Start画面の作成
    */
    $(function () {
        $('.ef').textillate({
            autoStart: true,
            in:{effect: 'bounceInDown'}

        });
        $('.bl').textillate({
            autoStart: true,
            loop:true,
            initialDelay: 100,
            in:{effect: 'flash',
                sync:true
            },
            out: {
                effect: 'flash',
                delayScale: 1.5,
                delay: 50,
                sync: false,
                shuffle: false
            }
        });
    })
}

function start() {
    var tag = "";
    counter = 60;
    color = 0;
    cpuFlg = false;
    stCnt = [2,2];
    var trTag = "";
    var tag4 = "";
    for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
            if(j==0){
                trTag = document.createElement('tr');
            }
            var tdTag = document.createElement('td');
            tdTag.id = (j +"_"+ i);
            tdTag.width=22;
            tdTag.height=22;
            if((i==3 && j==3) ||
                (i==4 && j==4)){
                tdTag.innerHTML = "●";
            }else if((i==3 && j==4) ||
                (i==4 && j==3)){
                tdTag.innerHTML = "○";
            }else{
                tdTag.innerHTML = "";
            }
            trTag.appendChild(tdTag);
            if(j==7){
                tag += trTag.outerHTML;
            }
        }
    }
    document.getElementById("rBody").innerHTML=tag;
    var tds = document.getElementsByTagName("td");
    for (var i=0; i<tds.length;i++){
        tds[i].addEventListener("click",(function(){cl(this.id)}),false);
    }
    document.getElementById("start").innerHTML="";
    document.getElementById("result").innerHTML="";
    document.getElementById("color").innerHTML="プレイヤー"+stlist[color]+"の番です<br>";
    document.getElementById("counter").innerHTML="●"+stCnt[0]+" : ○" + stCnt[1];
    document.getElementById("cpu").innerHTML="one play?<br><br>";
}
function lineCheck(id,v_x,v_y){
    /*
     クリックした所から、1lineおけるのかチェック
     x,yで、チェックするベクトルを決める。
     */
    if (id!=""){
        //console.log(id);
        xy = id.split("_");
    }else{
        document.getElementById("result").innerHTML="プレイヤー"+stlist[color]+"の勝利です！<br><a href='javascript:start();'>Reset</a>";
        return;
    }

    var x = parseInt(xy[0]);
    var y = parseInt(xy[1]);
    var flg = false;
    var chkCnt = 0;

    while(!flg){
        x+=v_x;
        y+=v_y;
        if(x<0 || x>7 || y<0 || y>7){
            return false;
        }
        var id = x+"_"+y;

        tmp = document.getElementById(id).innerHTML;

        if(chkCnt==0 &&
            ((color==0 && "●"==tmp) ||
                (color==1 && "○"==tmp))){
            return false;
        } else if(tmp==""){
            return false;
        }else if ((color==1 && "●"==tmp) || (color==0 && "○"==tmp)){
            /*
             自分の色と違う色の場合かうんとupしてみる
             */
            chkCnt++;

        } else if(chkCnt>0 && ((color==0 && "●"==tmp) || (color==1 && "○"==tmp))) {

            flg = true;
        }
    }
    if(flg) return chkCnt;

    return false;
}
function putCheck(id){
    /*
     オセロの石がおけるかチェック
     lineCheckを8方向に実行する
     */
    if (counter == 0) return;
    var st = document.getElementById(id).innerHTML
    chkArray = [];

    if(st == "●" || st == "○"){
        return false;
    }
    //console.log(id);
    for(var i=0;i<vector.length;i++){
        chkArray.push(lineCheck(id,vector[i][0],vector[i][1]));
    }

    var xy = id.split("_");
    var x = parseInt(xy[0]);
    var y = parseInt(xy[1]);
    for(var j=0;j<chkArray.length;j++){

        if(chkArray[j] != false){
            return true;
        }

    }
    return false;
}
function putStone(id){
    /*
     ・石おきます。
     ・石反転処理を各ベクトルに実施します。
     ・ターンチェンジ？
     */
    document.getElementById("cpu").innerHTML="";
    if(!putCheck(id))return;

    putAndReverse(id);

    document.getElementById("result").innerHTML="";
    counter--;
    playerChange();

    if(cpuFlg && color){
        id = choiceCpu();
        // 考えてる風に1秒待たせる。
        setTimeout(function(){
            putStone(id);
        }, 1000);
    }
}
function choiceCpu(){
    var tmpMaxNum = 0;
    var tmpNum = 0;
    var tmpId = "";
    var tmpBadId = "";

    for (var i=0;i<8;i++){
        for (var j=0;j<8;j++){
            putCheck(i+"_"+j);
            tmpNum = 0;
            for(var n=0;n<chkArray.length;n++){
                if(chkArray[n]!=false && chkArray[n]!=""){
                    tmpNum += chkArray[n];
                }
            }
            for(var q=0;q<badlist.length;q++){
                if(tmpNum>0 && badlist[q].toString() == [i,j].toString()){
                    tmpBadId = i+"_"+j;
                    tmpMaxNum = tmpNum;
                }
            }
            if(counter > 30){
                if ((tmpMaxNum==0 && tmpNum > 0) ||
                    (tmpMaxNum>tmpNum && tmpNum > 0)){
                    tmpMaxNum = tmpNum;
                    if (tmpBadId != i+"_"+j){
                        tmpId = i+"_"+j;
                    }
                }
            }else{
                if(tmpMaxNum<tmpNum && tmpNum > 0){
                    tmpMaxNum = tmpNum;
                    if (tmpBadId != i+"_"+j){
                        tmpId = i+"_"+j;
                    }
                }
            }
            for(var m=0;m<goodlist.length;m++){
                if(tmpNum>0 && goodlist[m].toString() == [i,j].toString()){
                    tmpId = i+"_"+j;
                    return tmpId;
                }
            }
        }
    }
    if (tmpId=="" && tmpBadId!=""){
        return tmpBadId;
    }
    return tmpId;
}
function putAndReverse(id, x, y ,v_x,v_y){
    /*
     オセロの石を反転させる処理
     */
    var xy = id.split("_");
    var x = parseInt(xy[0]);
    var y = parseInt(xy[1]);
    function reverse(x, y, v_x,v_y){
        var chkCnt = 0;
        x+=v_x;
        y+=v_y;
        if(x<0 || x>7 || y<0 || y>7){
            return false;
        }
        var id = x+"_"+y;
        tmp = document.getElementById(id).innerHTML;
        if ((color==1 && "●"==tmp) || (color==0 && "○"==tmp)){
            document.getElementById(id).innerHTML = stlist[color];
            // 黒の場合
            if (color == 0) {
                stCnt[0]++;
                stCnt[1]--;
            }else{
                stCnt[0]--;
                stCnt[1]++;
            }
            reverse(x, y, v_x,v_y);
        } else if((color==0 && "●"==tmp) || (color==1 && "○"==tmp)) {
            return ;
        }
    }

    for(var j=0;j<chkArray.length;j++){
        if(chkArray[j]){
            reverse(x, y, parseInt(vector[j][0]),parseInt(vector[j][1]));
        }
    }
    stCnt[color]++;
    document.getElementById(id).innerHTML=stlist[color];
}
function playerChange(){
    /*
     プレイヤーをチェンジする処理
     */
    var name = "プレイヤー";
    if(cpuFlg && color){
        name = "CPU";
    }

    if(checkGameOver()){
        var player = "●"
        if(stCnt[0]<stCnt[1]){
            player = "○"
        }
        document.getElementById("result").innerHTML=player+"の勝利です！<br><a href='javascript:start();'>Reset</a>";
    }
    if (color == 0){
        color=1;
    } else {
        color = 0;
    }
    var skipFlg = skipCheck();

    if (skipFlg && counter>0) {
        document.getElementById("result").innerHTML=name+stlist[color]+"の置ける場所がないのでSKIPしました";
        playerChange();
    }
    if(cpuFlg && color){
        name = "CPU";
    } else {
        name = "プレイヤー";
    }
    document.getElementById("color").innerHTML=name+stlist[color]+"の番です<br>";
    document.getElementById("counter").innerHTML="●"+stCnt[0]+" : ○" + stCnt[1];
}
function cpuMode(){
    cpuFlg = true;
    document.getElementById("cpu").innerHTML="CPU VS MODE<br>";
}

function skipCheck(){
    var tmpNum = 0;
    for (var i=0;i<8;i++){
        for (var j=0;j<8;j++){
            putCheck(i+"_"+j);
            for(var n=0;n<chkArray.length;n++){
                if(chkArray[n]!=false && chkArray[n]!=""){
                    tmpNum += chkArray[n];
                }
            }
        }
    }
    if (tmpNum) return false;
    return true;
}
function checkGameOver(){
    if(counter==0) return true;
    if(stCnt[0]==0 || stCnt[1]==0) return true;
    return false;
}

function cl(id){
    //alert(id);
    if(cpuFlg && color){
        return ;
    }
    putStone(id);

}