import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { TinyMCE } from "tinymce";
export class TinyMCEComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;

	// PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
	private _notifyOutputChanged: () => void;
	private _container : HTMLDivElement;
	private _editorHeight : string;
	private _fontFamily : string;
	private _autoResize : boolean;
	private _fontSize : number;
	private _textEditor : HTMLTextAreaElement;
	private _textValue : string | null;
	private _domId: string;
	private _tinymce: TinyMCE;

	constructor()
	{
		this._tinymce = require('tinymce/tinymce');
		require('tinymce/themes/silver');
		require('tinymce/icons/default');

		// Any plugins you want to use has to be imported
		require('tinymce/plugins/paste');
		require('tinymce/plugins/link');
		require('tinymce/plugins/autoresize');
		require('tinymce/plugins/code');
		require('tinymce/plugins/lists');;
		require('tinymce/plugins/table');
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		this._fontFamily = this._context.parameters.fontFamily.raw || "";
		this._fontSize = Number(this._context.parameters.fontSize.raw) || 12;
		this._autoResize = Boolean(this._context.parameters.autoResize.raw) || false;
		this._editorHeight = this._context.parameters.editorHeight.raw || "100%"
		this._container = container;
		this._domId = this.ID();
		this._textEditor = document.createElement("textarea");		
		this._textEditor.setAttribute("id", "text_editor"+this._domId);		
		this._textEditor.innerHTML = this._context.parameters.htmlText.raw || "";
		this._container.appendChild(this._textEditor);		
		container = this._container;
		// Add control initialization code
		this.loadWidget();
	}

	public loadWidget() {
		var plugins = [
			'code',
			'link', 
			'lists',
			'paste',
			'table'
		];
		if(this._autoResize) {
			plugins.push('autoresize');
		}

		this.addCrossOriginShim();

		this._tinymce.init({
			selector: '#text_editor'+this._domId,
			width: "100%",
			height: this._editorHeight || "100%",
			menubar: false,
			statusbar: false,
			font_formats: "Arial=arial,sans-serif; Arial Black=arial black,avant garde; Arial Bold Italic=arial bold italic, arial, sans-serif; Arial Bold=arial bold, arial, sans-serif; Arial Italic=arial italic, arial, sans-serif; Arial Narrow Bold Italic=arial narrow bold italic, arial, sans-serif; Arial Narrow Bold=arial narrow bold, arial, sans-serif; Arial Narrow Italic=arial narrow italic, arial, sans-serif; Arial Narrow Italic=arial narrow italic, arial, sans-serif; Arial Narrow=arial narrow, arial, sans-serif; Arial Unicode MS=arial unicode ms, arial, sans-serif; Batang=batang, arial, sans-serif; BatangChe=batangche, arial, sans-serif; Calibri Bold Italic=calibri bold italic, arial, sans-serif; Calibri Bold=calibri bold, arial, sans-serif; Calibri Italic=calibri italic, arial, sans-serif; Calibri Light Italic=calibri light italic, arial, sans-serif; Calibri Light=calibri light, arial, sans-serif; Calibri=calibri, arial, sans-serif; Cambria Bold Italic=cambria bold italic, arial, sans-serif; Cambria Bold=cambria bold, arial, sans-serif; Cambria Italic=cambria italic, arial, sans-serif; Cambria Math=cambria math, arial, sans-serif; Cambria=cambria, arial, sans-serif; Century Gothic=century gothic, arial, sans-serif; Comic Sans MS Bold Italic=comic sans ms bold italic, sans-serif; Comic Sans MS Bold=comic sans ms bold, sans-serif; Comic Sans MS Italic=comic sans ms italic, sans-serif; Comic Sans MS=comic sans ms, sans-serif; Consolas Bold Italic=consolas bold italic, arial, sans-serif; Consolas Bold=consolas bold, arial, sans-serif; Consolas Italic=consolas italic, arial, sans-serif; Consolas=consolas, arial, sans-serif; Courier New Bold Italic=courier new bold italic,courier; Courier New Bold=courier new bold,courier; Courier New Italic=courier new italic,courier; Courier New=courier new,courier; Dotum=dotum, arial, sans-serif; DotumChe=dotumche, arial, sans-serif; Ebrima Bold=ebrima bold, arial, sans-serif; Ebrima=ebrima, arial, sans-serif; Edwardian Script ITC=edwardian script itc, arial, sans-serif; Freestyle Script=freestyle script, arial, sans-serif; Gadugi=gadugi, arial, sans-serif; Garamond=garamond, arial, sans-serif; Georgia Bold Italic=georgia bold italic,palatino; Georgia Bold=georgia bold,palatino; Georgia Italic=georgia italic,palatino; Georgia=georgia,palatino; Gulim=gulim, arial, sans-serif; GulimChe=gulimche, arial, sans-serif; Gungsuh=gungsuh, arial, sans-serif; GungsuhChe=gungsuhche, arial, sans-serif; Javanese Text=javanese text, arial, sans-serif; Leelawadee UI Bold=leelawadee ui bold, arial, sans-serif; Leelawadee UI Semilight=leelawadee ui semilight, arial, sans-serif; Leelawadee UI=leelawadee ui, arial, sans-serif; Lucida Console=lucida console, arial, sans-serif; Malgun Gothic=malgun gothic, arial, sans-serif; Microsoft Himalaya=microsoft himalaya, arial, sans-serif; Microsoft JhengHei UI=microsoft jhenghei ui, arial, sans-serif; Microsoft JhengHei=microsoft jhenghei, arial, sans-serif; Microsoft New Tai Lue=microsoft new tai lue, arial, sans-serif; Microsoft PhagsPa=microsoft phagspa, arial, sans-serif; Microsoft Tai Le=microsoft tai le, arial, sans-serif; Microsoft YaHei UI=microsoft yahei ui, arial, sans-serif; Microsoft YaHei=microsoft yahei, arial, sans-serif; Microsoft Yi Baiti=microsoft yi baiti, arial, sans-serif; Mongolian Baiti=mongolian baiti, arial, sans-serif; MV Boli=mv boli, arial, sans-serif; Myanmar Text=myanmar text, arial, sans-serif; Nirmala UI Bold=nirmala ui bold, arial, sans-serif; Nirmala UI Semilight=nirmala ui semilight, arial, sans-serif; Nirmala UI=nirmala ui, arial, sans-serif; NSimSun=nsimsun, arial, sans-serif; Segoe MDL2 Assets=segoe mdl2 assets, arial, sans-serif; Segoe Print=segoe print, arial, sans-serif; Segoe UI Black=segoe ui black, arial, sans-serif; Segoe UI Bold Italic=segoe ui bold italic, arial, sans-serif; Segoe UI Bold=segoe ui bold, arial, sans-serif; Segoe UI Emoji=segoe ui emoji, arial, sans-serif; Segoe UI Historic=segoe ui historic, arial, sans-serif; Segoe UI Italic=segoe ui italic, arial, sans-serif; Segoe UI Light=segoe ui light, arial, sans-serif; Segoe UI Semibold=segoe ui semibold, arial, sans-serif; Segoe UI Semilight=segoe ui semilight, arial, sans-serif; Segoe UI Symbol=segoe ui symbol, arial, sans-serif; Segoe UI=segoe ui, arial, sans-serif; SimSun=simsun, arial, sans-serif; Source Code Pro Black Italic=source code pro black italic, arial, sans-serif; Source Code Pro Black=source code pro black, arial, sans-serif; Source Code Pro Bold Italic=source code pro bold italic, arial, sans-serif; Source Code Pro Bold=source code pro bold, arial, sans-serif; Source Code Pro ExtraLight Italic=source code pro extralight italic, arial, sans-serif; Source Code Pro ExtraLight=source code pro extralight, arial, sans-serif; Source Code Pro Italic=source code pro italic, arial, sans-serif; Source Code Pro Light Italic=source code pro light italic, arial, sans-serif; Source Code Pro Light=source code pro light, arial, sans-serif; Source Code Pro Medium Italic=source code pro medium italic, arial, sans-serif; Source Code Pro Medium=source code pro medium, arial, sans-serif; Source Code Pro Semibold Italic=source code pro semibold italic, arial, sans-serif; Source Code Pro Semibold=source code pro semibold, arial, sans-serif; Source Code Pro=source code pro, arial, sans-serif; Source Sans Pro Black Italic=source sans pro black italic, arial, sans-serif; Source Sans Pro Black=source sans pro black, arial, sans-serif; Source Sans Pro Bold Italic=source sans pro bold italic, arial, sans-serif; Source Sans Pro Bold=source sans pro bold, arial, sans-serif; Source Sans Pro ExtraLight Italic=source sans pro extralight italic, arial, sans-serif; Source Sans Pro ExtraLight=source sans pro extralight, arial, sans-serif; Source Sans Pro Italic=source sans pro italic, arial, sans-serif; Source Sans Pro Light Italic=source sans pro light italic, arial, sans-serif; Source Sans Pro Light=source sans pro light, arial, sans-serif; Source Sans Pro Semibold Italic=source sans pro semibold italic, arial, sans-serif; Source Sans Pro Semibold=source sans pro semibold, arial, sans-serif; Source Sans Pro=source sans pro, arial, sans-serif; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Times New Roman Bold Italic=times new roman bold italic, times; Times New Roman Bold=times new roman bold, times; Times New Roman Italic=times new roman italic, times; Times New Roman=times new roman, times; Trebuchet MS Bold Italic=trebuchet ms bold italic, geneva; Trebuchet MS Bold=trebuchet ms bold, geneva; Trebuchet MS Italic=trebuchet ms italic, geneva; Trebuchet MS=trebuchet ms, geneva; Verdana Bold Italic=verdana bold italic,geneva; Verdana Bold=verdana bold,geneva; Verdana Italic=verdana italic,geneva; Verdana=verdana,geneva; Webdings=webdings, zapf dingbats Wingdings 3=wingdings 3, zapf dingbats Wingdings=wingdings, zapf dingbats Yu Gothic Medium=yu gothic medium, arial, sans-serif; Yu Gothic UI Regular=yu gothic ui regular, arial, sans-serif;",
			content_style: "body { font-family: " + this._fontFamily + "; font-size: " + this._fontSize + "pt; }", // Set default font here
			plugins: plugins,
			toolbar: "undo redo | fontselect fontsizeselect  forecolor stylesbold italic underline removeformat | alignleft aligncenter alignright alignjustify lineheight | bullist numlist outdent indent | format | table | help",
			setup:(ed: any) => {
				ed.on('change', (e: any) => {
						this._notifyOutputChanged();
                	}
				);
				ed.on('init', (e: any) => {
					ed.execCommand("fontName", true, this._fontFamily);
					ed.execCommand("fontSize", true, this._fontSize + "pt");
				});			
			}
		});
	}

	ID = function () {
		// Math.random should be unique because of its seeding algorithm.
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return '_' + Math.random().toString(36).substr(2, 9);
	  };

	/**
	 * This is a supportable hack that's necessary to ensure that cross origin frames don't interfere with the TinyMCE editor. 
	 * The TinyMCE editor includes an implementation of the 'on' JQuery method to add event listeners to the window object. 
	 * The implementation iterates over all windows in the DOM, some of which in the case of a Custom Page are cross-origin.
	 * When attempting to access properties on the cross-origin window, an error is thrown and the execution of the script is halted.
	 * There's no supported method for detecting this prior to the error being thrown, so the only way to handle this is to catch the error and continue as below.
	 * The error is logged to the console for debugging purposes.
	 */
	private addCrossOriginShim() {
		const eventUtils = this._tinymce.dom.EventUtils.Event;
		this._tinymce.$.fn.on = function (name: any, callback:any): any {
			this.each(function(index:any, window:any) {
				try {
					eventUtils.bind(window, name, callback);
				} catch (error) {
					// Continue with the execution
					console.log('Error adding handler for ' + name + ': ' + error);
				}
			});
		}
	}
	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._context = context;
		const editor = this._tinymce.get('text_editor' + this._domId);

		// Check if any property values have changed
		if(this._context.updatedProperties.indexOf("htmlText") > -1) {
			
				// If the boundHTML property has changed, update the editor
				this._textValue = this._context.parameters.htmlText.raw || "";
				if (editor && editor.getContent() !== this._textValue && this._context.parameters.htmlText !== null && this._context.parameters.htmlText.raw !== null) {
				editor.setContent(this._textValue);
			
			}
		}
		else
		{
			if(editor.getContent() !== this._textValue) {
				// If the editor has changed, update the output property
				this._notifyOutputChanged();
			}
		}

		// Only update if one of these values has changed
		if (this._context.updatedProperties.indexOf("autoResize") > -1 ||this._context.updatedProperties.indexOf("editorHeight") > -1 || this._context.updatedProperties.indexOf("fontFamily") > -1 || this._context.updatedProperties.indexOf("fontSize") > -1) {
			this._fontFamily = this._context.parameters.fontFamily.raw || "";
			this._autoResize = Boolean(this._context.parameters.autoResize.raw) || false;
			this._fontSize = Number(this._context.parameters.fontSize.raw) || 12;
			this._editorHeight = this._context.parameters.editorHeight.raw || "100%";
			if (editor) {
				editor.remove();
			}
			// Reinitialize TinyMCE with the new height
			this.loadWidget();
		}
	
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		const editor = this._tinymce.get('text_editor' + this._domId);
		return {
			htmlText: editor.getContent()
		}
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}