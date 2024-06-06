/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

//CKEDITOR.editorConfig = function( config ) {
//	// Define changes to default configuration here. For example:
//	// config.language = 'fr';
//	// config.uiColor = '#AADC6E';
//};
//
//CKEDITOR.editorConfig = function(config) {
//   config.filebrowserBrowseUrl = '/assets/js/kcfinder/browse.php?type=files';
//   config.filebrowserImageBrowseUrl = '/assets/js/kcfinder/browse.php?type=images';
//   config.filebrowserFlashBrowseUrl = '/assets/js/kcfinder/browse.php?type=flash';
//   config.filebrowserUploadUrl = '/assets/js/kcfinder/upload.php?type=files';
//   config.filebrowserImageUploadUrl = '/assets/js/kcfinder/upload.php?type=images';
//   config.filebrowserFlashUploadUrl = '/assets/js/kcfinder/upload.php?type=flash';
//   config.uiColor = '#DBEDF6';
//   config.skin = "kama";
//
//};

CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: ['spellchecker'] },
		'/',
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'blocks'] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
//		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
//		{ name: 'others', groups: [ 'others' ] },
//		{ name: 'about', groups: [ 'about' ] }
	];

	config.removeButtons = 'Subscript,Superscript,Table,HorizontalRule,SpecialChar,Unlink,Anchor,Strike,Format,NumberedList,Outdent,Indent,Maximize';
};
