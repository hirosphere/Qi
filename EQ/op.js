//	global  //
//	main  //
//  file system  //
//	util  //



//	global  //

var Shell = WScript.CreateObject("WScript.Shell");
var FSO = WScript.CreateObject( "Scripting.FileSystemObject" );
var args = WScript.Arguments;


//	main  //

function main()
{
	var cmd = args( 0 );
	var opt1 = ( args.length > 1 ? args(1) : "" );
	var start = new Date().getTime();

	var curdir = FSO.GetFolder( Shell.CurrentDirectory );
	switch( cmd )
	{
		case "UpdateList": eq_update_list( curdir, opt1 ); break;
	}

	var time = Math.ceil( ( new Date().getTime() - start ) / 1000 );
	alert( time + "秒で終了しました。 ");
}

function eq_update_list( folder, option )
{
	if( folder.name.match( /^[A-Z]+[0-9]+$/i ) )  return;
	
	var list = "";

	for( var iter = new Enumerator( folder.SubFolders ); ! iter.atEnd(); iter.moveNext() )
	{
		var item = iter.item();
		list += "Dir\t" + item.Name + "\t" + item.Size + "\r\n";
		eq_update_list( item, option );
	}

	for( var iter = new Enumerator( folder.Files ); ! iter.atEnd(); iter.moveNext() )
	{
		var item = iter.item();
		if( item.Name.match( /\.(kwin)$/ ) )
		{
			list += "File\t" + item.Name + "\t" + item.Size + "\r\n";
		}
	}

	var listpath = FSO.BuildPath( folder, "Index.txt" );
	if( option == "d" )
	{
		echo( listpath + " - リスト削除" );
		FSO.DeleteFile( listpath );
	}
	else
	{
		echo( folder.Path + " - リスト作成" );
		var ts = FSO.OpenTextFile( listpath, 2, true );
		ts.Write( list );
		ts.Close();
	}
}

//  build  //

function build( filepath )
{
	alert( "ビルドします" );
	if( filepath.match( /\.(c|h|xcp)$/ ) )
	{
		var matchpatt = /(.+)\.(xcp)$/i;
	}
	else if( filepath.match( /\.(cs|csp)$/ ) )
	{
		var matchpatt = /(.+)\.(csp)$/i;
	}
	else
	{
		alert( "有効なファイルタイプではありません。" );
		return;
	}

	var match = proj_match( filepath, matchpatt )
	if( ! match )
	{
		var dir = FSO.GetFile( filepath ).ParentFolder;
		var match = proj_search( dir, matchpatt );
		if( ! match )
		{
			alert( "プロジェクトファイルは見つかりませんでした。")
			return;
		}
	}

	var projfile = match.filepath;
	var type = match.type.toLowerCase();

	echo( "\r\nプロジェクトファイル :\r\n" + projfile + "\r\n" );

	
	var project = readv( projfile );
	if( ! project )
	{
		alert( "プロジェクト設定JSONが無効でした。" );
		return;
	}

	var env = project.Vars || {};
	env.PrjDir =
	env.ProjDir = FSO.GetParentFolderName( projfile );
	valueformat( env, env );

	switch( type )
	{
		case "csp":  CS.Build( project, env );  break;
		case "xcp":  XC.Build( project, env );  break;
	}
}

function proj_match( itempath, matchpatt )
{
	if( FSO.FileExists( itempath ) )
	{
		var match = itempath.match( matchpatt );
		if( match ) return { "filepath": itempath, "type": match[2] };
	}
	return null;
}

function proj_search( dir, matchpatt )
{
	if( dir != null && ! FSO.FolderExists( dir.Path ) )  return null;

	var colls = dir.Files;
	for( var iter = new Enumerator( colls ); ! iter.atEnd(); iter.moveNext() )
	{
		var match = proj_match( iter.item().Path, matchpatt );
		if( match )
		{
			return match;
		}
	}
	return dir.IsRootFolder ? null : proj_search( dir.ParentFolder, matchpatt );
}

