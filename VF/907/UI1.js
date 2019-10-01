
const テスト1型 = function( 幹 )
{
	const この実体 = this;
	const 枝 = Divを作成( 幹 );

	const doc1 = new モデル群.楽器型();
	const data = doc1.保存値を取得();

	//const hash = URON.変換( data );
	const hash = URON.変換( { Array: [ "天球・地磁気真理教 尊師", true, false, null ] } );
	//const hash = URON.変換( { WF: "*+Sw 1 40 3,Sq 2 20 1;Sn 6 10 Sn 32 3;" } );
	//const hash = URON.変換( { WF: ["*",["HP",3,12],["+",["Sw",1,50,2.8],["Sw",4,30,1.5]]],Patts:{T1:"ClClglglalalblbl",T2:"Eigiaibi"}, テスト: { Matts: { BG: [ 210, 40, 70 ] } } } );
	//const hash = URON.変換( { WF: ["*",["HP",3,12],["+",["Sw",1,50,2.8],["Sw",4,30,1.5]]]} );
	
	//const hash = URON.変換( { Insts: { Tune: 0, Auto: true, Synths: null }, Songs: [ { Title: "Moldau { Vultava }", Tempo: 90 } ] } );
	//const json1 = URON.JSONに復元( hash );
	const json1 = URON.ハッシュ外皮を除去( hash );
	let json2 = "";
	try{ json2 = JSON.stringify( JSON.parse( json1 ) ) } catch {};
	
	{
		const p = Pを作成( 枝, { 文: [ hash, json1, json2 ].join("\n\n") } );
	}

	{
		const p = Pを作成( 枝 );
		Aを作成( p, { 文: hash, 属性: { href: hash } } )
	}

	{
		const div = Divを作成( 枝, {} );
		new グラフ型( div, { 幅: 500, 高さ: 300, 背景色: "hsl( 210, 77%, 84% )" } );
	}
};
