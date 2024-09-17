/***************************************
 作成者：柳浦　作成日：2023/08/11
              修正日：2024/09/17
 外国人がひらがなを勉強するためのソフト
 落ちる間に正しいところへマウスで移動する
***************************************/

// いろいろな初期化
// 0から130まで、5つ置きの数値を配列に追加
let akasatana = [];
for (let i = 0; i < 130; i += 5) {
  akasatana.push(i);
}
// char000.png～char129.png と tray000.png～tray129.png を生成して gojyuon 配列に追加
let gojyuon = [];
for (let i = 0; i < 130; i++) {
  // 3桁にフォーマットされた番号を作成
  let fileNumber = String(i).padStart(3, '0');

  // char と tray のファイル名を配列に追加
  gojyuon.push([`char${fileNumber}.png`, `tray${fileNumber}.png`]);
}
var rectChar = [];  // 落下用ファイル名の配列
var rectTray = [];  // 受け皿用ファイル名の配列
var useChar = [0, 0, 0, 0, 0];  // 同じランダム数にならないための変数
var fin0 = fin1 = fin2 = fin3 = fin4 = 0;   // 全部正解したかを判定する変数

// 問題作成
akasatanaNo = akasatana[ Math.floor(Math.random(akasatana) * akasatana.length) ];   // あかさたなのどの列を問題にするか決める
let i = 0;
while (i < 5) {   // 落下する5文字をランダムに配列に入れる
  shuffle = Math.floor(Math.random()*5)
  if(useChar[shuffle] == 0) {   // 未使用の配列のときのみ以下の処理を行う
    rectChar[i] = gojyuon[akasatanaNo + shuffle][0];    // 落下用ファイル名取得
    rectTray[i] = gojyuon[akasatanaNo + i][1];          // 受け皿用ファイル名取得（受け皿はあいうえお順とする）
    useChar[shuffle] = 1;       // 配列を使用済みに変更する
    i++;    // 1文字埋めたのでiを1増やす
  }
}

let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create Engine
// エンジンを作成するときに timing の設定を調整する
let engine = Engine.create({
  timing: {
    timeScale: 0.8 // これを 1.0 より小さくするとシミュレーション速度が落ち、精度が上がる
  }
});
    world = engine.world;

// create Render
let render = Render.create({  // レンダリング
    element: document.body,
    engine: engine,
    options: {
      width: 1000,   // 幅
      height: 800,  // 高さ
      background: '#eeeeee',  // 背景色
      wireframes: false   // ワイヤーフレームモードオフ
    }
});

// 四角の落下用オブジェクト作成
var char = [];
for (let i=0; i<5; i++) {
  char[i] = Bodies.rectangle(190*i+110, 80, 110, 110, {
    frictionAir: 0.3,
    inertia: Infinity,
    render: {
      sprite: {
        texture: "char/" + rectChar[i]
      }
    }
  });
}

// 落下用ひらがな図形を追加
for (let i=0; i<5; i++) {
  World.add(world, [
    char[i],
  ]);
}


// 受け皿用オブジェクトを作成
var tray = [];
for (let i=0; i<5; i++) {
  tray[i] = Bodies.rectangle(190*i+110, 690, 110, 110, {
    isStatic: true ,
    render: {
      sprite: {
        texture: "tray/" + rectTray[i]
      }
    }
  });
}
// 受け皿用図形を追加
for (let i=0; i<5; i++) {
  World.add(world, [
    tray[i],
  ]);
}

// 床を作る
let floor = Bodies.rectangle(400, 800, 1110, 40, {
  isStatic: true
});
// 左の壁を作る
let wallLeft = Bodies.rectangle(10, 0, 30, 1600, {
  isStatic: true
});
// 右の壁を作る
let wallRight = Bodies.rectangle(970, 0, 30, 1600, {
  isStatic: true
});
// パーティションを４つ作る
var shortWall = [];
for (let i=1; i<5; i++) {
  shortWall[i] = Bodies.rectangle(200*i-i*5, 650, 10, 300, {
    isStatic: true
  });
}
// 全部の壁、パーティションをworldに追加する
World.add(world, [
    floor,
    wallLeft,
    wallRight
]);
for (let i=1; i<5; i++) {
  World.add(world, [
    shortWall[i],
  ]);
}


Render.run(render);   // render開始
Engine.run(engine);   // engne開始
var startTime = new Date();   // 開始時刻記録

// マウスを使う処理
let MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse;

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
    }
  });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;


// 衝突を検出した時の処理
Matter.Events.on(engine, 'collisionStart', function(event) {
  var pairs = event.pairs;  //衝突物がpairs配列に入る
  // 衝突が一つだとは限らない
  pairs.forEach(function(pair) {
    // BodyBがtrayであることを確認
    let nameBodyB = pair.bodyB.render.sprite.texture.slice(0, 4)  // file名の頭4文字を取得
    if ( nameBodyB == "tray" ) {
      let numBodyA = pair.bodyA.render.sprite.texture.slice(11, 12)  // file名から番号を取得
      let numBodyB = pair.bodyB.render.sprite.texture.slice(11, 12)  // file名から番号を取得
      if ( numBodyA == numBodyB) {  // 正解だった場合good.pngを表示
        if (numBodyA == 0 || numBodyA == 5) fin0 = 1;   // 0番目問題終了
        if (numBodyA == 1 || numBodyA == 6) fin1 = 1;   // 0番目問題終了
        if (numBodyA == 2 || numBodyA == 7) fin2 = 1;   // 0番目問題終了
        if (numBodyA == 3 || numBodyA == 8) fin3 = 1;   // 0番目問題終了
        if (numBodyA == 4 || numBodyA == 9) fin4 = 1;   // 0番目問題終了
        let x = pair.bodyB.position.x   // x座標の取得
        let good = Bodies.rectangle( x, 750, 110, 110, {
        isStatic: true ,
          render: {
            sprite: {
              texture: "good.png"
            }
          }
        });
        World.add(world, good);
        if (fin0==1 && fin1==1 && fin2==1 && fin3==1 && fin4==1) {
          var endTime = new Date();
          var time = (endTime - startTime) / 1000 + "Sec";
          alert(time);
        }
      } else {
        let x = pair.bodyB.position.x
        let bad = Bodies.rectangle( x, 750, 110, 110, {
        isStatic: true ,
          render: {
            sprite: {
              texture: "bad.png"
            }
          }
        });
        World.add(world, bad);
      }
    }
  });
});
