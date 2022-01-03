@builtin "string.ne"
@builtin "number.ne"
@builtin "whitespace.ne"
@builtin "postprocessors.ne"

@{%
// From a recursive rule, pick values and flatten them
const recursivePick = (...indices) => (args) => args.filter((arg, index) => indices.includes(index)).flat();
%}

main -> Program

# Punctuators
LB -> "(" 
RB -> ")"
LCB -> "{"
RCB -> "}"
LSB -> "["
RSB -> "]"
PIPE -> "|>"
COMMA -> ","
COLON -> ":"
SEMICOLON -> ";"
DOLLAR -> "$"
TRUE -> "true"i
FALSE -> "false"i
NULL -> "null"i
DOUBLE_DASH -> "//"
ML_COMMENT_START -> "/*"
ML_COMMENT_END -> "*/"

Program ->
     _ SourceElementList _ {% nth(1) %}
    
SourceElementList ->
    SourceElement {% id %}
    | SourceElement _ SourceElementList {% recursivePick(0, 2) %}

SourceElement ->
    Ruleset {% id %}
    | Fragment {% id %}
    | Comment {% () => null %}

Comment ->
    SingleLineComment
    | MultiLineComment

SingleLineComment ->
    DOUBLE_DASH [^\n]:* [\n]

MultiLineComment ->
    ML_COMMENT_START .:* ML_COMMENT_END


Ruleset ->
    LCB _ RCB {% () => ({ type: 'Ruleset', rules: [] }) %}
    | LCB _ RuleList _ RCB {% ([, , rules]) => ({ type: 'Ruleset', rules }) %}

Fragment ->
    FragmentIdentifier _ COLON _ Ruleset {% ([identifier, , , , ruleset]) => ({ type: 'Fragment', identifier: identifier.identifier, ruleset }) %}

RuleList ->
    Rule 
    | Rule _ RuleList  {% recursivePick(0, 2) %}
    
Rule ->
    identifier _ COLON _ _RuleValue _ SEMICOLON {% ([identifier, , , , value]) => ({ type: 'Rule', identifier, ...value }) %}
    | Comment {% () => null %}
    
_RuleValue ->
      Selector {% ([selector]) => ({ selector, filters: [] }) %}
    | Selector _ PIPE _ CallChain {% ([selector, , , , filters]) => ({ selector, filters }) %}


CallChain ->
      Callable
    | Callable _ PIPE _ CallChain  {% recursivePick(0, 4) %}

Callable ->
      identifier {% ([identifier]) => ({ type: 'VariableIdentifier', identifier }) %}
    | FunctionCall {% id %}
    | Ruleset {% id %}
    | FragmentIdentifier {% id %}

FunctionCall ->
    identifier _ LB _ RB {% ([identifier]) => ({ type: 'FunctionCall', identifier, args: [] }) %}
    | identifier _ LB _ CallArguments _ RB {% ([identifier, , , , args]) => ({ type: 'FunctionCall',  identifier, args }) %}

CallArguments ->
      Atom
    | Atom _ COMMA _ CallArguments  {% recursivePick(0, 4) %}

Atom ->
      Boolean {% id %}
    | String {% id %}
    | Number {% id %}
    | Null {% id %}
    | Object {% id %}
    | Array {% id %}
    

Boolean ->
      TRUE {% () => true %}
    | FALSE {% () => false %}

String ->
      dqstring {% id %}
    | sqstring {% id %}

Number ->
      decimal {% id %}

Null ->
    NULL {% () => null %}

Object ->
    LCB _ RCB {% () => ({}) %}
    | LCB _ _ObjectPropertyList _ RCB {% ([, , entries]) => Object.fromEntries(entries) %}

_ObjectPropertyList ->
    _ObjectProperty
    | _ObjectProperty _ COMMA {% ([args]) => [args] %}
    | _ObjectProperty _ COMMA _ _ObjectPropertyList  {% recursivePick(0, 4) %}

_ObjectProperty ->
    identifier _ COLON _ Atom {% ([key, , , , value]) => [key, value] %}
    | String _ COLON _ Atom {% ([key, , , , value]) => [key, value] %}

Array ->
    LSB _ RSB {% () => [] %}
    | LSB _ _ArrayElementList _ RSB {% nth(2) %}

_ArrayElementList ->
    Atom
    | Atom _ COMMA  {% ([args]) => [args] %}
    | Atom _ COMMA _ _ArrayElementList  {% recursivePick(0, 4) %}

Selector -> [\.#\*0-9a-zA-Z-_>\[\]~+:\(\)='"$| ]:+ {% (data, _, reject) => {
    const string = data[0].join('');

    // selector may not start or end with space
    if(string.trim().length === 0 || string[0] === ' ' || string[string.length - 1] === ' '){
        return reject;
    }

    // selector may not contain orphaned pipe
    if(/\|(?!\s*\=)/.test(string)){
        return reject;
    }

    return string;
} %}

FragmentIdentifier -> DOLLAR identifier {% ([, identifier]) => ({ type: 'FragmentIdentifier', identifier }) %}

identifier -> [a-zA-Z_]:+ {% ([s]) => s.join('') %}
attribute_name -> [a-zA-Z0-9-_]:+ {% ([s]) => s.join('') %}