function cmd_build( command, project, field, option, env, isreq, errmsg, noquote )
{
	if( project[ field ] !== undefined )
	{
		var value = strformat( project[ field ], env );
		command.push( option + ( noquote ? value : quote( value ) ) );
		return true;
	}
	else if( isreq )
	{
		echo( errmsg );
	}
	return false;
}

function proj_build_srclist( output, srclist, env, parentpath )
{
	if( srclist == null || srclist.constructor != Array )  return;

	for( var i in srclist )
	{
		var item = srclist[i];
		if( item == null )  continue;
		if( item.constructor == String )
		{
			var itempath = FSO.BuildPath( parentpath, item );
			output.push( quote( strformat( itempath, env ) ) );
		}
		else if( item && item.constructor == Object && item.Items )
		{
			var dir = FSO.BuildPath( parentpath, item.Dir );
			proj_build_srclist( output, item.Items, env, dir );
		}
	}
}

//	cs  //

var CS = new function()
{
	var msbuild_4 = "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\msbuild.exe";
	var msbuild = "C:\\Windows\\Microsoft.NET\\Framework64\\v3.5\\msbuild.exe";
	var csc = "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe";
	
	this.Build = function( proj, env )
	{
		echo( "CSC" );
		var command = [ quote( csc ) ];
		
		//

		if( ! cmd_build( command, proj, "Output", "/out:", env, true, "Output の指定がありません。" ) ) return;
		if( ! cmd_build( command, proj, "Target", "/target:", env, true, "Target の指定がありません。", true ) ) return;
		//cmd_build( command, proj, "OutDir", "--OUTDIR=", env );
		
		if( proj.Options )
		{
			for( var i in proj.Options )
			{
				command.push( strformat( proj.Options[i], env ) );
			}
		}

		if( proj.Sources )
		{
			proj_build_srclist( command, proj.Sources, env, "" );
		}
		else
		{
			alert( "ソースリストがありません。" );
			return;
		}

		exec( command, env.ProjDir );
	};
};

//	xc  //

var XC = new function()
{
	var xc8 = "C:\\Program Files (x86)\\Microchip\\xc8\\v1.41\\bin\\xc8.exe";
	
	this.Build = function( proj, env )
	{
		echo( "XC8" );
		var command = [ quote( xc8 ) ];
		
		//

		if( ! cmd_build( command, proj, "Chip", "--CHIP=", env, true, "Chip の指定がありません。", true ) ) return;
		if( ! cmd_build( command, proj, "Output", "-O", env, true, "Output の指定がありません。" ) ) return;
		cmd_build( command, proj, "OutDir", "--OUTDIR=", env );
		cmd_build( command, proj, "ObjDir", "--OBJDIR=", env );
		cmd_build( command, proj, "CodeOffset", "--CODEOFFSET=", env, false, "", true );
		
		if( proj.Options )  for( var i in proj.Options )  command.push( strformat( proj.Options[i], env ) );
		if( proj.IncludePaths )  for( var i in proj.IncludePaths )
		{
			command.push( "-I" + quote( strformat( proj.IncludePaths[i], env ) ) );
		}

		if( proj.Sources )
		{
			proj_build_srclist( command, proj.Sources, env, "" );
		}
		else
		{
			alert( "ソースリストがありません。" );
			return;
		}

		exec( command, env.ProjDir );
	};
};

//  file system  //

//	util  //

function readv( file, failv )
{
	var json = read( file );
	if( json === undefined )  return failv;

	try { return eval( "(" + json + "\r\n)" ); }
	catch( exc ) { return failv; }
}

function read( filepath, failv )
{
	var rt = "";
	if( FSO.FileExists( filepath ) )
	{
		var f = FSO.OpenTextFile( filepath );
		return ( f && ! f.AtEndOfStream ) ? f.ReadAll() : "";
	}
	return failv;
}

function ts_read( ts )
{
	return ( ts && ! ts.AtEndOfStream ) ? ts.ReadAll() : "";
}

