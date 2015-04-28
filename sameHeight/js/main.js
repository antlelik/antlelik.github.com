window.onload = function() {
	function blockHeight(node) {
		var nodeParent = document.querySelectorAll(node),
				nodeParentList = Array.prototype.slice.apply(nodeParent);

		nodeParentList.forEach(function(node) {
			var nodeList = node.querySelectorAll('div'),
				pureHeight,
				realHeight,
				maxHeight = 0,
				nodeArr = Array.prototype.slice.apply(nodeList);


			nodeArr.forEach(function(el){
				pureHeight = el.offsetHeight;
				maxHeight = Math.max(maxHeight, pureHeight);
			});

			nodeArr.forEach(function(el){
				realHeight = maxHeight - parseFloat(getComputedStyle(el).paddingBottom) - parseFloat(getComputedStyle(el).paddingTop) - parseFloat(getComputedStyle(el).borderTopWidth) - parseFloat(getComputedStyle(el).borderBottomWidth);
				el.style.height = realHeight + 'px';
			});

		});
	}

	blockHeight('.box');
};