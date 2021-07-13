var isDrag = false;
var iX, iY;
var startX, startY;

    
    //canvas창 크기 브라우저 크기에 맞게 늘리기 위한 코드
    window.onload = function(){
        var _canvas;
        _canvas = document.querySelector("#canvas_frmae");        
        _canvas.width = window.innerWidth;
        _canvas.height = window.innerHeight;
        console.log("height"+window.innerHeight);
        console.log("width"+window.innerWidth);        
    }

    

    
    //저장된 상자 출력
    var json_width, json_height, json_top, json_left;

    function show_box() {

        var json_box = JSON.parse(sessionStorage.getItem('json_box'));
        json_top = json_box.top_j;
        json_left = json_box.left_j;
        json_width = json_box.width_j;
        json_height = json_box.height_j;
        const canvas_json = document.getElementById('canvas_frmae');
        const ctx_json = canvas_json.getContext('2d');
        ctx_json.strokeRect(json_left,json_top,json_width,json_height);     
    }


    //캡쳐 영역 좌표 저장할 변수
    var local_width, local_height, local_top, local_left;

    window.onload = function () {
            // 캡쳐 버튼 클릭 이벤트 등록 
            document.getElementById("btn_capture").addEventListener("click", function (e) {
                // 마우스 커서 모양 변경 (eidt_cursor 클래스 추가) 
                document.querySelector("body").classList.add("edit_cursor");
                screenshot(e);
            });
        }

    /* * */
    function check_box(e) {
        
        var json_box = JSON.parse(sessionStorage.getItem('json_box'));

        var min_y = json_box.top_j;
        var min_x = json_box.left_j;
        var max_y = json_box.height_j;
        var max_x = json_box.width_j;

        if (min_x <= e.clickX && e.clientX <= max_x && min_y <= e.clientY && e.clientY <= max_y){
            console.log("good");
        }
        

    }
    function screenshot(e) {
        // var startX, startY;
        var height = window.innerHeight;
        var width = window.innerWidth;

        // 배경을 어둡게 깔아주기 위한 div 객체 생성 
        var $screenBg = document.createElement("div");
        $screenBg.id = "screenshot_background";
        $screenBg.style.borderWidth = "0 0 " + height + "px 0";
        // 마우스 이동하면서 선택한 영역의 크기를 보여주기 위한 div 객체 생성 
        var $screenshot = document.createElement("div");
        $screenshot.id = "screenshot";
        document.querySelector("body").appendChild($screenBg);
        document.querySelector("body").appendChild($screenshot);
        var selectArea = false;
        var body = document.querySelector('body');
        // 마우스 누르는 이벤트 함수 
        var mousedown = function (e) {
            e.preventDefault();
            selectArea = true;
            startX = e.clientX;
            startY = e.clientY;
            // 이벤트를 실행하면서 이벤트 삭제 (한번만 동작하도록) 
            body.removeEventListener("mousedown", mousedown);


/*             json_width, json_height, json_top, json_left;
            if( startX > json_left && startX < ( json_left + json_width ) && startY > json_top && startY < ( json_top + json_height ) )
            {
             isDrag = true;
            } */

        }

        // 마우스 누르는 이벤트 등록 
        body.addEventListener("mousedown", mousedown);

        // 클릭한 마우스 떼는 이벤트 함수 
        var mouseup = function (e) {
            selectArea = false;
            // (초기화) 마우스 떼면서 마우스무브 이벤트 삭제 
            body.removeEventListener("mousemove", mousemove);
            // (초기화) 스크린샷을 위해 생성한 객체 삭제 
            $screenshot.parentNode.removeChild($screenshot);
            $screenBg.parentNode.removeChild($screenBg);
            var x = e.clientX;
            var y = e.clientY;
            var top = Math.min(y, startY);
            var left = Math.min(x, startX);
            var width = Math.max(x, startX) - left;
            var height = Math.max(y, startY) - top;

            local_top = top;
            local_left = left;
            local_width = width;
            local_height = height;            
            

            // 좌표값 변수에 저장
            console.log("1_local : " + local_left, local_top, local_width, local_height);
            
            //로컬 변수 저장
            sessionStorage.setItem('json_box', JSON.stringify({top_j : top, left_j: left, width_j: width, height_j: height}));
            console.log(JSON.parse(sessionStorage.getItem('json_box')));
            var json_box = JSON.parse(sessionStorage.getItem('json_box'));
            json_top = json_box.top_j;
            json_left = json_box.left_j;
            json_width = json_box.width_j;
            json_height = json_box.height_j;


            html2canvas(document.body).then(function (canvas) { //전체 화면 캡쳐 
                // 선택 영역만큼 crop 
                var img = canvas.getContext('2d').getImageData(left, top, width, height);
                var c = document.createElement("canvas");
                c.width = width;
                c.height = height;
                c.getContext('2d').putImageData(img, 0, 0);
                //save(c); // crop한 이미지 저장 //현재 테스트 중임으로 막아놓음
            });
            body.removeEventListener("mouseup", mouseup);
            // 마우스 커서 기본으로 변경 
            document.querySelector("body").classList.remove("edit_cursor");
        
            //사각형 만들기
            const canvas = document.getElementById('canvas_frmae');
            const ctx = canvas.getContext('2d');
            ctx.strokeRect(left, top, width, height);

        }
        body.addEventListener("mouseup", mouseup);
        // 마우스무브 이벤트 함수 
        function mousemove(e) {
            var x = e.clientX;
            var y = e.clientY;
            $screenshot.style.left = x;
            $screenshot.style.top = y;
            if (selectArea) { //캡쳐 영역 선택 그림 
                var top = Math.min(y, startY);
                var right = width - Math.max(x, startX);
                var bottom = height - Math.max(y, startY);
                var left = Math.min(x, startX);
                $screenBg.style.borderWidth = top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px';
                console.log(left, top, width, height);
            }
        }
        body.addEventListener("mousemove", mousemove);

        //상자를 이동시킬 draw 함수
        function draw(){
         const canvas_draw = document.getElementById('canvas_frmae');
         const ctx_draw = canvas_draw.getContext('2d');
         ctx_draw.clearRect(0,0,canvas.width,canvas.height);
         ctx_draw.strokeRect( json_left + iX - startX, json_top + iY - startY, json_width, json_height );
      
         if( isDrag == false )
         {
          json_left = iLeft + iX - startX;
          json_top = iTop + iY - startY;
         }
        }
        body.addEventListener("draw", draw);

        // 캡쳐한 이미지 저장 
        function save(canvas) {
            if (navigator.msSaveBlob) {
                var blob = canvas.msToBlob();
                return navigator.msSaveBlob(blob, '파일명.png');
            } else {
                var el = document.getElementById("target");
                el.href = canvas.toDataURL("image/png", 1);
                el.download = '파일명.png';
                el.click();
            }
        }
    }
