@builtin "whitespace.ne"

@{%
const flattenExecutable = data => {
    const [id, ...executable] = data[0];
    data[2][id] = executable;
    return data[2];
};

const flattenSingle = data => {
    const [id, ...executable] = data[0];
    return { [id]: executable };
};
%}

kanpai_executable ->
      _element {% flattenSingle %}
    | _iterator {% flattenSingle %}
    | _element _ kanpai_executable {% flattenExecutable %}
    | _iterator _ kanpai_executable {% flattenExecutable %}

_element ->
      identifier _ ":" _ selector _ ";" {% data => [data[0], data[4], '$', 'text'] %}
    | identifier _ ":" _ selector _ "|" _ mapper _ ";" {% data => [data[0], data[4], data[8], 'text'] %}
    | identifier _ ":" _ selector _ "|" _ mapper _ "|" _ filter _ ";" {% data => [data[0], data[4], data[8], data[12]] %}

_iterator ->
    identifier _ "[]" _ ":" _ selector _ brace_open _ kanpai_executable _ brace_close {% data => [data[0], data[6], data[10]] %}

mapper ->
      "$" {% () => '$' %}
    | "[" _ attribute_name _ "]" {% data => `[${data[2]}]` %}
    | function_call

filter -> identifier {% id %}

function_call -> identifier _ "()" {% id %}

brace_open -> "{"
brace_close -> "}"

selector -> [\.#\*0-9a-zA-Z-_>\[\]~+:\(\)='"$| ]:+ {% /*"*/ (data, _, reject) => {
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

identifier -> [a-zA-Z_]:+ {% ([s]) => s.join('') %}
attribute_name -> [a-zA-Z0-9-_]:+ {% ([s]) => s.join('') %}
