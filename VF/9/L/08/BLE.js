const BLE_Service = function( suu, wcuu, rcuu )
{
	let device = null;
	let wchar = null;
	let rchar = null;
  
	//callBack
	this.OnScan = function( deviceName ) {console.log( "OnScan" );};
	this.OnConnectGATT = function() {console.log( "OnConnectGATT" );};
	this.OnRead = function( data ) {console.log( "OnRead ");};
	this.OnWrite = function() {console.log( "OnWrite" );};
	this.OnStartNotify = function() {console.log( "OnStartNotify" );};
	this.OnStopNotify = function() {console.log( "OnStopNotify" );};
	this.OnDisconnect = function() {console.log( "OnDisconnect" );};
	this.OnClear = function() {console.log( "OnClear" );};
	this.OnReset = function() {console.log( "OnReset" );};
	this.OnError = function( error ) {console.log( "OnError");};

  
  
	const scan = () =>
	{
		return ( device ? Promise.resolve() : requestDevice( ) )
		.catch ( error => {
			console.log( 'Error : ' + error );
			this.OnError(error);
		});
	};
  
	const requestDevice = () =>
	{
		console.log( "Execute : requestDevice" );

		return navigator.bluetooth.requestDevice
		(
			{
				acceptAllDevices: true,
				optionalServices: [ suu ]
			}
		)

		.then
		(
			Device =>
			{
				device = Device;
				device.addEventListener( "gattserverdisconnected", () => this.OnDisconnect );
				this.OnScan( device.name );
			}
		);
	};
  
  
	const connectGATT = () =>
	{
		if( ! device )
		{
			var error = "No Bluetooth Device";
			console.log('Error : ' + error);
			this.OnError(error);
			return;
		}
		
		if ( device.gatt.connected && ( wchar || rchar )  )
		{
			//if(this.hashUUID_lastConnected == uuid)
			return Promise.resolve();
		}

		//this.hashUUID_lastConnected = uuid;
		console.log('Execute : connect');

		return device.gatt.connect()

		.then
		(
			Server =>
			{
				console.log('Execute : getPrimaryService');
				return Server.getPrimaryService( suu );
			}
		)
		.then
		(
			Service =>
			{
				console.log('Execute : getCharacteristic');
				return Promise.all
				(
					[
						Service.getCharacteristic( wcuu || rcuu ),
						Service.getCharacteristic( rcuu || wcuu )
					]
				);
			}
		)
		.then
		(
			Characteristic =>
			{
				wchar = Characteristic[ 0 ];
				rchar = Characteristic[ 1 ];
				rchar.addEventListener (
					"characteristicvaluechanged", ( ev ) => this.OnRead( ev.target.value ));
				this.OnConnectGATT();
			}
		)
		.catch( err => {
			console.log('Error : ' + err );
			this.OnError( err );
		});
	};
  
  
	this.Read = function()
	{
		return ( scan() )
		.then( () =>
		{
			return connectGATT();
		})
		.then( () =>
		{
			console.log('Execute : readValue');
			return rchar.readValue();
		})
		.catch( err =>
		{
			console.log( 'Error : ' + err );
			this.OnError( err );
		});
	};
  
  
	this.Write_String = function( value )
	{
		const ar = [];
		for( let ch of value )  ar.push( ch.charCodeAt( 0 ) );  
		this.Write( ar );
	};

	this.Write = function( array_value )
	{
		return ( scan() )
		.then( () =>
		{
			return connectGATT();
		})
		.then( () =>
		{
			console.log('Execute : writeValue');
			return wchar.writeValue( Uint8Array.from( array_value ) );
		})
		.then( () =>
		{
			this.OnWrite();
		})
		.catch( err =>
		{
			console.log( 'Error : ' + err );
			this.OnError( err );
		});
	};
  
  
	this.StartNotify = function()
	{
		return ( scan() )
		.then( () => {
			return connectGATT();
		})
		.then( () => {
			console.log('Execute : startNotifications');
			rchar.startNotifications()
		})
		.then( () => {
			this.OnStartNotify();
		})
		.catch( err => {
			console.log( 'Error : ' + err );
			this.OnError( err );
		});
	};


	this.StopNotify = function()
	{
		return ( scan() )
		.then( () => {
			return connectGATT();
		})
		.then( () => {
			console.log('Execute : stopNotifications');
			rchar.stopNotifications()
		})
		.then( () => {
			this.OnStopNotify();
		})
		.catch( err => {
			console.log( 'Error : ' + err );
			this.OnError( err );
		});
	};
  
  
	const disconnect = () =>
	{
		if ( ! device )
		{
			var error = "No Bluetooth Device";
			console.log('Error : ' + error);
			this.OnError(error);
			return;
		}

		if ( device.gatt.connected )
		{
			console.log('Execute : disconnect');
			device.gatt.disconnect();
			device = null;
		}
		else
		{
			var error = "Bluetooth Device is already disconnected";
			console.log('Error : ' + error);
			this.OnError(error);
			return;
		}
	};
  
  
	const clear = () =>
	{
		console.log('Excute : Clear Device and Characteristic');
		this.bluetoothDevice = null;
		this.dataCharacteristic = null;
		this.OnClear();
	};
  
  
	this.Reset = function()
	{
		console.log('Excute : reset');
		disconnect(); //disconnect() is not Promise Object
		clear();
		this.OnReset();
	};
};
