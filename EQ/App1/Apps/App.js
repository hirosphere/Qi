let Main = new function()
{
	this.Init = function()
	{
		let root = new RootPane();
		this.AppPane = new AppPane( root );
		root.UpdateLayout();
		
		let self = this;

		EQFS.Init( onload );
		function onload()
		{
			self.AppPane.OnEQFSComplete();
		}
	};

	this.GMapReady = false;
};

function initGMap()
{
	Main.GMapReady = true;
	Main.AppPane && Main.AppPane.InitGMap();
}

let AppPane = class_def
(
	Pane,
	function()
	{
		this.Build = function()
		{
			this.e = q.div( null, { style: { border: "10px solid #8cf" } } );


			this.Layout = Layout.Horiz;
			this.UpdateTitle();

			let self = this;
		};

		this.OnEQFSComplete = function()
		{
		};

		this.InitGMap = function()
		{
			console.log( google );
		};
	
		this.UpdateTitle = function()
		{
			document.title = "App 1";
		};
	}
);
