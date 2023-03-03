export {allowDrop, dragStart, dragOver, olDrop};

function allowDrop(ev) {
	ev.preventDefault();
}

let _dragStartEl;

function dragStart(ev) {
	ev.target.classList.add('dragging');
	if(ev.target.parentNode.id != 'Songs' && ev.altKey) {
		ev.target.remove();
	} else {
		ev.dataTransfer.effectAllowed = ev.target.parentNode.id === 'Songs' || ev.shiftKey ? 'copy' : 'move';
		_dragStartEl = ev.target;
	}
}

function dragOver(e) {
	if(e.target.parentNode.id === 'Songs') {
		e.target.classList.remove('dragging');
		return;
	}
	if(_dragStartEl.parentNode != e.target.parentNode) return;
	e.preventDefault();
	e.target.classList.remove('dragging');
	if (isBefore(_dragStartEl, e.target)) {
		e.target.parentNode.insertBefore(_dragStartEl, e.target);
	} else {
		e.target.parentNode.insertBefore(_dragStartEl, e.target.nextSibling);
	}
}

function olDrop(ev) {
	_dragStartEl.classList.remove('dragging');
	(ev.target.nodeName === 'LI' ? ev.target.parentNode : ev.target).setAttribute('changed', 'yes');
	document.querySelector('#savePlBtn').hidden = false;
	if(ev.target === _dragStartEl) return;
	const target = ev.target.nodeName === 'LI' ? ev.target.parentNode : ev.target;
	if(ev.dataTransfer.effectAllowed === 'copy') {
		_dragStartEl= _dragStartEl.cloneNode(true);
		// cloning DOES NOT copy event listeners
		_dragStartEl.addEventListener('dragover', dragOver);
		_dragStartEl.addEventListener('dragstart', dragStart);
	}
	target.appendChild(_dragStartEl);
}

function isBefore(el1, el2) {
	if (el2.parentNode === el1.parentNode)
		for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
			if (cur === el2)
				return true;
	return false;
}
