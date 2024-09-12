/***************************************
 作成者：柳浦　作成日：2023/08/11
 外国人がひらがなを勉強するためのソフト
 落ちる間に正しいところへマウスで移動する
***************************************/

// いろいろな初期化
let akasatana = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45 ];   // あかさたな列の先頭の配列番号（後でランダム問題作成のため）
let gojyuon = [   // 五十音の文字用の画像ファイル名を配列に入れる（charは落下用、trayは受け皿用）
  [ "char00.png", "tray00.png" ], [ "char01.png", "tray01.png" ], [ "char02.png", "tray02.png" ], [ "char03.png", "tray03.png" ], [ "char04.png", "tray04.png" ],
  [ "char05.png", "tray05.png" ], [ "char06.png", "tray06.png" ], [ "char07.png", "tray07.png" ], [ "char08.png", "tray08.png" ], [ "char09.png", "tray09.png" ],
  [ "char10.png", "tray10.png" ], [ "char11.png", "tray11.png" ], [ "char12.png", "tray12.png" ], [ "char13.png", "tray13.png" ], [ "char14.png", "tray14.png" ],
  [ "char15.png", "tray15.png" ], [ "char16.png", "tray16.png" ], [ "char17.png", "tray17.png" ], [ "char18.png", "tray18.png" ], [ "char19.png", "tray19.png" ],
  [ "char20.png", "tray20.png" ], [ "char21.png", "tray21.png" ], [ "char22.png", "tray22.png" ], [ "char23.png", "tray23.png" ], [ "char24.png", "tray24.png" ],
  [ "char25.png", "tray25.png" ], [ "char26.png", "tray26.png" ], [ "char27.png", "tray27.png" ], [ "char28.png", "tray28.png" ], [ "char29.png", "tray29.png" ],
  [ "char30.png", "tray30.png" ], [ "char31.png", "tray31.png" ], [ "char32.png", "tray32.png" ], [ "char33.png", "tray33.png" ], [ "char34.png", "tray34.png" ],
  [ "char35.png", "tray35.png" ], [ "char36.png", "tray36.png" ], [ "char37.png", "tray37.png" ], [ "char38.png", "tray38.png" ], [ "char39.png", "tray39.png" ],
  [ "char40.png", "tray40.png" ], [ "char41.png", "tray41.png" ], [ "char42.png", "tray42.png" ], [ "char43.png", "tray43.png" ], [ "char44.png", "tray44.png" ],
  [ "char45.png", "tray45.png" ], [ "char46.png", "tray46.png" ], [ "char47.png", "tray47.png" ], [ "char48.png", "tray48.png" ], [ "char49.png", "tray49.png" ]
];
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
let engine = Engine.create(), // 物理演算エンジン
    world = engine.world;

    // デバイスの幅を取得し、スケーリングを決定
    let deviceWidth = window.innerWidth;
    let deviceHeight = window.innerHeight;

    // スマホ用のスケーリング (スマホの場合はサイズを小さくする)
    let scaleFactor = (deviceWidth < 600) ? 0.5 : 1; // 600px以下の幅の場合、サイズを半分にする

    // create Render (デバイスのスケールに基づいて幅と高さを設定)
    let render = Render.create({  // レンダリング
    element: document.body,
    engine: engine,
    options: {
      width: 1000 * scaleFactor,   // スケーリングされた幅
      height: 800 * scaleFactor,   // スケーリングされた高さ
      background: '#eeeeee',  // 背景色
      wireframes: false   // ワイヤーフレームモードオフ
    }
});

// 四角の落下用オブジェクト作成
var char = [];
for (let i=0; i<5; i++) {
  char[i] = Bodies.rectangle(190 * i * scaleFactor + 110 * scaleFactor, 80 * scaleFactor, 110 * scaleFactor, 110 * scaleFactor, {
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
  tray[i] = Bodies.rectangle(190 * i * scaleFactor + 110 * scaleFactor, 690 * scaleFactor, 110 * scaleFactor, 110 * scaleFactor, {
    isStatic: true,
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
let floor = Bodies.rectangle(400 * scaleFactor, 800 * scaleFactor, 1110 * scaleFactor, 40 * scaleFactor, { isStatic: true });
  isStatic: true
});
// 左の壁を作る
let wallLeft = Bodies.rectangle(10 * scaleFactor, 0, 30 * scaleFactor, 1600 * scaleFactor, { isStatic: true });
  isStatic: true
});
// 右の壁を作る
let wallRight = Bodies.rectangle(970 * scaleFactor, 0, 30 * scaleFactor, 1600 * scaleFactor, { isStatic: true });
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
      let numBodyA = pair.bodyA.render.sprite.texture.slice(10, 11)  // file名から番号を取得
      let numBodyB = pair.bodyB.render.sprite.texture.slice(10, 11)  // file名から番号を取得
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
