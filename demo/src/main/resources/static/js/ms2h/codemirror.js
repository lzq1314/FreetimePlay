function createCodeMirror(el, config) {
    var codemirror,
        privates, publics,
        defaultConfig = {
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
            matchBrackets: true,
            gutter: true,
            autoRefresh :true,
            fixedGutter: true,
            theme: 'base16-dark',
            styleActiveLine: true,
            gutters: [ 'CodeMirror-linenumbers', 'CodeMirror-foldgutter' ],
            foldGutter: false,
            mode: 'text/x-sql'

        };
        
    if(config == undefined)
    	config = defaultConfig;
    else
    	config = $.extend(defaultConfig,config);
    
    codemirror = CodeMirror(el, config);
    
    privates = {
        mode: undefined
    }
    
    publics = {
        setValue: function(value){
            codemirror.setValue(value);
        },
        
        getValue: function() {
            return codemirror.getValue();
        },
        
        setMode: function(mode) {
            codemirror.setOption('mode', mode);
            privates.mode = mode;
        },
        
        getMode: function() {
            return privates.mode;
        },
        
        setCursor: function(cursor) {
            codemirror.setCursor({
                line: cursor.line
            });
        },
        
        getCursor: function() {
            return codemirror.getCursor();
        },
        
        moveLine: function(line) {
            codemirror.setCursor({
                line: line - config.firstLineNumber
            });
        },
        
        reset: function() {
            codemirror.reset();
        },
        
        getName: function() {
            return codemirror.getName();
        },
        
        setReadOnly: function(readOnly) {
            codemirror.setReadOnly(readOnly);
        },
        
        focus: function() {
            codemirror.focus();
        }, 
        
        lineCount: function() {
            return codemirror.lineCount();
        },
        
        autoFormatRange: function(from, to){
            codemirror.autoFormatRange(from, to);
        },
        
        getScrollInfo: function(){
        	return codemirror.getScrollInfo();
        },
        
        scrollTo: function(bottom, top){
        	codemirror.scrollTo(bottom, top);
        },
        
        refresh: function(){
        	codemirror.refresh();
        },

        on: function(type, func){
            codemirror.on(type, func);
        }
    };
    
    return publics;
};


createCodeMirror.MODE = {
    PLSQL: 'text/x-sql',
    
    C: 'text/x-csharp',
    JAVA: 'text/x-csharp',
    
    JSP: 'application/x-jsp',
    
    XML: 'text/html',
    HTML: 'text/html',
    
    JAVASCRIPT: 'text/javascript',
    JSON: 'text/javascript',
    
    PHP: 'text/x-php',
    
    CSS: 'text/css',
    
    TEXT: 'text/plain'
};
