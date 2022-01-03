// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const flattenExecutable = data => {
    const [id, ...executable] = data[0];
    data[2][id] = executable;
    return data[2];
};

const flattenSingle = data => {
    const [id, ...executable] = data[0];
    return { [id]: executable };
};
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "kanpai_executable", "symbols": ["_element"], "postprocess": flattenSingle},
    {"name": "kanpai_executable", "symbols": ["_iterator"], "postprocess": flattenSingle},
    {"name": "kanpai_executable", "symbols": ["_element", "_", "kanpai_executable"], "postprocess": flattenExecutable},
    {"name": "kanpai_executable", "symbols": ["_iterator", "_", "kanpai_executable"], "postprocess": flattenExecutable},
    {"name": "_element", "symbols": ["identifier", "_", {"literal":":"}, "_", "selector", "_", {"literal":";"}], "postprocess": data => [data[0], data[4], '$', 'text']},
    {"name": "_element", "symbols": ["identifier", "_", {"literal":":"}, "_", "selector", "_", {"literal":"|"}, "_", "mapper", "_", {"literal":";"}], "postprocess": data => [data[0], data[4], data[8], 'text']},
    {"name": "_element", "symbols": ["identifier", "_", {"literal":":"}, "_", "selector", "_", {"literal":"|"}, "_", "mapper", "_", {"literal":"|"}, "_", "filter", "_", {"literal":";"}], "postprocess": data => [data[0], data[4], data[8], data[12]]},
    {"name": "_iterator$string$1", "symbols": [{"literal":"["}, {"literal":"]"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "_iterator", "symbols": ["identifier", "_", "_iterator$string$1", "_", {"literal":":"}, "_", "selector", "_", "brace_open", "_", "kanpai_executable", "_", "brace_close"], "postprocess": data => [data[0], data[6], data[10]]},
    {"name": "mapper", "symbols": [{"literal":"$"}], "postprocess": () => '$'},
    {"name": "mapper", "symbols": [{"literal":"["}, "_", "attribute_name", "_", {"literal":"]"}], "postprocess": data => `[${data[2]}]`},
    {"name": "mapper", "symbols": ["function_call"]},
    {"name": "filter", "symbols": ["identifier"], "postprocess": id},
    {"name": "function_call$string$1", "symbols": [{"literal":"("}, {"literal":")"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "function_call", "symbols": ["identifier", "_", "function_call$string$1"], "postprocess": id},
    {"name": "brace_open", "symbols": [{"literal":"{"}]},
    {"name": "brace_close", "symbols": [{"literal":"}"}]},
    {"name": "selector$ebnf$1", "symbols": [/[\.#\*0-9a-zA-Z-_>\[\]~+:\(\)='"$| ]/]},
    {"name": "selector$ebnf$1", "symbols": ["selector$ebnf$1", /[\.#\*0-9a-zA-Z-_>\[\]~+:\(\)='"$| ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "selector", "symbols": ["selector$ebnf$1"], "postprocess":  /*"*/ (data, _, reject) => {
            const string = data[0].join('');
            if(string.trim().length === 0 || string[0] === ' ' || string[string.length - 1] === ' '){
                return reject;
            }
        
            // selector contains orphaned pipe
            if(/\|(?!\s*\=)/.test(string)){
                return reject;
            }
        
            return string;
        } },
    {"name": "identifier$ebnf$1", "symbols": [/[a-zA-Z_]/]},
    {"name": "identifier$ebnf$1", "symbols": ["identifier$ebnf$1", /[a-zA-Z_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "identifier", "symbols": ["identifier$ebnf$1"], "postprocess": ([s]) => s.join('')},
    {"name": "attribute_name$ebnf$1", "symbols": [/[a-zA-Z-_]/]},
    {"name": "attribute_name$ebnf$1", "symbols": ["attribute_name$ebnf$1", /[a-zA-Z-_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "attribute_name", "symbols": ["attribute_name$ebnf$1"], "postprocess": ([s]) => s.join('')}
]
  , ParserStart: "kanpai_executable"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