function exec( command, currdir )
{
	if( currdir ) Shell.CurrentDirectory = currdir;
	
	echo( command.join( "\r\n" ) + "\r\n" );
	//return;

	var res = Shell.Exec( command.join( " " ) );
	
	echo( "ExitCode : " + res.ExitCode );
	echo( "実行結果 :\r\n\r\n" + ts_read( res.StdOut ) );
}

function alert( msg )
{
	// var time = date_format( "{YYYY}年{M}月{D}日 {B}曜日 {h}時{m}分{s}秒" );
	var time = date_format( "{YYYY}-{MM}-{DD} {B} {hh}:{mm}:{ss}" );
	echo( " -- " + msg + " -- " + time );
}

function echo( msg )
{
	WScript.Echo( msg );
}

function quote( str )
{
	return "\"" + str + "\"";
}

function valueformat( value, vars )
{
	if( value != null )
	{
		if( value.constructor == String )  return  strformat( value, vars );
		if( value.constructor == Object || value.constructor == Array )
		{
			for( var i in value )  value[i] = valueformat( value[i], vars );
		}
	}
	return value;
}

function strformat( format, values )
{
	return ( "" + format ).replace
	(
		/\${([^}]+)}/g,
		function( all, name )
		{
			return values[ name ] + "";
		}
	);
}

String.prototype.sub_ = function( pos )
{
	return this.substr( ( pos < 0 ) ? this.length + pos : pos );
};

var date_format =
function df( format, date )
{
	date = date || new Date();
	var args = arguments;
	return ( "" + format ).replace( /{((`}|[^}])*)}+/g, fn );
	
	function fn( all, name )
	{
		var fn = df_fns[ name ];
		return fn ? fn( date ) : fsrch( name, args, 2, args.length, "" );
	}
};

var df_youbi = [ "日", "月", "火", "水", "木", "金", "土" ];

var df_fns = 
{
	YMD: function( date ) {  return df( "{YYYY}/{MM}/{DD}", date );  },
	YMDB: function( date ) {  return df( "{YYYY}/{MM}/{DD} ({B})", date );  },
	
	YYYY:  function( date )  {  return  "" + date.getFullYear();  },
	YY:  function( date )  {  return  ( "000" + date.getFullYear() ).sub_( -2 );  },
	MM:  function( date )  {  return  ( "0" + ( date.getMonth() + 1 ) ).sub_( -2 );  },
	M:  function( date )  {  return  "" + ( date.getMonth() + 1 );  },
	DD:  function( date )  {  return  ( "0" + date.getDate() ).sub_( -2 );  },
	D:  function( date )  {  return  "" + date.getDate();  },
	B: function( date )  {  return  df_youbi[  date.getDay()  ];  },
	
	hms: function( date )  {  return df( "{hh}:{mm}:{ss}", date );  },
	
	hh:  function( date )  {  return  ( "0" + date.getHours() ).sub_( -2 );  },
	h:  function( date )  {  return  "" + date.getHours();  },
	mm:  function( date )  {  return  ( "0" + date.getMinutes() ).sub_( -2 );  },
	m:  function( date )  {  return  "" + date.getMinutes();  },
	ss:  function( date )  {  return  ( "0" + date.getSeconds() ).sub_( -2 );  },
	s:  function( date )  {  return  "" + date.getSeconds();  },
	
	uYMD: function( date ) {  return df( "{uYYYY}/{uMM}/{uDD}", date );  },
	
	uYYYY:  function( date )  {  return  "" + date.getUTCFullYear();  },
	uYY:  function( date )  {  return  ( "000" + date.getUTCFullYear() ).sub_( -2 );  },
	uMM:  function( date )  {  return  ( "0" + ( date.getUTCMonth() + 1 ) ).sub_( -2 );  },
	uDD:  function( date )  {  return  ( "0" + date.getUTCDate() ).sub_( -2 );  }
};


//    //

main();
