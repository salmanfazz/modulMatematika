function ButtonTrackingObj(exp, titleName, cm, frame){
   this.VarTrivBtnTracking = new Variable( 'VarTrivBtnTracking', null, 0, cm, frame, exp, titleName, true );
   this.title = null;
}

ButtonTrackingObj.codeToStateMap =
{
	'N' : 'normalState',
	'O' : 'overState',
	'D' : 'downState',
	'A' : 'disabledState',
	'V' : 'visitedState',
	'S' : 'selectedState'
};
ButtonTrackingObj.stateToCodeMap = {};
for (var key in ButtonTrackingObj.codeToStateMap)
	ButtonTrackingObj.stateToCodeMap[ButtonTrackingObj.codeToStateMap[key]] = key;

ButtonTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivBtnTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split(',');
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var status = arrStatus[i];
			        var node = this.FindNode( this.title, id );
			        if( node )
						node.v = ButtonTrackingObj.codeToStateMap[status] || status;
		        }
    		}
        }
    } catch (e) { }
}

ButtonTrackingObj.prototype.FindNode = function( node, id )
{
	if( node.id == id )
		return node;
	
	var match = null;
	if( typeof( node.c ) != 'undefined' ){
		for( var i=0; i<node.c.length; i++ ){
			match = this.FindNode( node.c[i], id );
			if( match != null )
				break;
		}
	}
	
	return match;
}

ButtonTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		return 'normalState';
	}
}


ButtonTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );

	return status;
}


ButtonTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
{
	if( node == null )
		return;
	node.v = status;
	if( status == 0 && typeof(node.c)!='undefined')
	{
		for( var i=0; i<node.c.length; i++ )
			this.InternalSetRangeStatus( node.c[i], status ); 
	}
}

ButtonTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

ButtonTrackingObj.prototype.IterateTree = function( func )
{
	var stack = [];
	stack.push( this.title );
	var i = 0;
	while( stack.length > 0 )
	{
		var node = stack.shift();
		
		if( typeof(node.c) != 'undefined' )
			stack = node.c.concat(stack);
			
		//do the thing
		func( node, i, stack );
		i++;
	}	
}

ButtonTrackingObj.prototype.SavePageTracking = function()
{
	var fnIsSaveState = window.ObjButton && ObjButton.isSaveState || function () { return false; };
	var hexString = '';
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree(function(node, i, stack){
		if (fnIsSaveState(node.v))
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
		hexString += (i > 0 ? ',' : '') + arrayIds[i].toString(16);

	hexString += (arrayIds.length > 0 ? '#' : '');
	
	for (var i = 0; i < arrayStatus.length; i++)
		hexString += (i > 0 ? ',' : '') + (ButtonTrackingObj.stateToCodeMap[arrayStatus[i]] || arrayStatus[i]);

	//LD-8267 - Added a condition to avoid tracking null/empty data unnecessarily
	if (hexString.length > 0 || (myTop.suspendDataCache && myTop.suspendDataCache.indexOf('VarTrivBtnTracking') >= 0) || !this.VarTrivBtnTracking.bSCORM)
		this.VarTrivBtnTracking.set(hexString);
}

var trivBtnTracking = new ButtonTrackingObj(365,'lkpd_finalllll', 0, null);
trivBtnTracking.title={id:1,v:0,c:[{id:96,v:'normalState'},{id:373,v:'normalState'},{id:835,v:'normalState'},{id:1098,v:'normalState'},{id:1753,v:'normalState'},{id:1904,v:'normalState'},{id:2205,v:'normalState'},{id:2781,v:'normalState'},{id:3268,v:'normalState'},{id:3895,v:'normalState'},{id:4647,v:'normalState'},{id:5026,v:'normalState'},{id:6314,v:'normalState'},{id:6437,v:'normalState'},{id:8010,v:'normalState'},{id:8487,v:'normalState'},{id:9111,v:'normalState'},{id:9495,v:'normalState'},{id:11223,v:'normalState'},{id:11908,v:'normalState'},{id:13299,v:'normalState'},{id:13879,v:'normalState'},{id:17308,v:'normalState'},{id:17458,v:'normalState'},{id:18773,v:'normalState'},{id:18979,v:'normalState'},{id:20473,v:'normalState'},{id:21094,v:'normalState'}]};
