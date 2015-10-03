;(function ( $, window, document, undefined ) {
	"use strict";

	var defaults = {
		rowHeight: 20
	};

	function FastTable(element, options) {
		this.element  = element;
		this.settings = $.extend({}, defaults, options);
		this.init();
	}

	$.extend(FastTable.prototype, {
		init: function () {
			var self = this;
			var $elm = $(self.element);

			self.items = self.settings.items || [];

			self.topIndex = 0;
			self.maxRowsInView = ($elm.height() / self.settings.rowHeight);
			self.endIndex = self.maxRowsInView;

			var $tableContainer = $('<div/>', {id: 'table-container'}).height(self.items.length * self.settings.rowHeight).appendTo($elm);
			self.$table = $('<table/>').height(self.maxRowsInView * self.settings.rowHeight).css('position','relative').appendTo($tableContainer);

			self.displayRowsFrom(self.topIndex, false);

			$elm.on('scroll', function () {
				var scrolledRows = Math.floor($(this).scrollTop() / self.settings.rowHeight);
				if(Math.abs(scrolledRows - self.topIndex) >= 1){
					self.displayRowsFrom(scrolledRows, true);
				}
			});
		},
		createRow: function (rowIdx) {
			var $rowElem = $('<tr/>');
			this.settings.buildRow($rowElem[0], rowIdx);
			return $rowElem;
		},
		displayRows: function (fromIndex, toIndex, removeRows) {
			for (var index = fromIndex; index < toIndex; index++) {
				if(removeRows){$("tr:first", this.$table).remove();}
				this.createRow(index).appendTo(this.$table);//.show('slow');
			}
		},
		displayRowsFrom: function (fromIndex, removeRows) {
			if (fromIndex + this.maxRowsInView >= this.endIndex && this.endIndex === this.items.length) { return; }

			this.topIndex = fromIndex;
			if(this.topIndex + this.maxRowsInView > this.items.length){ this.topIndex = this.items.length - this.maxRowsInView; }
			this.endIndex = this.topIndex + this.maxRowsInView;

			this.displayRows(this.topIndex, this.endIndex, removeRows);
			this.$table.css('top', this.topIndex * this.settings.rowHeight);
		}
	});

	$.fn.fastTable = function (options) {
		return this.each(function () {
			if (!$.data(this, "fastTable")) {
				$.data(this, "fastTable", new FastTable(this, options));
			}
		});
	};
})( jQuery, window, document );
